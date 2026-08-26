/**
 * Extract basic webpage metadata.
 *
 * Text processing and DOM/context extraction
 * are handled by lib/selection-utils.js.
 */

export function getPageMetadata() {
  const url = window.location.href

  let domain = ""
  try {
    domain = new URL(url).hostname
  } catch (error) {
    console.error("MemDev: unable to extract domain:", error)
  }

  const title = getBestTitle(domain)

  return { url, title, domain }
}

function getBestTitle(fallbackDomain) {
  const candidates = [
    () => document.title,
    () => document.querySelector('meta[property="og:title"]')?.content,
    () => document.querySelector('meta[name="twitter:title"]')?.content,
    () => document.querySelector("h1")?.innerText
  ]

  for (const getCandidate of candidates) {
    try {
      const value = getCandidate()?.trim()
      if (value) return value
    } catch {
      // ignore and try next fallback
    }
  }

  return fallbackDomain || "Untitled"
}