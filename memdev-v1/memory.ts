export interface Memory {
  unique_id: string
  text: string
  url: string
  title: string
  domain: string
  heading: string
  timestamp: number
}

const STORAGE_KEY = "memdev-memories"

export async function saveMemory(newMemory: Memory): Promise<void>{
  const existingMemories = await getAllMemories();
  existingMemories.push(newMemory);
  
  return new Promise((resolve) => {
    chrome.storage.local.set({ [STORAGE_KEY]: existingMemories }, () => {
      resolve();
    });
  });
}

export async function getAllMemories(): Promise<Memory[]> {
  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      // If nothing is stored yet, return an empty array
      resolve(result[STORAGE_KEY] || []);
    });
  });
}

export async function deleteMemory(idToDelete: string): Promise<void> {
  const existingMemories = await getAllMemories();
  // Keep everything that DOES NOT match the id we want to delete
  const updatedMemories = existingMemories.filter(mem => mem.unique_id !== idToDelete);
  
  return new Promise((resolve) => {
    chrome.storage.local.set({ [STORAGE_KEY]: updatedMemories }, () => {
      resolve();
    });
  });
}