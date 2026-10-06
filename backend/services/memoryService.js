import { findMemoryById, 
        createMemory as createMemoryRepo,
        searchMemories as searchMemoriesRepo 
    } from '../repositories/memoryRepo.js';

import { processMemory } from './memoryProcessingService.js';
import { generateEmbedding } from './embeddingService.js';

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
    };

    const createdMemory = await createMemoryRepo(memoryData);

    await processMemory(createdMemory.id);

    return createdMemory;
}

export async function searchMemories(query, userId) {
    const queryEmbedding = await generateEmbedding(query);

    return await searchMemoriesRepo(
        userId,
        query,
        queryEmbedding
    );
}