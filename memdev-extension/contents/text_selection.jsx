import { useState, useEffect, useRef } from "react"
import TurndownService from "turndown"
import SaveButton from "/components/SaveButton.jsx"
import TagModal from "/components/TagModal.jsx"
import { createMemoryNode } from "/lib/memory.js"
import { getPageMetadata } from "/lib/metadata.js"

const turndownService = new TurndownService()
let debounceTimer = null

export default function CaptureUI() {
  const [selection, setSelection] = useState(null)       // { markdown, rawText, rangeRect }
  const [buttonPosition, setButtonPosition] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const modalOpenRef = useRef(false)

  // ---------- selection detection ----------
  function handleSelection(event = null) {
      console.log(
    "handleSelection called",
    "modalOpen:",
    modalOpenRef.current,
    "event:",
    event?.type,
    "target:",
    event?.target
  )
    if (modalOpenRef.current)  {
    return
  }
    const sel = window.getSelection()

    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
      setButtonPosition(null)
      setSelection(null)
      return
    }

    const selectedText = sel.toString().trim()
    if (!selectedText) {
      setButtonPosition(null)
      setSelection(null)
      return
    }

    const range = sel.getRangeAt(0)
    const fragment = range.cloneContents()

    // Remove non-text media
    fragment
      .querySelectorAll("img, video, audio, svg, canvas, script, style, noscript")
      .forEach((el) => el.remove())

    const container = document.createElement("div")
    container.appendChild(fragment)
    const html = container.innerHTML
    const markdown = turndownService.turndown(html)

    const rect = range.getBoundingClientRect()

    setSelection({
      markdown,
      rawText: selectedText,
      rangeRect: rect
    })

    setButtonPosition({
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX
    })
  }

  useEffect(() => {
    if (showModal) {
    return
  }
    function onMouseUp(event) {
      if (modalOpenRef.current) return
      handleSelection(event)
    }

    function onSelectionChange() {
      if (modalOpenRef.current) return
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
      if (!modalOpenRef.current) {
        handleSelection()
      }
    }, 400)
    }

    document.addEventListener("mouseup", onMouseUp)
    //document.addEventListener("selectionchange", onSelectionChange)

    return () => {
      document.removeEventListener("mouseup", onMouseUp)
      //document.removeEventListener("selectionchange", onSelectionChange)
      if (debounceTimer) clearTimeout(debounceTimer)
    }
  }, [])

  // ---------- messages from popup ----------
  useEffect(() => {
    function onMessage(message, sender, sendResponse) {
      if (message.type === "GET_SELECTION") {
        const text = window.getSelection()?.toString().trim() || ""
        sendResponse({ text })
        return true
      }

      if (message.type === "BUILD_MEMORY_NODE") {
        // Rebuild from current selection
        const sel = window.getSelection()
        if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
          sendResponse(null)
          return true
        }

        const selectedText = sel.toString().trim()
        if (!selectedText) {
          sendResponse(null)
          return true
        }

        const range = sel.getRangeAt(0)
        const fragment = range.cloneContents()
        fragment
          .querySelectorAll("img, video, audio, svg, canvas, script, style, noscript")
          .forEach((el) => el.remove())

        const container = document.createElement("div")
        container.appendChild(fragment)
        const markdown = turndownService.turndown(container.innerHTML)

        const pageMeta = getPageMetadata()
        const memory = createMemoryNode(markdown, pageMeta, {
          selectionType: "text"
        })

        sendResponse(memory)
        return true
      }
    }

    chrome.runtime.onMessage.addListener(onMessage)
    return () => chrome.runtime.onMessage.removeListener(onMessage)
  }, [])

  // ---------- UI handlers ----------
  function handleSaveButton(event) {
    event?.preventDefault()
    event?.stopPropagation()
    if (!selection) return
    if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
    modalOpenRef.current = true
    setShowModal(true)
  }

  function handleCancel() {
    modalOpenRef.current = false
    setShowModal(false)
  }

  function handleSave(userData) {
    if (!selection) return

    const pageMeta = getPageMetadata()
    const memory = createMemoryNode(
      selection.markdown,
      pageMeta,
      { selectionType: "text" },
      {
        title: userData.title,
        note: userData.note,
        tags: userData.tags
      }
    )

    chrome.runtime.sendMessage(
      { type: "SAVE_MEMORY", memory },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError)
          return
        }
        console.log("Save result:", response)
      }
    )

    // Clean up UI
    modalOpenRef.current = false
    setShowModal(false)
    setButtonPosition(null)
    setSelection(null)
    window.getSelection()?.removeAllRanges()
  }

  return (
    <>
      {selection && buttonPosition && !showModal && (
        <SaveButton
          top={buttonPosition.top}
          left={buttonPosition.left}
          onClick={handleSaveButton}
        />
      )}

      {showModal  && (
        <TagModal
          selectedText={selection?.rawText || ""}
          onCancel={handleCancel}
          onSave={handleSave}
        />
      )}
    </>
  )
}
export const config = {
  matches: ["<all_urls>"],
  all_frames: true
}