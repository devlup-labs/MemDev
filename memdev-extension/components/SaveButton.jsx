export default function SaveButton({ top, left, onClick }) {
  return (
    <button
      onMouseDown={(e) => e.preventDefault()} // keep selection
      onClick={onClick}
      style={{
        position: "absolute",          // absolute works better with scrollY
        top: `${top}px`,
        left: `${left}px`,
        zIndex: 2147483647,
        pointerEvents: "auto",
        border: "none",
        borderRadius: "8px",
        padding: "9px 14px",
        background: "#111827",
        color: "white",
        fontSize: "12px",
        fontWeight: "600",
        cursor: "pointer",
        boxShadow: "0 4px 15px rgba(0,0,0,0.25)",
        fontFamily: "system-ui, sans-serif"
      }}
    >
      Save to MemDev
    </button>
  )
}