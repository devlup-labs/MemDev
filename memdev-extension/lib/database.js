import Dexie from "dexie"

export const db = new Dexie("MemDevDB")

// v1 kept for existing installs (upgrade path), v2 adds the permanent store.
db.version(1).stores({
  pending_saves: "memoryId, status, created_at, retry_count, [status+created_at]"
})

db.version(2).stores({
  pending_saves: "memoryId, status, created_at, retry_count, [status+created_at]",
  memories: "memoryId, created_at, domain, *tags"
})

// ============================================================
// Permanent store — the source of truth for "this memory exists".
// Written first, independent of whether the backend sync ever succeeds.
// ============================================================

/**
 * Persist a memory locally, permanently. Upsert (idempotent).
 */
export async function saveMemoryLocal(memory) {
  if (!memory?.memoryId) throw new Error("memory.memoryId is required")

  await db.memories.put({
    memoryId: memory.memoryId,
    memory,
    created_at: memory.metadata?.capture?.capturedAt
      ? new Date(memory.metadata.capture.capturedAt).getTime()
      : Date.now(),
    domain: memory.metadata?.source?.domain || "",
    tags: memory.metadata?.user?.tags || []
  })
}

export async function getAllMemories() {
  return db.memories.orderBy("created_at").reverse().toArray()
}

export async function getMemory(memoryId) {
  return db.memories.get(memoryId)
}

export async function deleteMemory(memoryId) {
  await db.memories.delete(memoryId)
  await db.pending_saves.delete(memoryId)
}

// ============================================================
// Sync queue — tracks which memories still need to reach the backend.
// ============================================================

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
 * Mark a memory as successfully synced. Does NOT touch the permanent
 * `memories` store — that record stays regardless of sync state.
 */
export async function markSynced(memoryId) {
  const existing = await db.pending_saves.get(memoryId)
  if (!existing) return
  await db.pending_saves.update(memoryId, {
    status: "synced",
    synced_at: Date.now()
  })
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