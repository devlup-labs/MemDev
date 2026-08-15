import type { PlasmoCSConfig } from "plasmo";
import TurndownService from "turndown";

const turndownService = new TurndownService();

let debounceTimer: number | null = null;

document.addEventListener("mouseup", () => {
  handleSelection();
});

document.addEventListener("selectionchange", () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = window.setTimeout(() => {
    handleSelection();
  }, 500);
});

function handleSelection() {
  const selection = window.getSelection();

  if (!selection) return;
  if (selection.rangeCount === 0) return;
  if (selection.isCollapsed) return;

  const selectedText = selection.toString().trim();

  if (!selectedText) return;

  console.log("Selected text:");
  console.log(selectedText);

  const range = selection.getRangeAt(0);


  const fragment = range.cloneContents();

  console.log("Fragment:");
  console.log(fragment);

  
  fragment
    .querySelectorAll(
      "img, video, audio, svg, canvas, script, style, noscript"
    ).forEach((element) => {
      element.remove();
    });

  
  const container = document.createElement("div");
  container.appendChild(fragment);

  
  const html = container.innerHTML;

  console.log("Selected HTML:");
  console.log(html);

  const markdown = turndownService.turndown(html);

  console.log("Markdown:");
  console.log(markdown);
  const url = window.location.href
  const domain= window.location.hostname
  const title = document.title
  const time = new Date().toLocaleString();
  const MemoryNode = {markdown, url, domain, title, time}

  console.log("Data sent to popup:");
  console.log(MemoryNode);

  chrome.runtime.sendMessage({
    type: "SELECTION_READY",
    data: MemoryNode
  });
}


export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true,
};