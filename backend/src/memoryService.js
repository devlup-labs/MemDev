import { createMemory as insertMemory } from './memoryrepo.js';

export async function createMemory(memory, userId) {
    return await insertMemory(memory, userId);
}