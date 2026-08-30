import prisma from '../DB/prisma.js';

export async function findMemoryById(ID_memory, userId) { //used for insertion checking
    const memory = await prisma.memories.findUnique({
        where : {
            id: ID_memory
        }
    })

    if (!memory || memory.userId !== userId) {
        return null;
    }

    return memory;
}

export async function findMemoryForProcessing(memoryId) {
    return await prisma.memories.findUnique({
        where: {
            id: memoryId
        }
    });
}

export async function createMemory(memoryData) {
    const {
        id,
        userId,
        content,
        metadata,
        schemaVersion,
        userTitle,
        userNote,
        tags
    } = memoryData;

    return await prisma.memories.create({
        data: {
            id,
            userId,
            content,
            metadata,
            schemaVersion,
            userTitle,
            userNote,
            tags
        }
    });
}

export async function saveEmbedding(memoryId, embedding){
    const vector = `[${embedding.join(",")}]`; //convert into JS readable array from python

    await prisma.$executeRaw`
        UPDATE "Memories"
        SET
            embedding = ${vector}::vector,
            "modelVersion" = 'BAAI/bge-base-en-v1.5',
            "generatedAt" = CURRENT_TIMESTAMP
        WHERE id = ${memoryId}
    `;
}

export async function updateProcessingState(memoryId, state) {
    return await prisma.memories.update({
        where: {
            id: memoryId
        },
        data: {
            processingState: state
        }
    });
}

export async function saveSearchVector(memoryId) {
    await prisma.$executeRaw`
        UPDATE "Memories"
        SET "tsVectorTags" =
            to_tsvector(
                'simple',
                concat_ws(
                    ' ',
                    "userTitle",
                    "userNote",
                    content,
                    COALESCE(metadata->'context'->>'nearestHeading', ''),
                    array_to_string(tags, ' ')
                )
            )
        WHERE id = ${memoryId}
    `;
}