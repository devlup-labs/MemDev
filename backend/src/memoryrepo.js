import prisma from '../DB/prisma.js';

export async function findMemoryById(ID_memory, userId) {
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