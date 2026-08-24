export function generateMemoryId() {
  return crypto.randomUUID()
}
export function createMemoryNode(
  content,
  pageMetadata,
  context,
  userData = {}
) {
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
        capturedAt:
          new Date().toISOString()
      },
      context,
      user: {
        title:
          userData.title || undefined,
        note:
          userData.note || undefined,
        tags:
          userData.tags || []
      }
    },
    schemaVersion: 1
  }
}