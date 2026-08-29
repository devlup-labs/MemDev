import { findMemoryById, 
        createMemory as createMemoryRepo 
    } from './memoryRepo.js';

export async function createMemory(memory, userId) {
    const {
        memoryId,
        content,
        metadata,
        schemaVersion
    } = memory;

    const existingMemory = await findMemoryById(
        memoryId,
        userId
    );

    if (existingMemory) {
        return existingMemory;
    }

    const userMetadata = metadata.user || {};

    const memoryData = {
        id: memoryId,
        userId,

        content,
        metadata,
        schemaVersion,

        userTitle: userMetadata.title ?? null,
        userNote: userMetadata.note ?? null,
        tags: userMetadata.tags ?? []
    };

    return await createMemoryRepo(memoryData);
}