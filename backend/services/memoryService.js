import { findMemoryById, 
        createMemory as createMemoryRepo,
        searchMemories as searchMemoriesRepo,
        updateMemory as updateMemoryRepo 
    } from '../repositories/memoryRepo.js';

import { processMemory } from './memoryProcessingService.js';
import { generateEmbedding } from './embeddingService.js';

export async function createMemory(memory, userId) {
    const {
        memoryId,
        content,
        metadata,
        schemaVersion,
        userTitle,
        userNote,
        tags
    } = memory;

    const existingMemory = await findMemoryById(
        memoryId,
        userId
    );

    if (existingMemory) {
        return existingMemory;
    }

    const memoryData = {
        id: memoryId,
        userId,

        content,
        metadata,
        schemaVersion,

        userTitle: userTitle ?? null,
        userNote: userNote ?? null,
        tags: tags ?? []
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

export async function updateMemory(memoryId, userId, updates) {
    return await updateMemoryRepo(
        memoryId,
        userId,
        updates
    );
}