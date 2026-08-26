import TurndownService from "turndown"

const turndownService = new TurndownService()
const STRIP_SELECTOR = "img, video, audio, svg, canvas, script, style, noscript"
const HEADING_SELECTOR = "h1, h2, h3, h4, h5, h6"

/**
 * Read the current window selection and produce everything a memory
 * node needs: markdown, raw text, the button anchor rect, and the
 * nearest preceding heading. This is the ONLY place selection→markdown
 * conversion happens — both the floating button flow and the
 * BUILD_MEMORY_NODE message handler call this, so they can never drift
 * apart the way the old duplicated code could.
 */
export function extractSelectionData() {
  const sel = window.getSelection()
  if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return null

  const rawText = sel.toString().trim()
  if (!rawText) return null

  const range = sel.getRangeAt(0)
  const fragment = range.cloneContents()

  fragment.querySelectorAll(STRIP_SELECTOR).forEach((el) => el.remove())

  const container = document.createElement("div")
  container.appendChild(fragment)
  const markdown = turndownService.turndown(container.innerHTML)

  const rect = range.getBoundingClientRect()
  const nearestHeading = findNearestHeading(range)

  return { markdown, rawText, rangeRect: rect, nearestHeading }
}

/**
 * Walk backwards through the DOM from the selection start to find the
 * closest preceding heading (h1–h6), searching preceding siblings at
 * each ancestor level before climbing up.
 */
function findNearestHeading(range) {
  let node = range.startContainer
  if (node.nodeType === Node.TEXT_NODE) node = node.parentElement

  let current = node
  while (current && current !== document.body && current !== document.documentElement) {
    let sibling = current

    while (sibling) {
      if (sibling.nodeType === Node.ELEMENT_NODE) {
        if (HEADING_SELECTOR.split(", ").includes(sibling.tagName.toLowerCase())) {
          const text = sibling.innerText?.trim()
          if (text) return text
        }
        const nested = sibling.querySelector?.(HEADING_SELECTOR)
        if (nested) {
          const text = nested.innerText?.trim()
          if (text) return text
        }
      }
      sibling = sibling.previousElementSibling
    }

    current = current.parentElement
  }

  return null
}