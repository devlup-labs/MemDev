import React , { useState } from 'react';
interface TagModalProps {
    OnSave:(data: {
        title? : string
        note? : string
        tags? : string[]
    }) => void;
    onCancel: () => void
}


export default function TagModal({OnSave, 
    onCancel}: TagModalProps) {
        const [title, setTitle] = useState("");
        const [note, setNote] = useState("");
        const [tags, setTags] = useState("");
        const handleSave = () => {
            const parsedTags = tags.split(",")
                                   .map(tag => tag.trim())
                                   .filter(tag => tag.length > 0)
            OnSave({
                title : title.trim() || undefined,
                note : note.trim() || undefined,
                tags : parsedTags 
            })
        };

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
        Save Note
      </h3>

      <label>
        Title
      </label>

      <input
        value={title}
        onChange={e =>
          setTitle(e.target.value)
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

      <label>
        Note
      </label>

      <textarea
        value={note}
        onChange={e =>
          setNote(e.target.value)
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

      <label>
        Tags
      </label>

      <input
        value={tags}
        onChange={e =>
          setTags(e.target.value)
        }
        placeholder="e.g. postgres, database, indexing"
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
        Separate multiple tags with commas.
      </small>

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