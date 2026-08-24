import Dexie from "dexie"
export const db = new Dexie("MemDevDB")
db.version(1).stores({
  pending_saves: "memoryId, status, created_at, retry_count, [status+created_at]"
})
/**
 * Queue a memory for later sync. Idempotent.
 */
export async function queueMemory(memory) {
  if (!memory?.memoryId) throw new Error("memory.memoryId is required")

  const existing = await db.pending_saves.get(memory.memoryId)
  if (existing) return // already queued

  await db.pending_saves.add({
    memoryId: memory.memoryId,
    memory,
    status: "pending",
    created_at: Date.now(),
    retry_count: 0
  })
}

/**
 * Return all still-pending memories (oldest first)
 */
export async function getPendingMemories() {
  return db.pending_saves
    .where("status")
    .equals("pending")
    .sortBy("created_at")
}

/**
 * Mark a memory as successfully synced
 */
export async function markSynced(memoryId) {
  await db.pending_saves.update(memoryId, {
    status: "synced",
    synced_at: Date.now()
  })
  // Optional: delete after a while
  // await db.pending_saves.delete(memoryId)
}

/**
 * Increase retry counter
 */
export async function incrementRetry(memoryId) {
  const item = await db.pending_saves.get(memoryId)
  if (!item) return
  await db.pending_saves.update(memoryId, {
    retry_count: (item.retry_count || 0) + 1
  })
}