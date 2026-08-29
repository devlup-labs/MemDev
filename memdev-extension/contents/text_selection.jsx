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

  function getSelectionContext(range) {
  const startElement =
    range.startContainer.nodeType === Node.ELEMENT_NODE
      ? range.startContainer
      : range.startContainer.parentElement

  const emptyContext = {
    nearestHeading: null,
    headingPath: [],
    parentChain: [],
    surroundingBlocks: {
      before: [],
      after: []
    }
  }

  if (!startElement) {
    return emptyContext
  }

  // --------------------------------------------------
  // BLOCK ELEMENT HELPERS
  // --------------------------------------------------

  const blockTags = new Set([
    "P",
    "DIV",
    "LI",
    "PRE",
    "BLOCKQUOTE",
    "SECTION",
    "ARTICLE"
  ])

  const ignoredTags = new Set([
    "SCRIPT",
    "STYLE",
    "NOSCRIPT",
    "SVG",
    "CANVAS"
  ])

  function isUsefulBlock(element) {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
      return false
    }

    if (ignoredTags.has(element.tagName)) {
      return false
    }

    if (!blockTags.has(element.tagName)) {
      return false
    }

    const text = element.innerText?.trim()

    return Boolean(text)
  }

  // --------------------------------------------------
  // FIND THE BLOCK CONTAINING THE SELECTION
  // --------------------------------------------------

  let blockElement = startElement

  while (
    blockElement &&
    blockElement !== document.body &&
    !blockTags.has(blockElement.tagName)
  ) {
    blockElement = blockElement.parentElement
  }

  // --------------------------------------------------
  // NEAREST HEADING
  // --------------------------------------------------

  let nearestHeading = null
  let current = startElement

  while (current && current !== document.body) {
    const previousElements = []

    let sibling = current.previousElementSibling

    while (sibling) {
      previousElements.push(sibling)
      sibling = sibling.previousElementSibling
    }

    for (const element of previousElements) {
      const heading = element.matches?.("h1, h2, h3")
        ? element
        : element.querySelector?.("h1, h2, h3")

      if (heading) {
        nearestHeading = heading.innerText.trim()
        break
      }
    }

    if (nearestHeading) {
      break
    }

    current = current.parentElement
  }

  // ---------- heading path ----------

const headings = Array.from(
  document.querySelectorAll("h1, h2, h3")
)

const headingPath = []

for (const heading of headings) {
  // Check the document position of the heading
  // relative to the selected element.
  const position = heading.compareDocumentPosition(startElement)

  // If the heading comes AFTER the selected element,
  // we don't want it in the heading path.
  if (position & Node.DOCUMENT_POSITION_PRECEDING) {
    break
  }

  const text = heading.innerText?.trim()

  if (!text) continue

  const level = Number(
    heading.tagName.substring(1)
  )

  // If we encounter a heading at the same or higher
  // level, remove the previous heading(s) from
  // the hierarchy.
  while (
    headingPath.length > 0 &&
    headingPath[headingPath.length - 1].level >= level
  ) {
    headingPath.pop()
  }

  headingPath.push({
    level,
    text
  })
}

// Keep only the final 5 levels of the hierarchy.
const cleanHeadingPath = headingPath
  .slice(-5)
  .map((heading) => heading.text)

  // --------------------------------------------------
  // PARENT CHAIN
  // --------------------------------------------------

  const parentChain = []

  let parent = startElement.parentElement

  while (
    parent &&
    parent !== document.body &&
    parentChain.length < 5
  ) {
    const text = parent.innerText?.trim()

    if (text) {
      parentChain.push(text.slice(0, 500))
    }

    parent = parent.parentElement
  }

  parentChain.reverse()

 // ---------- surrounding blocks ----------

const before = []
const after = []

// Elements that can represent meaningful content blocks.
const blockTags1 = new Set([
  "P",
  "LI",
  "PRE",
  "BLOCKQUOTE",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6"
])

const ignoredTags1 = new Set([
  "SCRIPT",
  "STYLE",
  "NOSCRIPT",
  "SVG",
  "CANVAS"
])

function isMeaningfulBlock(element) {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) {
    return false
  }

  if (ignoredTags1.has(element.tagName)) {
    return false
  }

  if (!blockTags1.has(element.tagName)) {
    return false
  }

  const text = element.innerText?.trim()

  return Boolean(text)
}

// --------------------------------------------------
// FIND THE BLOCK CONTAINING THE SELECTION
// --------------------------------------------------

let selectedBlock = startElement

while (
  selectedBlock &&
  selectedBlock !== document.body &&
  !isMeaningfulBlock(selectedBlock)
) {
  selectedBlock = selectedBlock.parentElement
}

// --------------------------------------------------
// COLLECT ALL MEANINGFUL BLOCKS IN DOCUMENT ORDER
// --------------------------------------------------

const allBlocks = Array.from(
  document.querySelectorAll(
    "p, li, pre, blockquote, h1, h2, h3, h4, h5, h6"
  )
).filter(isMeaningfulBlock)

// --------------------------------------------------
// FIND THE SELECTED BLOCK
// --------------------------------------------------

let selectedIndex = -1

if (selectedBlock) {
  selectedIndex = allBlocks.indexOf(selectedBlock)
}

// --------------------------------------------------
// FIND PREVIOUS BLOCKS
// --------------------------------------------------

if (selectedIndex !== -1) {
  for (
    let i = selectedIndex - 1;
    i >= 0 && before.length < 2;
    i--
  ) {
    const block = allBlocks[i]

    // Don't include something that contains
    // the selected block.
    if (block.contains(selectedBlock)) {
      continue
    }

    const text = block.innerText?.trim()

    if (text) {
      before.unshift(text.slice(0, 500))
    }
  }

  // ------------------------------------------------
  // FIND NEXT BLOCKS
  // ------------------------------------------------

  for (
    let i = selectedIndex + 1;
    i < allBlocks.length && after.length < 2;
    i++
  ) {
    const block = allBlocks[i]

    // Don't include something that contains
    // the selected block.
    if (block.contains(selectedBlock)) {
      continue
    }

    const text = block.innerText?.trim()

    if (text) {
      after.push(text.slice(0, 500))
    }
  }
}

  return {
    nearestHeading,
    headingPath: cleanHeadingPath,
    parentChain,
    surroundingBlocks: {
      before,
      after
    }
  }
}

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
    const context = getSelectionContext(range)
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
      rangeRect: rect,
      context
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
    document.addEventListener("selectionchange", onSelectionChange)

    return () => {
      document.removeEventListener("mouseup", onMouseUp)
      document.removeEventListener("selectionchange", onSelectionChange)
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
    console.log("Cancel clicked")
    window.getSelection()?.removeAllRanges()
    setShowModal(false)
    setButtonPosition(null)
    setSelection(null)
    modalOpenRef.current = false
  }

  function handleSave(userData) {
    if (!selection) return

    const pageMeta = getPageMetadata()
    const memory = createMemoryNode(
      selection.markdown,
      pageMeta,
      selection.context,
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
    window.getSelection()?.removeAllRanges()
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

      {showModal  &&  selection && (
        <TagModal
          selectedText={selection.rawText }
          markdown={selection.markdown}
          pageMetadata={getPageMetadata()}
          context={selection.context}
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