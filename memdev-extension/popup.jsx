import React, { useEffect, useState } from "react"
import { attachUserData } from "~lib/memory"
import { theme } from "~lib/theme"

function Popup() {
  const [selectedText, setSelectedText] = useState("")
  const [title, setTitle] = useState("")
  const [note, setNote] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState("")

  useEffect(() => {
    getSelectedText()
  }, [])

  async function getSelectedText() {
    try {
      setLoading(true)
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
      const activeTab = tabs[0]
      if (!activeTab?.id) {
        setStatus("No active webpage found.")
        return
      }

      const response = await chrome.tabs.sendMessage(activeTab.id, {
        type: "GET_SELECTION"
      })

      if (response?.text) {
        setSelectedText(response.text)
      } else {
        setStatus("Select some text on the webpage first.")
      }
    } catch (error) {
      console.error("Failed to get selected text:", error)
      // Most common cause: no content script on this page (chrome://,
      // Chrome Web Store, or a page loaded before the extension was
      // installed/reloaded).
      setStatus("Reload the page, then try again.")
    } finally {
      setLoading(false)
    }
  }

  function addTag() {
    const tag = tagInput.trim()
    if (!tag) return
    if (tags.some((t) => t.toLowerCase() === tag.toLowerCase())) {
      setTagInput("")
      return
    }
    setTags([...tags, tag])
    setTagInput("")
  }

  function handleTagKeyDown(e) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag()
    }
  }

  function removeTag(tagToRemove) {
    setTags(tags.filter((t) => t !== tagToRemove))
  }

  async function handleSave() {
    if (!selectedText.trim()) {
      setStatus("No text selected.")
      return
    }

    setSaving(true)
    setStatus("")

    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
      const activeTab = tabs[0]
      if (!activeTab?.id) throw new Error("No active tab.")

      const baseMemory = await chrome.tabs.sendMessage(activeTab.id, {
        type: "BUILD_MEMORY_NODE"
      })

      if (!baseMemory) throw new Error("Could not create memory.")

      // Same merge helper the floating modal's createMemoryNode call
      // uses internally — popup and floating-button saves now produce
      // byte-identical metadata.user shapes.
      const memory = attachUserData(baseMemory, { title, note, tags })

      const response = await chrome.runtime.sendMessage({
        type: "SAVE_MEMORY",
        memory
      })

      if (response?.success === false) {
        throw new Error(response.error || "Save failed.")
      }

      setStatus(response.synced ? "✓ Saved & synced" : "✓ Saved (will sync later)")
      setTitle("")
      setNote("")
      setTagInput("")
      setTags([])
    } catch (error) {
      console.error("Save error:", error)
      setStatus("Could not save memory.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.accentBar} />

      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.brand}>
            <div style={styles.logo}>
              <span style={styles.logoLetter}>M</span>
            </div>
            <div>
              <div style={styles.brandName}>MemDev</div>
              <div style={styles.subtitle}>Knowledge capture</div>
            </div>
          </div>
        </div>

        {/* SELECTED TEXT */}
        <div style={styles.section}>
          <div style={styles.labelRow}>
            <span style={styles.label}>Selected Text</span>
            {selectedText && <span style={styles.charCount}>{selectedText.length} chars</span>}
          </div>
          <div style={styles.selectedBox}>
            {loading ? (
              <span style={styles.placeholder}>Reading selection…</span>
            ) : selectedText ? (
              selectedText
            ) : (
              <span style={styles.placeholder}>Select text on the page, then open MemDev</span>
            )}
          </div>
        </div>

        {/* TITLE */}
        <div style={styles.section}>
          <div style={styles.label}>Title</div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Optional title for this memory"
            style={styles.input}
          />
        </div>

        {/* TAGS */}
        <div style={styles.section}>
          <div style={styles.label}>Tags</div>
          <div style={styles.tagBox}>
            {tags.map((tag) => (
              <div key={tag} style={styles.tag}>
                {tag}
                <button onClick={() => removeTag(tag)} style={styles.tagRemove}>
                  ×
                </button>
              </div>
            ))}
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={addTag}
              placeholder={tags.length ? "Add more…" : "Type a tag and press Enter"}
              style={styles.tagInput}
            />
          </div>
        </div>

        {/* NOTE */}
        <div style={styles.section}>
          <div style={styles.label}>Note</div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a personal note (optional)"
            rows={3}
            style={styles.textarea}
          />
        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={handleSave}
          disabled={saving || loading || !selectedText.trim()}
          style={{
            ...styles.saveBtn,
            ...(saving || loading || !selectedText.trim() ? styles.saveBtnDisabled : {})
          }}
        >
          {saving ? "Saving…" : "Save to MemDev"}
        </button>

        {/* STATUS */}
        {status && (
          <div
            style={{
              ...styles.status,
              ...(status.startsWith("✓") ? styles.statusSuccess : styles.statusError)
            }}
          >
            {status}
          </div>
        )}
      </div>
    </div>
  )
}

// ==========================================
// STYLES — now built from the shared theme so this matches TagModal
// ==========================================
const styles = {
  wrapper: {
    width: "360px",
    background: theme.color.bg,
    fontFamily: theme.font
  },
  accentBar: {
    height: "3px",
    background: theme.color.accent
  },
  container: {
    padding: "18px 20px",
    boxSizing: "border-box"
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "16px"
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  logo: {
    width: "30px",
    height: "30px",
    borderRadius: theme.radius.sm,
    background: theme.color.primaryBtnBg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  logoLetter: {
    color: "#ffffff",
    fontWeight: 700,
    fontSize: "14px"
  },
  brandName: {
    fontSize: "14px",
    fontWeight: 650,
    color: theme.color.text
  },
  subtitle: {
    fontSize: "11px",
    color: theme.color.textFaint
  },
  section: {
    marginBottom: "14px"
  },
  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "4px"
  },
  label: {
    display: "block",
    fontSize: "11px",
    fontWeight: 600,
    color: theme.color.textMuted,
    textTransform: "uppercase",
    letterSpacing: "0.04em"
  },
  charCount: {
    fontSize: "11px",
    color: theme.color.textFaint
  },
  selectedBox: {
    padding: "12px",
    minHeight: "60px",
    maxHeight: "100px",
    overflowY: "auto",
    border: `1px solid ${theme.color.border}`,
    borderRadius: theme.radius.sm,
    background: theme.color.surface,
    fontSize: "13px",
    lineHeight: 1.5,
    color: theme.color.text
  },
  placeholder: {
    color: theme.color.textFaint,
    fontStyle: "italic"
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "8px 11px",
    background: theme.color.surface,
    border: `1px solid ${theme.color.border}`,
    borderRadius: theme.radius.sm,
    fontSize: "13px",
    color: theme.color.text,
    outline: "none",
    fontFamily: "inherit"
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "8px 11px",
    background: theme.color.surface,
    border: `1px solid ${theme.color.border}`,
    borderRadius: theme.radius.sm,
    fontSize: "13px",
    color: theme.color.text,
    outline: "none",
    fontFamily: "inherit",
    resize: "none"
  },
  tagBox: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "6px",
    minHeight: "40px",
    padding: "6px 8px",
    border: `1px solid ${theme.color.border}`,
    borderRadius: theme.radius.sm,
    background: theme.color.surface,
    boxSizing: "border-box"
  },
  tag: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "3px 8px",
    borderRadius: "999px",
    background: theme.color.accent,
    color: "#ffffff",
    fontSize: "11px",
    fontWeight: 600
  },
  tagRemove: {
    border: "none",
    background: "transparent",
    padding: 0,
    cursor: "pointer",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: 700,
    lineHeight: 1
  },
  tagInput: {
    flex: 1,
    minWidth: "80px",
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: "13px",
    color: theme.color.text,
    fontFamily: "inherit"
  },
  saveBtn: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: theme.radius.sm,
    background: theme.color.primaryBtnBg,
    color: theme.color.primaryBtnText,
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer"
  },
  saveBtnDisabled: {
    opacity: 0.5,
    cursor: "not-allowed"
  },
  status: {
    marginTop: "10px",
    padding: "8px 11px",
    borderRadius: theme.radius.sm,
    fontSize: "12px",
    fontWeight: 600,
    textAlign: "center"
  },
  statusSuccess: {
    background: "#f0fdf4",
    color: theme.color.success
  },
  statusError: {
    background: "#fef2f2",
    color: theme.color.danger
  }
}

export default Popup