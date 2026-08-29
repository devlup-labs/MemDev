import prisma from '../DB/prisma.js';

export async function createMemory(memoryData) {
    const {
        id,
        userId,
        content,
        metadata,
        schemaVersion,
        userTitle,
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
            tags
        }
    });
}