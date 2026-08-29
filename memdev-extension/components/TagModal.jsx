import React, { useState } from "react"

export default function TagModal({
  selectedText = "",
  markdown = "",
  pageMetadata = {},
  context = {},
  onSave,
  onCancel
}) {
  const [title, setTitle] = useState("")
  const [note, setNote] = useState("")
  const [tags, setTags] = useState("")

  const [nearestHeading, setNearestHeading] = useState(
    context.nearestHeading || ""
  )

  const [headingPath, setHeadingPath] = useState(
    context.headingPath || []
  )

  const [parentChain, setParentChain] = useState(
    context.parentChain || []
  )

  const [beforeBlocks, setBeforeBlocks] = useState(
    context.surroundingBlocks?.before || []
  )

  const [afterBlocks, setAfterBlocks] = useState(
    context.surroundingBlocks?.after || []
  )

  function handleSave() {
    const parsedTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)

    onSave({
      title: title.trim() || undefined,
      note: note.trim() || undefined,
      tags: parsedTags,

      context: {
        nearestHeading: nearestHeading.trim() || null,

        headingPath,

        parentChain,

        surroundingBlocks: {
          before: beforeBlocks,
          after: afterBlocks
        }
      }
    })
  }

  return (
    <div
      data-memdev-ui="true"
      onMouseDown={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      style={modalStyle}
    >
      <h3 style={headingStyle}>
        Save to MemDev
      </h3>

      {/* ================= SELECTED CONTENT ================= */}

      <section style={sectionStyle}>
        <div style={sectionTitle}>
          Selected Markdown
        </div>

        <pre style={markdownStyle}>
          {markdown || "(No markdown content)"}
        </pre>
      </section>

      {/* ================= PAGE METADATA ================= */}

      <section style={sectionStyle}>
        <div style={sectionTitle}>
          Page Metadata
        </div>

        <div style={metadataStyle}>
          <div>
            <strong>Title:</strong>{" "}
            {pageMetadata.title || "—"}
          </div>

          <div>
            <strong>Domain:</strong>{" "}
            {pageMetadata.domain || "—"}
          </div>

          <div style={{ wordBreak: "break-all" }}>
            <strong>URL:</strong>{" "}
            {pageMetadata.url || "—"}
          </div>
        </div>
      </section>

      {/* ================= CONTEXT ================= */}

      <section style={sectionStyle}>
        <div style={sectionTitle}>
          Context
        </div>

        {/* Nearest heading */}
        <label style={labelStyle}>
          Nearest Heading
        </label>

        <input
          value={nearestHeading}
          onChange={(e) => setNearestHeading(e.target.value)}
          placeholder="No heading detected"
          style={inputStyle}
        />

        {/* Heading path */}
        <label style={labelStyle}>
          Heading Path
        </label>

        <textarea
          value={headingPath.join("\n")}
          onChange={(e) =>
            setHeadingPath(
              e.target.value
                .split("\n")
                .map((x) => x.trim())
                .filter(Boolean)
            )
          }
          rows={3}
          placeholder="Heading hierarchy"
          style={textareaStyle}
        />

        {/* Parent chain */}
        <label style={labelStyle}>
          Parent Chain
        </label>

        <textarea
          value={parentChain.join("\n")}
          onChange={(e) =>
            setParentChain(
              e.target.value
                .split("\n")
                .map((x) => x.trim())
                .filter(Boolean)
            )
          }
          rows={3}
          placeholder="Parent elements"
          style={textareaStyle}
        />

        {/* Surrounding blocks */}
        <label style={labelStyle}>
          Surrounding Content — Before
        </label>

        <textarea
          value={beforeBlocks.join("\n\n")}
          onChange={(e) =>
            setBeforeBlocks(
              e.target.value
                .split("\n\n")
                .map((x) => x.trim())
                .filter(Boolean)
            )
          }
          rows={4}
          placeholder="Content before selection"
          style={textareaStyle}
        />

        <label style={labelStyle}>
          Surrounding Content — After
        </label>

        <textarea
          value={afterBlocks.join("\n\n")}
          onChange={(e) =>
            setAfterBlocks(
              e.target.value
                .split("\n\n")
                .map((x) => x.trim())
                .filter(Boolean)
            )
          }
          rows={4}
          placeholder="Content after selection"
          style={textareaStyle}
        />
      </section>

      {/* ================= USER DATA ================= */}

      <section style={sectionStyle}>
        <div style={sectionTitle}>
          Your Details
        </div>

        <label style={labelStyle}>
          Title
        </label>

        <input
          id="memdev-title"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Optional title"
          style={inputStyle}
        />

        <label style={labelStyle}>
          Note
        </label>

        <textarea
          id="memdev-note"
          name="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional personal note"
          rows={3}
          style={textareaStyle}
        />

        <label style={labelStyle}>
          Tags
        </label>

        <input
          id="memdev-tags"
          name="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="postgres, indexing, performance"
          style={inputStyle}
        />

        <small style={{ color: "#6b7280", fontSize: "11px" }}>
          Separate tags with commas
        </small>
      </section>

      {/* ================= BUTTONS ================= */}

      <div style={buttonContainer}>
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            handleSave()
          }}
          style={primaryBtn}
        >
          Save
        </button>

        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            onCancel()
          }}
          style={secondaryBtn}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

const modalStyle = {
  position: "fixed",
  zIndex: 2147483647,

  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",

  width: "520px",
  maxWidth: "90vw",
  maxHeight: "85vh",

  overflowY: "auto",

  background: "white",
  borderRadius: "12px",

  padding: "22px",

  boxShadow: "0 12px 40px rgba(0,0,0,0.25)",

  fontFamily: "system-ui, -apple-system, sans-serif",
  color: "#111"
}

const headingStyle = {
  margin: "0 0 18px",
  fontSize: "17px"
}

const sectionStyle = {
  marginBottom: "18px"
}

const sectionTitle = {
  fontSize: "13px",
  fontWeight: 700,
  marginBottom: "8px"
}

const labelStyle = {
  display: "block",
  fontSize: "12px",
  fontWeight: 600,
  marginBottom: "4px",
  marginTop: "10px"
}

const metadataStyle = {
  fontSize: "12px",
  lineHeight: 1.6,
  background: "#f3f4f6",
  padding: "10px",
  borderRadius: "8px"
}

const markdownStyle = {
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",

  fontFamily:
    "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",

  fontSize: "12px",
  lineHeight: 1.5,

  background: "#f3f4f6",
  padding: "12px",
  borderRadius: "8px",

  maxHeight: "220px",
  overflowY: "auto",

  margin: 0
}

const inputStyle = {
  width: "100%",
  marginBottom: "8px",

  padding: "9px 10px",
  boxSizing: "border-box",

  border: "1px solid #e5e7eb",
  borderRadius: "8px",

  fontSize: "13px",
  outline: "none"
}

const textareaStyle = {
  ...inputStyle,
  resize: "vertical",
  fontFamily: "inherit"
}

const buttonContainer = {
  display: "flex",
  gap: "10px",
  marginTop: "10px"
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