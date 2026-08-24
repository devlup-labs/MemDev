import { queueMemory, getPendingMemories, markSynced, incrementRetry } from "/lib/database.js"

const MAX_RETRIES = 5
const SYNC_ALARM = "memdev-sync"

// ---------- message handling ----------
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SAVE_MEMORY") {
    handleSaveMemory(message.memory)
      .then((result) => sendResponse(result))
      .catch((error) => {
        console.error("Save failed:", error)
        sendResponse({ success: false, error: error.message })
      })
    return true // keep channel open for async response
  }

  if (message.type === "SYNC_NOW") {
    syncPending()
      .then(() => sendResponse({ success: true }))
      .catch((e) => sendResponse({ success: false, error: e.message }))
    return true
  }
})

// ---------- core save ----------
async function handleSaveMemory(memory) {
  if (!memory || !memory.memoryId) {
    throw new Error("Invalid memory: missing memoryId")
  }

  // Always queue first (offline-first)
  await queueMemory(memory)

  // Try immediate sync
  try {
    await syncOne(memory)
    await markSynced(memory.memoryId)
    return { success: true, synced: true }
  } catch (err) {
    console.warn("Immediate sync failed, will retry later:", err.message)
    return { success: true, synced: false }
  }
}

// ---------- sync helpers ----------
async function syncOne(memory) {
  // Replace with your real backend endpoint
  const response = await fetch("https://your-api.example.com/memories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // "Authorization": "Bearer ..." // if needed
    },
    body: JSON.stringify(memory)
  })

  if (!response.ok) {
    throw new Error(`Backend responded ${response.status}`)
  }
  return response.json()
}

async function syncPending() {
  const pending = await getPendingMemories()
  for (const item of pending) {
    if (item.retry_count >= MAX_RETRIES) continue

    try {
      await syncOne(item.memory)
      await markSynced(item.memoryId)
    } catch (err) {
      console.warn(`Retry failed for ${item.memoryId}:`, err.message)
      await incrementRetry(item.memoryId)
    }
  }
}

// ---------- alarms & lifecycle ----------
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create(SYNC_ALARM, { periodInMinutes: 2 })
})

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === SYNC_ALARM) {
    syncPending()
  }
})

// Also sync when the service worker wakes up
chrome.runtime.onStartup.addListener(() => {
  syncPending()
})