import React from "react";

interface SaveButtonProps {
    top: number;
    left: number;
    onClick: () => void;
}

export default function SaveButton({ top, left, onClick }: SaveButtonProps) {
    return (
        <button
            onMouseDown={(e) =>
        e.preventDefault()
      }
      onClick={onClick}
      style={{
        position: "fixed",

        top: `${top}px`,
        left: `${left}px`,

        zIndex: 2147483647,

        padding: "8px 12px",

        border: "none",

        borderRadius: "6px",

        background: "#111827",

        color: "white",

        fontSize: "13px",

        cursor: "pointer",

        boxShadow:
          "0 3px 12px rgba(0,0,0,0.25)"
      }}
    >
      Save
    </button>
  )
}