import React, { useState } from "react"

export default function TagModal({ selectedText = "", onSave, onCancel }) {
  const [title, setTitle] = useState("")
  const [note, setNote] = useState("")
  const [tags, setTags] = useState("")

  function handleSave() {
    const parsedTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)

    onSave({
      title: title.trim() || undefined,
      note: note.trim() || undefined,
      tags: parsedTags
    })
  }

  return (
    <div
      data-memdev-ui="true"
      onMouseDown={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "fixed",
        zIndex: 2147483647,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "340px",
        background: "white",
        borderRadius: "12px",
        padding: "22px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
        fontFamily: "system-ui, -apple-system, sans-serif",
        color: "#111"
      }}
    >
      <h3 style={{ margin: "0 0 14px", fontSize: "16px" }}>Save to MemDev</h3>

      {/* Preview of selected text */}
      {selectedText && (
        <div
          style={{
            fontSize: "12px",
            background: "#f3f4f6",
            padding: "10px",
            borderRadius: "8px",
            maxHeight: "80px",
            overflow: "auto",
            marginBottom: "14px",
            color: "#374151",
            lineHeight: 1.4
          }}
        >
          {selectedText.slice(0, 300)}
          {selectedText.length > 300 ? "…" : ""}
        </div>
      )}

      <label style={{ fontSize: "12px", fontWeight: 600 }}>Title</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Optional title"
        style={inputStyle}
      />

      <label style={{ fontSize: "12px", fontWeight: 600 }}>Note</label>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Optional personal note"
        rows={3}
        style={{ ...inputStyle, resize: "vertical" }}
      />

      <label style={{ fontSize: "12px", fontWeight: 600 }}>Tags</label>
      <input
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="postgres, indexing, performance"
        style={inputStyle}
      />
      <small style={{ color: "#6b7280", fontSize: "11px" }}>
        Separate tags with commas
      </small>

      <div style={{ display: "flex", gap: "10px", marginTop: "18px" }}>
        <button onClick={handleSave} style={primaryBtn}>
          Save
        </button>
        <button onClick={onCancel} style={secondaryBtn}>
          Cancel
        </button>
      </div>
    </div>
  )
}

const inputStyle = {
  width: "100%",
  marginTop: "4px",
  marginBottom: "12px",
  padding: "9px 10px",
  boxSizing: "border-box",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  fontSize: "13px",
  outline: "none"
}

const primaryBtn = {
  flex: 1,
  padding: "10px",
  background: "#111827",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontWeight: 600,
  cursor: "pointer"
}

const secondaryBtn = {
  flex: 1,
  padding: "10px",
  background: "#f3f4f6",
  color: "#111",
  border: "none",
  borderRadius: "8px",
  fontWeight: 600,
  cursor: "pointer"
}