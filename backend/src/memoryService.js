import { createMemory as createMemoryRepo } from './memoryRepo.js';

export async function createMemory(memory, userId) {
    const {
        memoryId,
        content,
        metadata,
        schemaVersion
    } = memory;

    const userMetadata = metadata.user || {};

    const memoryData = {
        id: memoryId,
        userId,

        content,
        metadata,
        schemaVersion,

        userTitle: userMetadata.title ?? null,
        tags: userMetadata.tags ?? []
    };

    return await createMemoryRepo(memoryData);
}