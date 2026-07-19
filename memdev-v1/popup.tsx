// popup.tsx
import { useEffect, useState } from "react";
import { getAllMemories, deleteMemory } from "./memory";
import type {Memory} from "./memory"

function Popup() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getAllMemories().then((data) => {
      data.sort((a, b) => b.timestamp - a.timestamp);
      setMemories(data);
      setIsLoading(false);
    });
  }, []);

  // --- STYLES ---
  const containerStyle: React.CSSProperties = {
    width: "380px",
    maxHeight: "450px",
    overflowY: "auto",
    padding: "16px",
    fontFamily: "system-ui, -apple-system, sans-serif",
    backgroundColor: "#f3f4f6",
    boxSizing: "border-box"
  };

  const headerStyle: React.CSSProperties = {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#111827",
    marginTop: "0",
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  };

  const cardStyle: React.CSSProperties = {
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "12px",
    marginBottom: "12px",
    backgroundColor: "#ffffff",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: 600,
    color: "#1f2937",
    marginBottom: "6px",
    display: "block"
  };

  const textStyle: React.CSSProperties = {
    fontSize: "13px",
    color: "#4b5563",
    marginBottom: "10px",
    lineHeight: "1.4"
  };

  const domainBadgeStyle: React.CSSProperties = {
    display: "inline-block",
    fontSize: "11px",
    fontWeight: 500,
    color: "#4338ca",
    backgroundColor: "#e0e7ff",
    padding: "3px 8px",
    borderRadius: "12px",
    textDecoration: "none"
  };

    const handleDelete = async (id: string) => {
    await deleteMemory(id); // Delete from storage
    
    // Re-fetch the data and update the UI
    const data = await getAllMemories();
    data.sort((a, b) => b.timestamp - a.timestamp);
    setMemories(data);
  };

  // --- UI ---
  if (isLoading) {
    return <div style={{ ...containerStyle, color: "#6b7280" }}>Loading memories...</div>;
  }

  if (memories.length === 0) {
    return <div style={{ ...containerStyle, color: "#6b7280" }}>No memories saved yet. Highlight some text on a webpage!</div>;
  }

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>
        🧠 MemDev Dashboard
      </h2>
      
      {memories.map((mem) => (
        <div key={mem.unique_id} style={cardStyle}>
          
          {/* Header row with Title and Delete Button */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span style={{ ...titleStyle, flex: 1, marginRight: "8px" }}>
              {mem.heading || mem.title}
            </span>
            <button 
              onClick={() => handleDelete(mem.unique_id)}
              style={{ 
                background: "none", 
                border: "none", 
                color: "#9ca3af", 
                cursor: "pointer", 
                fontSize: "14px",
                padding: "0 0 0 4px",
                lineHeight: 1
              }}
              title="Delete memory"
            >
              ✕
            </button>
          </div>

          <p style={textStyle}>
            "{mem.text.substring(0, 120)}{mem.text.length > 120 ? "..." : ""}"
          </p>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
            <a href={mem.url} target="_blank" rel="noreferrer" style={domainBadgeStyle}>
              {mem.domain}
            </a>
            
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "10px", color: "#6b7280" }}>
                {new Date(mem.timestamp).toLocaleString()}
              </div>
              <div style={{ fontSize: "9px", color: "#9ca3af", fontFamily: "monospace" }}>
                ID: {mem.unique_id.substring(0, 8)}...
              </div>
            </div>
          </div>
          
        </div>
      ))}
    </div>
  );
}

export default Popup;