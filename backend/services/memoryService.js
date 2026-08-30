import { findMemoryById, 
        createMemory as createMemoryRepo 
    } from '../repositories/memoryRepo.js';

import { processMemory } from './memoryProcessingService.js';

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
        tags: userMetadata.tags ?? [],

        processingState: "PERSISTED"
    };

    const createdMemory = await createMemoryRepo(memoryData);

    await processMemory(createdMemory.id);

    return createdMemory;
}