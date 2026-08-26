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
      style={{
        position: "fixed",
        zIndex: 2147483647,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "350px",
        background: "#ffffff",
        borderRadius: "16px",
        padding: "20px 22px",
        boxShadow: "0 20px 50px -10px rgba(15, 23, 42, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.06)",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: "#0f172a",
        boxSizing: "border-box"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
        <div
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#4f46e5"
          }}
        />
        <h3
          style={{
            margin: 0,
            fontSize: "15px",
            fontWeight: 650,
            letterSpacing: "-0.01em",
            color: "#0f172a"
          }}
        >
          Save to MemDev
        </h3>
      </div>

      {/* Preview of selected text */}
      {selectedText && (
        <div
          style={{
            fontSize: "12px",
            background: "#f8fafc",
            borderLeft: "3px solid #4f46e5",
            borderTop: "1px solid #f1f5f9",
            borderRight: "1px solid #f1f5f9",
            borderBottom: "1px solid #f1f5f9",
            padding: "9px 12px",
            borderRadius: "0 8px 8px 0",
            maxHeight: "72px",
            overflow: "auto",
            marginBottom: "14px",
            color: "#475569",
            lineHeight: 1.5,
            fontStyle: "italic"
          }}
        >
          “{selectedText.slice(0, 300)}
          {selectedText.length > 300 ? "…" : ""}”
        </div>
      )}

      <label style={labelStyle}>Title</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Optional title"
        style={inputStyle}
      />

      <label style={labelStyle}>Note</label>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Optional personal note"
        rows={3}
        style={{ ...inputStyle, resize: "none" }}
      />

      <label style={labelStyle}>Tags</label>
      <input
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="postgres, indexing, performance"
        style={{ ...inputStyle, marginBottom: "4px" }}
      />
      <small style={{ color: "#94a3b8", fontSize: "11px", display: "block", marginBottom: "16px" }}>
        Separate tags with commas
      </small>

      <div
        style={{
          display: "flex",
          gap: "8px",
          paddingTop: "14px",
          borderTop: "1px solid #f1f5f9"
        }}
      >
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

const labelStyle = {
  display: "block",
  fontSize: "11px",
  fontWeight: 600,
  color: "#475569",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  marginBottom: "4px"
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "8px 11px",
  marginBottom: "12px",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  fontSize: "13px",
  color: "#0f172a",
  outline: "none",
  fontFamily: "inherit"
}

const primaryBtn = {
  flex: 1.2,
  padding: "9px 14px",
  background: "#0f172a",
  color: "#ffffff",
  border: "none",
  borderRadius: "8px",
  fontSize: "13px",
  fontWeight: 600,
  cursor: "pointer"
}

const secondaryBtn = {
  flex: 1,
  padding: "9px 14px",
  background: "#f1f5f9",
  color: "#475569",
  border: "none",
  borderRadius: "8px",
  fontSize: "13px",
  fontWeight: 600,
  cursor: "pointer"
}