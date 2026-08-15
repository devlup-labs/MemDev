import React, {
  useState
} from "react"

export default function TagModal({
  onSave,
  onCancel
}) {
  const [title, setTitle] =
    useState("")

  const [note, setNote] =
    useState("")

  const [tags, setTags] =
    useState("")

  function handleSave() {
    const parsedTags =
      tags
        .split(",")
        .map((tag) => tag.trim())
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

        transform:
          "translate(-50%, -50%)",

        width: "320px",

        background: "white",

        borderRadius: "10px",

        padding: "20px",

        boxShadow:
          "0 8px 30px rgba(0,0,0,0.25)",

        fontFamily:
          "Arial, sans-serif"
      }}
    >

      <h3>
        Save to MemDev
      </h3>

      {/* TITLE */}

      <label>
        Title
      </label>

      <input
        value={title}
        onChange={(event) =>
          setTitle(event.target.value)
        }
        placeholder="Optional title"
        style={{
          width: "100%",
          marginTop: "5px",
          marginBottom: "12px",
          padding: "8px",
          boxSizing: "border-box"
        }}
      />

      {/* NOTE */}

      <label>
        Note
      </label>

      <textarea
        value={note}
        onChange={(event) =>
          setNote(event.target.value)
        }
        placeholder="Optional personal note"
        rows={3}
        style={{
          width: "100%",
          marginTop: "5px",
          marginBottom: "12px",
          padding: "8px",
          boxSizing: "border-box"
        }}
      />

      {/* TAGS */}

      <label>
        Tags
      </label>

      <input
        value={tags}
        onChange={(event) =>
          setTags(event.target.value)
        }
        placeholder=
          "postgres, database, indexing"
        style={{
          width: "100%",
          marginTop: "5px",
          marginBottom: "5px",
          padding: "8px",
          boxSizing: "border-box"
        }}
      />

      <small
        style={{
          color: "#666"
        }}
      >
        Separate tags using commas.
      </small>

      {/* BUTTONS */}

      <div
        style={{
          display: "flex",
          gap: "8px",
          marginTop: "16px"
        }}
      >

        <button
          onClick={handleSave}
          style={{
            flex: 1,
            padding: "9px"
          }}
        >
          Save
        </button>

        <button
          onClick={onCancel}
          style={{
            flex: 1,
            padding: "9px"
          }}
        >
          Cancel
        </button>

      </div>

    </div>
  )
}