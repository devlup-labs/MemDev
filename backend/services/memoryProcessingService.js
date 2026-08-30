import { findMemoryForProcessing, saveEmbedding, updateProcessingState } from "../repositories/memoryRepo.js";
import { generateEmbedding } from "./embeddingService.js";

const retries = 5;

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
                await updateProcessingState(memoryId, "INDEXED");

                console.log("Memory saved successfully");
            } catch(error) {
                console.error("Failed to process memory");
                await updateProcessingState(memoryId, "FAILED");
            }
            break;

        case "INDEXED":
            // already processed
            return;

        case "NEEDS_REEMBED":
            // process again
            break;

        case "FAILED":
            // retry
            break;

        default:
            console.warn(
                `Unknown processing state: ${memory.processingState}`
            );
            return;
    }
}