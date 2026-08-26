/**
 * During dev (HMR reloads), a stale content-script instance keeps
 * running with dead references to chrome.runtime. Any sendMessage
 * call from that zombie instance throws "Extension context
 * invalidated." These helpers make that failure quiet and recoverable
 * instead of an unhandled error.
 */

export function isExtensionContextValid() {
  try {
    return !!(chrome?.runtime && chrome.runtime.id)
  } catch {
    return false
  }
}

export async function safeSendMessage(message) {
  if (!isExtensionContextValid()) {
    console.warn("MemDev: extension context invalidated, message dropped:", message?.type)
    return null
  }

  try {
    return await chrome.runtime.sendMessage(message)
  } catch (err) {
    if (String(err?.message).includes("Extension context invalidated")) {
      console.warn("MemDev: extension context invalidated during send")
      return null
    }
    throw err
  }
}