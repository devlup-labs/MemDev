export function generateMemoryId() {
  return crypto.randomUUID()
}

/**
 * Canonical memory node shape. Every consumer (floating modal, popup,
 * background sync) must build/merge data through this file so the
 * schema can't silently drift between call sites.
 */
export function createMemoryNode(content, pageMetadata, context = {}, userData = {}) {
  return {
    memoryId: generateMemoryId(),
    content: content.trim(),
    metadata: {
      source: {
        url: pageMetadata.url,
        title: pageMetadata.title,
        domain: pageMetadata.domain
      },
      capture: {
        capturedAt: new Date().toISOString()
      },
      context: {
        selectionType: context.selectionType || "text",
        nearestHeading: context.nearestHeading || null
      },
      user: normalizeUserData(userData)
    },
    schemaVersion: 1
  }
}

/**
 * Normalize raw form input (title/note/tags strings from either the
 * popup or the TagModal) into the canonical `metadata.user` shape.
 */
export function normalizeUserData(userData = {}) {
  return {
    title: userData.title?.trim() || undefined,
    note: userData.note?.trim() || undefined,
    tags: Array.isArray(userData.tags) ? userData.tags.filter(Boolean) : []
  }
}

/**
 * Merge user-entered fields (title/note/tags) into an existing memory
 * node without touching source/context/capture. Used by the popup,
 * which builds the base memory via BUILD_MEMORY_NODE and then attaches
 * the form fields the user filled in.
 */
export function attachUserData(memory, userData = {}) {
  return {
    ...memory,
    metadata: {
      ...memory.metadata,
      user: normalizeUserData(userData)
    }
  }
}