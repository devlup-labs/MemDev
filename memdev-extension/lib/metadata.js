/**
 * Extract basic webpage metadata.
 *
 * Text processing and DOM/context extraction
 * are handled by content.jsx.
 */

export function getPageMetadata() {
  const url = window.location.href

  let domain = ""

  try {
    domain = new URL(url).hostname
  } catch (error) {
    console.error(
      "Unable to extract domain:",
      error
    )
  }

  return {
    url,
    title: document.title || "",
    domain
  }
}