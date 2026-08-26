import { useState, useEffect } from "react"
import SaveButton from "./components/SaveButton.jsx"
import TagModal from "./components/TagModal.jsx"
import { createMemoryNode } from "./lib/memory.js"
import { getPageMetadata } from "./lib/metadata.js"
import { extractSelectionData } from "./lib/selection-utils.js"
import { isExtensionContextValid, safeSendMessage } from "../lib/runtime_guard.js"

let debounceTimer = null

export default function CaptureUI() {
  const [selection, setSelection] = useState(null) // { markdown, rawText, rangeRect, nearestHeading }
  const [buttonPosition, setButtonPosition] = useState(null)
  const [showModal, setShowModal] = useState(false)

  // ---------- selection detection ----------
  function handleSelection() {
    const data = extractSelectionData()

    if (!data) {
      setButtonPosition(null)
      setSelection(null)
      return
    }

    setSelection(data)
    setButtonPosition({
      top: data.rangeRect.bottom + window.scrollY + 8,
      left: data.rangeRect.left + window.scrollX
    })
  }

  useEffect(() => {
    function onMouseUp() {
      handleSelection()
    }

    function onSelectionChange() {
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(handleSelection, 400)
    }

    document.addEventListener("mouseup", onMouseUp)
    document.addEventListener("selectionchange", onSelectionChange)

    return () => {
      document.removeEventListener("mouseup", onMouseUp)
      document.removeEventListener("selectionchange", onSelectionChange)
      if (debounceTimer) clearTimeout(debounceTimer)
    }
  }, [])

  // ---------- messages from popup ----------
  useEffect(() => {
    if (!isExtensionContextValid()) return

    function onMessage(message, sender, sendResponse) {
      if (message.type === "GET_SELECTION") {
        const text = window.getSelection()?.toString().trim() || ""
        sendResponse({ text })
        return true
      }

      if (message.type === "BUILD_MEMORY_NODE") {
        // Rebuild from current selection via the SAME extraction path
        // used by the floating button, so popup and floating-button
        // saves can never produce different markdown for the same text.
        const data = extractSelectionData()
        if (!data) {
          sendResponse(null)
          return true
        }

        const pageMeta = getPageMetadata()
        const memory = createMemoryNode(data.markdown, pageMeta, {
          selectionType: "text",
          nearestHeading: data.nearestHeading
        })

        sendResponse(memory)
        return true
      }
    }

    chrome.runtime.onMessage.addListener(onMessage)
    return () => {
      try {
        chrome.runtime.onMessage.removeListener(onMessage)
      } catch {
        // context already gone (HMR reload) — nothing to clean up
      }
    }
  }, [])

  // ---------- UI handlers ----------
  function handleSaveButton() {
    if (!selection) return
    setShowModal(true)
  }

  function handleCancel() {
    setShowModal(false)
  }

  async function handleSave(userData) {
    if (!selection) return

    const pageMeta = getPageMetadata()
    const memory = createMemoryNode(
      selection.markdown,
      pageMeta,
      { selectionType: "text", nearestHeading: selection.nearestHeading },
      { title: userData.title, note: userData.note, tags: userData.tags }
    )

    const response = await safeSendMessage({ type: "SAVE_MEMORY", memory })
    if (response === null) {
      console.warn("MemDev: could not reach background — reload the page and try again")
    } else {
      console.log("Save result:", response)
    }

    // Clean up UI regardless — don't leave a stuck modal on failure
    setShowModal(false)
    setButtonPosition(null)
    setSelection(null)
    window.getSelection()?.removeAllRanges()
  }

  return (
    <>
      {selection && buttonPosition && !showModal && (
        <SaveButton top={buttonPosition.top} left={buttonPosition.left} onClick={handleSaveButton} />
      )}

      {showModal && selection && (
        <TagModal selectedText={selection.rawText} onCancel={handleCancel} onSave={handleSave} />
      )}
    </>
  )
}