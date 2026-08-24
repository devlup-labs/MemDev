import React, { useEffect, useState } from "react"

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
      setStatus("Unable to read selected text.")
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

      const memory = await chrome.tabs.sendMessage(activeTab.id, {
        type: "BUILD_MEMORY_NODE"
      })

      if (!memory) throw new Error("Could not create memory.")

      memory.metadata.user = {
        title: title.trim() || undefined,
        note: note.trim() || undefined,
        tags
      }

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
      {/* Top accent bar */}
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

          <div style={styles.onlineBadge}>
            <div style={styles.onlineDot} />
            Online
          </div>
        </div>

        {/* SELECTED TEXT */}
        <div style={styles.section}>
          <div style={styles.labelRow}>
            <span style={styles.label}>Selected Text</span>
            {selectedText && (
              <span style={styles.charCount}>
                {selectedText.length} chars
              </span>
            )}
          </div>
          <div style={styles.selectedBox}>
            {loading ? (
              <span style={styles.placeholder}>Reading selection…</span>
            ) : selectedText ? (
              selectedText
            ) : (
              <span style={styles.placeholder}>
                Select text on the page, then open MemDev
              </span>
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
                <button
                  onClick={() => removeTag(tag)}
                  style={styles.tagRemove}
                >
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
            ...(saving || loading || !selectedText.trim()
              ? styles.saveBtnDisabled
              : {})
          }}
        >
          {saving ? "Saving…" : "Save to MemDev"}
        </button>

        {/* STATUS */}
        {status && (
          <div
            style={{
              ...styles.status,
              ...(status.startsWith("✓")
                ? styles.statusSuccess
                : styles.statusError)
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
// STYLES – Colourful & Attractive version
// ==========================================
const styles = {
  container: {
    width: "380px",
    padding: "22px",
    boxSizing: "border-box",
    background: "linear-gradient(160deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)",
    color: "#f8fafc",
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    borderRadius: "0 0 16px 16px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "24px"
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },

  logo: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #6366f1, #a855f7, #ec4899)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "800",
    boxShadow: "0 6px 20px rgba(168, 85, 247, 0.5)"
  },

  brandName: {
    fontSize: "19px",
    fontWeight: "700",
    background: "linear-gradient(90deg, #a5b4fc, #e879f9)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },

  subtitle: {
    fontSize: "12px",
    color: "#c4b5fd",
    marginTop: "2px"
  },

  onlineDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#22c55e",
    boxShadow: "0 0 0 4px rgba(34, 197, 94, 0.3)"
  },

  section: {
    marginBottom: "18px"
  },

  label: {
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.8px",
    color: "#a5b4fc",
    marginBottom: "8px",
    textTransform: "uppercase"
  },

  selectedText: {
    padding: "14px",
    minHeight: "70px",
    maxHeight: "110px",
    overflowY: "auto",
    border: "1px solid rgba(165, 180, 252, 0.25)",
    borderRadius: "12px",
    background: "rgba(15, 23, 42, 0.6)",
    fontSize: "13px",
    lineHeight: "1.55",
    color: "#e0e7ff",
    boxShadow: "inset 0 2px 8px rgba(0,0,0,0.3)"
  },

  muted: {
    color: "#94a3b8",
    fontStyle: "italic"
  },

  input: {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid rgba(165, 180, 252, 0.3)",
    borderRadius: "10px",
    outline: "none",
    boxSizing: "border-box",
    fontSize: "14px",
    background: "rgba(15, 23, 42, 0.5)",
    color: "#f1f5f9"
  },

  tagContainer: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "8px",
    minHeight: "46px",
    padding: "8px 10px",
    border: "1px solid rgba(165, 180, 252, 0.3)",
    borderRadius: "10px",
    background: "rgba(15, 23, 42, 0.5)",
    boxSizing: "border-box"
  },

  tag: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    padding: "5px 12px",
    borderRadius: "20px",
    background: "linear-gradient(135deg, #6366f1, #a855f7)",
    color: "#ffffff",
    fontSize: "12px",
    fontWeight: "600",
    boxShadow: "0 3px 10px rgba(99, 102, 241, 0.4)"
  },

  removeTag: {
    border: "none",
    background: "transparent",
    padding: "0",
    cursor: "pointer",
    color: "rgba(255,255,255,0.85)",
    fontSize: "15px",
    fontWeight: "700"
  },

  tagInput: {
    flex: "1",
    minWidth: "100px",
    border: "none",
    outline: "none",
    padding: "5px",
    fontSize: "13px",
    background: "transparent",
    color: "#e0e7ff"
  },

  helper: {
    marginTop: "6px",
    fontSize: "11px",
    color: "#a5b4fc"
  },

  textarea: {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid rgba(165, 180, 252, 0.3)",
    borderRadius: "10px",
    outline: "none",
    resize: "vertical",
    boxSizing: "border-box",
    fontSize: "14px",
    fontFamily: "inherit",
    background: "rgba(15, 23, 42, 0.5)",
    color: "#f1f5f9"
  },

  // ===== SAVE BUTTON – colourful & attractive =====
  saveButton: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 8px 25px rgba(168, 85, 247, 0.45)",
    letterSpacing: "0.3px",
    transition: "transform 0.15s, box-shadow 0.15s"
  },

  status: {
    marginTop: "14px",
    textAlign: "center",
    fontSize: "13px",
    fontWeight: "600",
    color: "#c4b5fd"
  },


  statusSuccess: {
    background: "rgba(34, 197, 94, 0.12)",
    color: "#4ade80",
    border: "1px solid rgba(34, 197, 94, 0.25)"
  },

  statusError: {
    background: "rgba(239, 68, 68, 0.12)",
    color: "#f87171",
    border: "1px solid rgba(239, 68, 68, 0.25)"
  }
}

export default Popup