/**
 * In-iframe inspector script for the visual editor.
 * Captures clicks on elements and sends their source location to the parent frame.
 * Only loaded in development mode (injected by inject-inspector Vite plugin).
 */

import { init as initSectionMenu, enable as enableSectionMenu, disable as disableSectionMenu, closeDropdown as closeSectionDropdown } from "./section-menu";

const SOURCE_KEY = Symbol.for("__jsxSource__");

interface SourceInfo {
  fileName: string;
  lineNumber: number;
  columnNumber: number;
  displayName: string;
}

interface ParentInfo {
  tagName: string;
  className: string;
  sourceFile: string;
  sourceLine: number;
}

interface ArrayContext {
  arrayName: string;
  arrayLine: number;
  mapLine: number;
  itemIndex: number;
  totalItems: number;
}

interface SelectPayload {
  sourceFile: string;
  sourceLine: number;
  sectionFile: string | null;
  sectionLine: number | null;
  tagName: string;
  textContent: string;
  className: string;
  href: string | null;
  containsImage: boolean;
  imgSrc: string | null;
  rect: { top: number; left: number; width: number; height: number };
  parentChain: ParentInfo[];
  arrayContext: ArrayContext | null;
}

let enabled = false;
let overlay: HTMLDivElement | null = null;
let selectedOverlay: HTMLDivElement | null = null;
let multiSelectedOverlays: HTMLDivElement[] = [];
let multiSelectedElements: HTMLElement[] = [];
let inlineEditing: HTMLElement | null = null;
let inlineOriginalText = "";
let hoverPreviewEl: HTMLElement | null = null;
let hoverPreviewOriginalClass = "";

function createOverlay(color: string, zIndex: number): HTMLDivElement {
  const el = document.createElement("div");
  el.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: ${zIndex};
    border: 2px solid ${color};
    border-radius: 3px;
    background: ${color}15;
    transition: all 0.1s ease;
    display: none;
  `;
  document.body.appendChild(el);
  return el;
}

function positionOverlay(el: HTMLDivElement, rect: DOMRect) {
  el.style.top = rect.top + "px";
  el.style.left = rect.left + "px";
  el.style.width = rect.width + "px";
  el.style.height = rect.height + "px";
  el.style.display = "block";
}

function hideOverlay(el: HTMLDivElement | null) {
  if (el) el.style.display = "none";
}

/** Get source info from an element's Symbol property (set by jsx-runtime-tagger). */
function getSourceInfo(el: HTMLElement): SourceInfo | null {
  return (el as unknown as Record<symbol, SourceInfo>)[SOURCE_KEY] ?? null;
}

/** Walk up the DOM to find the nearest element with source info. */
function findSourceElement(target: HTMLElement): HTMLElement | null {
  let el: HTMLElement | null = target;
  while (el && el !== document.body) {
    if (getSourceInfo(el)) return el;
    el = el.parentElement;
  }
  return null;
}

/** Walk up from an element to find the nearest <section> ancestor with source info. */
function findSectionAncestor(el: HTMLElement): HTMLElement | null {
  let current: HTMLElement | null = el.parentElement;
  while (current && current !== document.body) {
    if (current.tagName === "SECTION" && getSourceInfo(current)) {
      return current;
    }
    current = current.parentElement;
  }
  return null;
}

/** Find a DOM element by its source file and line using sourceElementMap. */
function findElementBySource(sourceFile: string, sourceLine: number): HTMLElement | null {
  const sourceMap = (window as unknown as { sourceElementMap: Map<string, Set<WeakRef<Element>>> }).sourceElementMap;
  if (!sourceMap) return null;

  // Search all keys matching file:line:*
  for (const [key, refs] of sourceMap) {
    const [file, line] = key.split(":");
    if (file === sourceFile && parseInt(line, 10) === sourceLine) {
      for (const ref of refs) {
        const node = ref.deref() as HTMLElement | undefined;
        if (node) return node;
      }
    }
  }
  return null;
}

function detectImage(el: HTMLElement): { containsImage: boolean; imgSrc: string | null } {
  // Element IS an <img>
  if (el.tagName === "IMG") {
    return { containsImage: true, imgSrc: (el as HTMLImageElement).src || null };
  }
  // Element contains a child <img>
  const childImg = el.querySelector("img");
  if (childImg) {
    return { containsImage: true, imgSrc: childImg.src || null };
  }
  // Image placeholder container: has aspect-ratio class and contains SVG but no text
  const cls = el.getAttribute("class") || "";
  if (/aspect-/.test(cls) && el.querySelector("svg") && !el.textContent?.trim()) {
    return { containsImage: true, imgSrc: null };
  }
  return { containsImage: false, imgSrc: null };
}

/** Walk from element up to <section>, collecting ancestors with source info. */
function buildParentChain(el: HTMLElement): ParentInfo[] {
  const chain: ParentInfo[] = [];
  let current = el.parentElement;
  while (current && current !== document.body && chain.length < 6) {
    const info = getSourceInfo(current);
    if (info) {
      chain.push({
        tagName: current.tagName,
        className: (current.getAttribute("class") || "").slice(0, 50),
        sourceFile: info.fileName,
        sourceLine: info.lineNumber,
      });
    }
    if (current.tagName === "SECTION") break;
    current = current.parentElement;
  }
  return chain;
}

/**
 * Detect array/.map() context using sourceElementMap.
 * Elements rendered inside a .map() share the same file:line:col source key.
 * If multiple elements exist for the same key, they're loop siblings.
 */
function detectArrayContext(el: HTMLElement): ArrayContext | null {
  const info = getSourceInfo(el);
  if (!info) return null;

  const sourceMap = (window as unknown as { sourceElementMap: Map<string, Set<WeakRef<Element>>> }).sourceElementMap;
  if (!sourceMap) return null;

  const key = `${info.fileName}:${info.lineNumber}:${info.columnNumber}`;
  const refs = sourceMap.get(key);
  if (!refs || refs.size <= 1) return null; // not a loop — single element

  // Collect live elements, determine this element's index by DOM order
  const liveElements: Element[] = [];
  const deadRefs: WeakRef<Element>[] = [];
  for (const ref of refs) {
    const node = ref.deref();
    if (node) {
      liveElements.push(node);
    } else {
      deadRefs.push(ref);
    }
  }
  // Clean up dead refs
  for (const dead of deadRefs) refs.delete(dead);

  if (liveElements.length <= 1) return null;

  // Sort by DOM order
  liveElements.sort((a, b) => {
    const pos = a.compareDocumentPosition(b);
    return pos & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
  });

  const itemIndex = liveElements.indexOf(el);
  if (itemIndex === -1) return null;

  // Walk up to find the container element — its source line is near the array definition
  const container = el.parentElement;
  const containerInfo = container ? getSourceInfo(container) : null;
  const arrayLine = containerInfo?.lineNumber ?? info.lineNumber;

  return {
    arrayName: "", // not available without Babel scope analysis
    arrayLine,
    mapLine: info.lineNumber,
    itemIndex,
    totalItems: liveElements.length,
  };
}

function buildPayload(el: HTMLElement): SelectPayload {
  const rect = el.getBoundingClientRect();
  const section = findSectionAncestor(el);
  const sectionInfo = section ? getSourceInfo(section) : null;
  const info = getSourceInfo(el);
  const { containsImage, imgSrc } = detectImage(el);

  return {
    sourceFile: info?.fileName || "",
    sourceLine: info?.lineNumber || 0,
    sectionFile: sectionInfo?.fileName || null,
    sectionLine: sectionInfo?.lineNumber || null,
    tagName: el.tagName,
    textContent: (el.textContent || "").trim().slice(0, 200),
    className: el.getAttribute("class") || "",
    href: el.getAttribute("href") || el.closest("a")?.getAttribute("href") || null,
    containsImage,
    imgSrc,
    rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
    parentChain: buildParentChain(el),
    arrayContext: detectArrayContext(el),
  };
}

function handleMouseMove(e: MouseEvent) {
  if (!enabled || inlineEditing) return;
  const target = e.target as HTMLElement;
  const sourceEl = findSourceElement(target);
  if (sourceEl) {
    if (!overlay) overlay = createOverlay("#3b82f6", 99998);
    positionOverlay(overlay, sourceEl.getBoundingClientRect());
  } else {
    hideOverlay(overlay);
  }
}

function clearMultiSelect() {
  multiSelectedOverlays.forEach((o) => o.remove());
  multiSelectedOverlays = [];
  multiSelectedElements = [];
}

function handleClick(e: MouseEvent) {
  if (!enabled) return;
  // Don't select while inline editing — let the contentEditable handle clicks
  if (inlineEditing) return;
  const target = e.target as HTMLElement;
  const sourceEl = findSourceElement(target);
  if (!sourceEl) return;

  e.preventDefault();
  e.stopPropagation();
  closeSectionDropdown();

  if (e.shiftKey) {
    // Multi-select: toggle element in/out of selection
    const idx = multiSelectedElements.indexOf(sourceEl);
    if (idx >= 0) {
      // Remove from multi-selection
      multiSelectedElements.splice(idx, 1);
      multiSelectedOverlays[idx].remove();
      multiSelectedOverlays.splice(idx, 1);
    } else {
      // Add to multi-selection
      multiSelectedElements.push(sourceEl);
      const ov = createOverlay("#7f56d9", 99999);
      positionOverlay(ov, sourceEl.getBoundingClientRect());
      multiSelectedOverlays.push(ov);
    }
    // Send multi-select payload
    if (multiSelectedElements.length > 0) {
      const payloads = multiSelectedElements.map(buildPayload);
      window.parent.postMessage({ type: "inspector:multi-select", payloads }, "*");
    } else {
      window.parent.postMessage({ type: "inspector:multi-select", payloads: [] }, "*");
    }
    return;
  }

  // Regular click: clear multi-selection, single-select
  clearMultiSelect();

  // Show persistent selection overlay
  if (!selectedOverlay) selectedOverlay = createOverlay("#7f56d9", 99999);
  positionOverlay(selectedOverlay, sourceEl.getBoundingClientRect());

  const payload = buildPayload(sourceEl);
  window.parent.postMessage({ type: "inspector:select", payload }, "*");
}

/* ─── Inline text editing ─── */

/** Check if an element is a leaf text node suitable for inline editing. */
function isEditableTextElement(el: HTMLElement): boolean {
  // Must have text content
  if (!el.textContent?.trim()) return false;
  // Skip elements with structural children (only allow purely text elements)
  for (let i = 0; i < el.children.length; i++) {
    const child = el.children[i] as HTMLElement;
    // SVG icons, images, etc. are structural — not editable inline
    if (child.tagName === "SVG" || child.tagName === "IMG") return false;
    // If child has its own source info AND has text, it's structural
    if (getSourceInfo(child) && child.textContent?.trim()) return false;
  }
  return true;
}

function startInlineEdit(el: HTMLElement) {
  if (inlineEditing) finishInlineEdit(true); // cancel any existing

  inlineEditing = el;
  inlineOriginalText = el.textContent || "";

  el.contentEditable = "true";
  el.style.outline = "2px dashed #7c3aed";
  el.style.outlineOffset = "2px";
  el.style.borderRadius = "2px";
  el.style.minWidth = "20px";
  el.focus();

  // Select all text for easy replacement
  const range = document.createRange();
  range.selectNodeContents(el);
  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);

  el.addEventListener("keydown", handleInlineKeyDown);
  el.addEventListener("blur", handleInlineBlur);
}

function finishInlineEdit(cancel: boolean) {
  if (!inlineEditing) return;
  const el = inlineEditing;
  const newText = (el.textContent || "").trim();

  el.contentEditable = "false";
  el.style.outline = "";
  el.style.outlineOffset = "";
  el.style.borderRadius = "";
  el.removeEventListener("keydown", handleInlineKeyDown);
  el.removeEventListener("blur", handleInlineBlur);

  if (cancel) {
    el.textContent = inlineOriginalText;
  } else if (newText && newText !== inlineOriginalText.trim()) {
    // Send edit to parent
    const sourceEl = findSourceElement(el) || el;
    const sourceInfo = getSourceInfo(sourceEl);
    window.parent.postMessage({
      type: "inspector:inline-edit",
      payload: {
        sourceFile: sourceInfo?.fileName || "",
        sourceLine: sourceInfo?.lineNumber || 0,
        oldText: inlineOriginalText.trim(),
        newText,
      },
    }, "*");
  }

  inlineEditing = null;
  inlineOriginalText = "";
}

function handleInlineKeyDown(e: KeyboardEvent) {
  if (e.key === "Escape") {
    e.preventDefault();
    e.stopPropagation();
    finishInlineEdit(true);
  } else if (e.key === "Enter" && !e.shiftKey) {
    // Single-line elements (headings, buttons, spans) commit on Enter
    const el = inlineEditing;
    if (el && /^(H[1-6]|SPAN|BUTTON|A|P|LI|LABEL)$/.test(el.tagName)) {
      e.preventDefault();
      e.stopPropagation();
      finishInlineEdit(false);
    }
  }
}

function handleInlineBlur() {
  // Small delay to allow click-away to register
  setTimeout(() => finishInlineEdit(false), 100);
}

function handleDoubleClick(e: MouseEvent) {
  if (!enabled) return;
  if (inlineEditing) return; // already editing

  const target = e.target as HTMLElement;
  const sourceEl = findSourceElement(target);
  if (!sourceEl) return;

  // Check if this is a text-editable element
  if (!isEditableTextElement(sourceEl)) return;

  e.preventDefault();
  e.stopPropagation();

  startInlineEdit(sourceEl);
}

function enable() {
  enabled = true;
  document.body.style.cursor = "crosshair";
  enableSectionMenu();
}

function disable() {
  enabled = false;
  document.body.style.cursor = "";
  hideOverlay(overlay);
  hideOverlay(selectedOverlay);
  clearMultiSelect();
  if (inlineEditing) finishInlineEdit(true);
  disableSectionMenu();
}

// Listen for messages from parent
window.addEventListener("message", (e) => {
  if (!e.data?.type) return;
  switch (e.data.type) {
    case "inspector:enable":
      enable();
      break;
    case "inspector:disable":
      disable();
      break;
    case "inspector:highlight": {
      const selector = e.data.selector as string;
      if (selector) {
        try {
          const el = document.querySelector(selector) as HTMLElement;
          if (el) {
            if (!selectedOverlay) selectedOverlay = createOverlay("#7f56d9", 99999);
            positionOverlay(selectedOverlay, el.getBoundingClientRect());
          }
        } catch { /* invalid selector */ }
      }
      break;
    }
    case "inspector:select-element": {
      // Parent requests selection of a specific element by source file + line
      const { sourceFile, sourceLine } = e.data as { sourceFile: string; sourceLine: number };
      const target = findElementBySource(sourceFile, sourceLine);
      if (target) {
        if (!selectedOverlay) selectedOverlay = createOverlay("#7f56d9", 99999);
        positionOverlay(selectedOverlay, target.getBoundingClientRect());
        const payload = buildPayload(target);
        window.parent.postMessage({ type: "inspector:select", payload }, "*");
      }
      break;
    }
    case "inspector:force-hover": {
      // Apply hover: classes as base classes for preview
      const { sourceFile: sf, sourceLine: sl } = e.data as { sourceFile: string; sourceLine: number };
      const el = findElementBySource(sf, sl);
      if (el) {
        // Release any previous preview
        if (hoverPreviewEl) {
          hoverPreviewEl.setAttribute("class", hoverPreviewOriginalClass);
        }
        hoverPreviewEl = el;
        hoverPreviewOriginalClass = el.getAttribute("class") || "";
        const classes = hoverPreviewOriginalClass.split(/\s+/).filter(Boolean);
        // Extract hover: classes, strip prefix, add as base classes
        const hoverClasses: string[] = [];
        for (const cls of classes) {
          if (cls.startsWith("hover:")) {
            hoverClasses.push(cls.slice(6)); // strip "hover:"
          }
        }
        if (hoverClasses.length > 0) {
          // Remove any existing base classes that conflict, then add hover versions
          const baseClassSet = new Set(classes);
          for (const hc of hoverClasses) {
            baseClassSet.add(hc);
          }
          el.setAttribute("class", Array.from(baseClassSet).join(" "));
        }
      }
      break;
    }
    case "inspector:release-hover": {
      // Restore original classes
      if (hoverPreviewEl) {
        hoverPreviewEl.setAttribute("class", hoverPreviewOriginalClass);
        hoverPreviewEl = null;
        hoverPreviewOriginalClass = "";
      }
      break;
    }
  }
});

document.addEventListener("mousemove", handleMouseMove, true);
document.addEventListener("click", handleClick, true);
document.addEventListener("dblclick", handleDoubleClick, true);

// Initialize section menu UI
initSectionMenu();

// Notify parent that inspector is ready
window.parent.postMessage({ type: "inspector:ready" }, "*");
