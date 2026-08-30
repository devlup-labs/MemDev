import { findMemoryForProcessing, saveEmbedding, 
        updateProcessingState, saveSearchVector,
        incrementRetryCount, resetRetryCount } from "../repositories/memoryRepo.js";
import { generateEmbedding } from "./embeddingService.js";


function buildEmbeddingtext(memory){
    const context = memory.metadata?.context ?? {}; //still unclear on the surrounding block type metadata thing, will add later only this part requires changing
    return `
                
    Title: ${memory.userTitle ?? ""}
    
    nearestHeading: ${context.nearestHeading ?? ""}
    Heading Path: ${context.headingPath?.join(" > ") ?? ""}
    Parent Chain: ${context.parentChain?.join(" > ") ?? ""}
    
    Content: ${memory.content}
    
    Surrounding Content Before:
    ${context.surroundingBlocks?.before?.join("\n") ?? ""}

    Surrounding Content After:
    ${context.surroundingBlocks?.after?.join("\n") ?? ""}
    
    Notes: ${memory.userNote ?? ""}
    Tags: ${memory.tags?.join(", ") ?? ""}`.trim();
}

const PROCESSING_GRACE_PERIOD_MS = 60 * 1000;

export function needsReprocessing(memory) {
    if (!memory.embeddingGeneratedAt) {
        return true;
    }

    if (!memory.searchVectorGeneratedAt) {
        return true;
    }

    const updatedAt = memory.updatedAt.getTime();

    const embeddingGeneratedAt =
        memory.embeddingGeneratedAt.getTime();

    const searchVectorGeneratedAt =
        memory.searchVectorGeneratedAt.getTime();

    return (
        updatedAt > embeddingGeneratedAt + PROCESSING_GRACE_PERIOD_MS ||
        updatedAt > searchVectorGeneratedAt + PROCESSING_GRACE_PERIOD_MS
    );
}


export async function processMemory(memoryId) {
    const memory = await findMemoryForProcessing(memoryId);

    if (!memory) {
        console.log(`Memory ID: ${memoryId} not found`);
        return;
    }

    switch (memory.processingState) {
        case "PERSISTED":
            try{
                const embeddingText = buildEmbeddingtext(memory);
                const embedding = await generateEmbedding(embeddingText);

                await saveEmbedding(memoryId, embedding);
                await saveSearchVector(memoryId);
                
                await updateProcessingState(memoryId, "INDEXED");

                await resetRetryCount(memoryId); // only after confirmed indexation

                console.log("Memory saved successfully");

            } catch(error) {
                console.error("Failed to process memory");
                
                await incrementRetryCount(memoryId);
                await updateProcessingState(memoryId, "FAILED");
            }
            break;

        case "INDEXED": //"INDEXED" case is already processed so no need for that, just putting a checker here now
            if (needsReprocessing(memory)) {
                await updateProcessingState(memoryId,"NEEDS_REEMBED");

                return processMemory(memoryId);
            }

            return;

        case "NEEDS_REEMBED":
            try{
                const embeddingText = buildEmbeddingtext(memory);
                const embedding = await generateEmbedding(embeddingText);

                await saveEmbedding(memoryId, embedding);
                await saveSearchVector(memoryId);
                
                await updateProcessingState(memoryId, "INDEXED");

                await resetRetryCount(memoryId); // only after confirmed indexation

                console.log("Memory saved successfully");

            } catch(error) {
                console.error("Failed to process memory");
                
                await incrementRetryCount(memoryId);
                await updateProcessingState(memoryId, "FAILED");
            }
            break;

        case "FAILED":
            if (memory.retryCount >= 5) {
                console.error("Memory has exceeded the retry limit");
                return;
            }
            //logic goes here for a better memory failure case

            break;

        default:
            console.warn(
                `Unknown processing state: ${memory.processingState}`
            );
            return;
    }
}