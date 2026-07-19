import { saveMemory } from "./memory";
import type { Memory } from "./memory";
import type { PlasmoCSConfig } from "plasmo";

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
};

// We store a reference to the button so we can remove it easily later
let floatingButton: HTMLButtonElement | null = null;

document.addEventListener("mouseup", async (event: MouseEvent) => {
  // Small delay to let the browser finalize the selection
  await new Promise((resolve) => setTimeout(resolve, 10));

  const selection = window.getSelection();
  
  if (!selection || selection.isCollapsed || selection.toString().trim().length === 0) { //to check for empty selections
    removeFloatingButton();
    return;
  }

    // Extract the selection and its Range
  const text = selection.toString().trim();
  const range = selection.getRangeAt(0);

  // Get the element where the selection started
  const parentElement = range.startContainer.parentElement;
  
  // Walk up the DOM tree to find the closest H1, H2, or H3
  const headingElement = parentElement?.closest("h1, h2, h3");
  
  const newMemory: Memory = {
    unique_id: crypto.randomUUID(),
    text: text,
    url: window.location.href,
    title: document.title,
    domain: window.location.hostname,
    heading: headingElement ? headingElement.textContent?.trim() || "" : "",
    timestamp: Date.now(),
  };

  //Get coordinates for the floating button
  const rect = range.getBoundingClientRect();
  showFloatingButton(rect.left, rect.bottom, newMemory)

});


function showFloatingButton(x: number, y: number, memoryData: Memory) {
  removeFloatingButton();

  floatingButton = document.createElement("button");
  floatingButton.innerText = "Save to MemDev";
  
  Object.assign(floatingButton.style, {
    position: "fixed",
    left: `${x}px`,
    top: `${y + 5}px`, 
    zIndex: "999999", 
    backgroundColor: "#4F46E5",
    color: "white",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    border: "none",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    fontSize: "14px",
    fontFamily: "sans-serif"
  });

  // 4. What happens when they click it?
  floatingButton.addEventListener("click", async (e) => {
    e.stopPropagation(); // Don't trigger the website's clicks
    e.preventDefault();
    
    if (!floatingButton) return;
    floatingButton.innerText = "Saving..."; 
    
    try {
      // Open the envelope and save the data!
      await saveMemory(memoryData); 
      floatingButton.innerText = "Saved!";
      
      // Un-highlight the text on the page
      window.getSelection()?.removeAllRanges();
      
      // Wait 1 second, then remove the button
      setTimeout(() => removeFloatingButton(), 1000);
    } catch (error) {
      console.error("MemDev Save Error:", error);
      if (floatingButton) floatingButton.innerText = "Error!";
      setTimeout(() => removeFloatingButton(), 2000);
    }
  });

  document.body.appendChild(floatingButton);
}

function removeFloatingButton() {
  if (floatingButton) {
    floatingButton.remove();
    floatingButton = null;
  }
}

// 6. The Cleanup Crew
window.addEventListener("scroll", removeFloatingButton, true);
document.addEventListener("mousedown", (e) => {
  if (floatingButton && !floatingButton.contains(e.target as Node)) {
    removeFloatingButton();
  }
}, true);