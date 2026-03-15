/**
 * Floating section menu for the visual editor.
 * Shows a settings trigger on section hover; dropdown with spacing, theme, AI edit, and actions.
 * Runs inside the iframe as vanilla JS with inline styles (no React, no Tailwind).
 */

const SOURCE_KEY = Symbol.for("__jsxSource__");

interface SourceInfo {
  fileName: string;
  lineNumber: number;
  columnNumber: number;
  displayName: string;
}

function getSourceInfo(el: HTMLElement): SourceInfo | null {
  return (el as unknown as Record<symbol, SourceInfo>)[SOURCE_KEY] ?? null;
}

let menuEnabled = false;
let hoveredSection: HTMLElement | null = null;
let menuOpen = false;
let hideTimer: ReturnType<typeof setTimeout> | null = null;

// DOM elements
let triggerBtn: HTMLDivElement | null = null;
let dropdown: HTMLDivElement | null = null;
let sectionHighlight: HTMLDivElement | null = null;

// Detected state from current section
let currentSpacing = "lg";
let currentTheme = "default";

/* ─── Spacing / Theme maps ─── */

const SPACING_MAP: Record<string, string> = {
  none: "py-0",
  sm: "py-8 md:py-12",
  md: "py-12 md:py-16",
  lg: "py-16 md:py-24",
  xl: "py-24 md:py-32",
};

const SPACING_LABELS: { key: string; label: string }[] = [
  { key: "none", label: "None" },
  { key: "sm", label: "S" },
  { key: "md", label: "M" },
  { key: "lg", label: "L" },
  { key: "xl", label: "XL" },
];

const THEME_OPTIONS: { key: string; label: string }[] = [
  { key: "default", label: "Default" },
  { key: "subtle", label: "Subtle" },
  { key: "inverse", label: "Inverse" },
  { key: "brand", label: "Brand" },
  { key: "brand-gradient", label: "Gradient" },
];

/* ─── Detection utilities ─── */

function detectSpacing(section: HTMLElement): string {
  const cls = section.className;
  if (/\bpy-0\b/.test(cls)) return "none";
  if (/\bpy-24\b/.test(cls)) return "xl";
  if (/\bpy-16\b/.test(cls)) return "lg";
  if (/\bpy-12\b/.test(cls)) return "md";
  if (/\bpy-8\b/.test(cls)) return "sm";
  return "lg";
}

function detectTheme(section: HTMLElement): string {
  const cls = section.className;
  if (/\btheme-brand-gradient\b/.test(cls)) return "brand-gradient";
  if (/\btheme-brand\b/.test(cls)) return "brand";
  if (/\btheme-inverse\b/.test(cls)) return "inverse";
  if (/\btheme-alt\b/.test(cls)) return "subtle";
  return "default";
}

function deriveSectionName(section: HTMLElement): string {
  const info = getSourceInfo(section);
  const file = info?.fileName || "";
  const name = file.split("/").pop()?.replace(/\.tsx?$/, "") || "Section";
  return name.replace(/Section$/, "").replace(/([a-z])([A-Z])/g, "$1 $2");
}

function findNearestSection(el: HTMLElement): HTMLElement | null {
  let current: HTMLElement | null = el;
  while (current && current !== document.body) {
    if (current.tagName === "SECTION" && getSourceInfo(current)) return current;
    current = current.parentElement;
  }
  return null;
}

/* ─── PostMessage ─── */

function sendAction(action: string, params: Record<string, unknown> = {}): void {
  if (!hoveredSection) return;
  const info = getSourceInfo(hoveredSection);
  window.parent.postMessage({
    type: "section:action",
    action,
    sectionFile: info?.fileName || "",
    sectionLine: info?.lineNumber || 0,
    params,
  }, "*");
}

/* ─── DOM creation ─── */

function createSectionHighlight(): HTMLDivElement {
  const el = document.createElement("div");
  el.style.cssText = `
    position: fixed; pointer-events: none; z-index: 99989;
    border: 1.5px dashed rgba(127,86,217,0.3); border-radius: 4px;
    transition: all 0.15s ease; display: none;
  `;
  document.body.appendChild(el);
  return el;
}

function createTrigger(): HTMLDivElement {
  const btn = document.createElement("div");
  btn.setAttribute("data-section-menu", "trigger");
  btn.style.cssText = `
    position: fixed; z-index: 99990; display: none; cursor: pointer;
    padding: 5px 10px; background: rgba(255,255,255,0.95);
    backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
    border-radius: 8px; box-shadow: 0 2px 12px rgba(0,0,0,0.12);
    border: 1px solid rgba(0,0,0,0.08);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 11px; font-weight: 600; color: #374151;
    align-items: center; gap: 5px; user-select: none;
    transition: opacity 0.15s;
  `;
  btn.innerHTML = `
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0">
      <circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
    <span data-section-menu="name" style="max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"></span>
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="flex-shrink:0;opacity:0.5">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  `;
  document.body.appendChild(btn);

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (menuOpen) {
      _closeDropdown();
    } else {
      openDropdown();
    }
  });

  return btn;
}

function createDropdown(): HTMLDivElement {
  const dd = document.createElement("div");
  dd.setAttribute("data-section-menu", "dropdown");
  dd.style.cssText = `
    position: fixed; z-index: 99991; display: none; width: 272px;
    background: #fff; border-radius: 12px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.16);
    border: 1px solid rgba(0,0,0,0.08);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    max-height: 70vh; overflow-y: auto; overflow-x: hidden;
    user-select: none;
  `;

  dd.innerHTML = `
    <!-- Spacing -->
    <div style="padding:10px 12px;border-bottom:1px solid #f0f0f0">
      <div style="font-size:9px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px">Spacing</div>
      <div data-section-menu="spacing-row" style="display:flex;gap:3px"></div>
    </div>
    <!-- Theme -->
    <div style="padding:10px 12px;border-bottom:1px solid #f0f0f0">
      <div style="font-size:9px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px">Theme</div>
      <div data-section-menu="theme-row" style="display:grid;grid-template-columns:1fr 1fr;gap:4px"></div>
    </div>
    <!-- AI Edit -->
    <div style="padding:10px 12px;border-bottom:1px solid #f0f0f0">
      <div style="display:flex;align-items:center;gap:4px;margin-bottom:6px">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style="color:#7c3aed">
          <path d="M8 1L10 5.5L15 6.5L11.5 10L12.5 15L8 12.5L3.5 15L4.5 10L1 6.5L6 5.5L8 1Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
        </svg>
        <span style="font-size:9px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em">AI Edit</span>
      </div>
      <div style="position:relative">
        <input data-section-menu="ai-input" type="text" placeholder="e.g. Make the headline shorter"
          style="width:100%;padding:6px 32px 6px 8px;font-size:12px;border:1px solid #e5e7eb;border-radius:6px;outline:none;box-sizing:border-box;color:#111;background:#fff;font-family:inherit"
        />
        <button data-section-menu="ai-send"
          style="position:absolute;right:4px;top:50%;transform:translateY(-50%);padding:3px;border:none;background:#7c3aed;color:#fff;border-radius:4px;cursor:pointer;display:flex;align-items:center;justify-content:center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    </div>
    <!-- Actions -->
    <div data-section-menu="actions" style="padding:6px 12px;display:flex;align-items:center;justify-content:center;gap:2px;background:#fafafa;border-radius:0 0 12px 12px">
    </div>
  `;

  document.body.appendChild(dd);

  // Build spacing buttons
  const spacingRow = dd.querySelector('[data-section-menu="spacing-row"]')!;
  for (const opt of SPACING_LABELS) {
    const btn = document.createElement("button");
    btn.dataset.spacingKey = opt.key;
    btn.textContent = opt.label;
    btn.style.cssText = `
      flex:1; padding:5px 0; font-size:11px; font-weight:600; border-radius:5px;
      border:none; cursor:pointer; transition:all 0.1s;
      font-family: inherit;
    `;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      currentSpacing = opt.key;
      updateSpacingHighlight();
      sendAction("editSpacing", { spacing: opt.key });
    });
    spacingRow.appendChild(btn);
  }

  // Build theme buttons
  const themeRow = dd.querySelector('[data-section-menu="theme-row"]')!;
  for (const opt of THEME_OPTIONS) {
    const btn = document.createElement("button");
    btn.dataset.themeKey = opt.key;
    btn.textContent = opt.label;
    btn.style.cssText = `
      padding:6px 8px; font-size:11px; font-weight:500; border-radius:6px;
      border:1px solid transparent; cursor:pointer; text-align:left; transition:all 0.1s;
      font-family: inherit;
    `;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      currentTheme = opt.key;
      updateThemeHighlight();
      sendAction("editTheme", { theme: opt.key });
    });
    themeRow.appendChild(btn);
  }

  // AI Edit handlers
  const aiInput = dd.querySelector('[data-section-menu="ai-input"]') as HTMLInputElement;
  const aiSend = dd.querySelector('[data-section-menu="ai-send"]') as HTMLButtonElement;
  const submitAI = () => {
    const text = aiInput.value.trim();
    if (!text) return;
    sendAction("aiEdit", { instruction: text });
    aiInput.value = "";
    _closeDropdown();
  };
  aiSend.addEventListener("click", (e) => { e.stopPropagation(); submitAI(); });
  aiInput.addEventListener("keydown", (e) => {
    e.stopPropagation();
    if (e.key === "Enter") submitAI();
  });
  aiInput.addEventListener("click", (e) => e.stopPropagation());

  // Action buttons
  const actionsRow = dd.querySelector('[data-section-menu="actions"]')!;
  const actionDefs: { action: string; title: string; svg: string; danger?: boolean }[] = [
    { action: "moveUp", title: "Move up", svg: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>' },
    { action: "moveDown", title: "Move down", svg: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14"/><path d="M19 12l-7 7-7-7"/></svg>' },
    { action: "changeTemplate", title: "Swap layout", svg: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>' },
    { action: "duplicate", title: "Duplicate", svg: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>' },
    { action: "delete", title: "Delete", svg: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>', danger: true },
  ];

  for (let i = 0; i < actionDefs.length; i++) {
    const def = actionDefs[i];
    // Add separator before delete
    if (i === actionDefs.length - 1) {
      const sep = document.createElement("div");
      sep.style.cssText = "width:1px;height:16px;background:#e5e7eb;margin:0 2px";
      actionsRow.appendChild(sep);
    }
    const btn = document.createElement("button");
    btn.title = def.title;
    btn.innerHTML = def.svg;
    btn.style.cssText = `
      padding:6px; border-radius:6px; border:none; cursor:pointer;
      background:transparent; color:#6b7280; display:flex; align-items:center;
      justify-content:center; transition:all 0.1s;
    `;
    btn.addEventListener("mouseenter", () => {
      btn.style.background = def.danger ? "#fef2f2" : "#f3f4f6";
      btn.style.color = def.danger ? "#dc2626" : "#374151";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.background = "transparent";
      btn.style.color = "#6b7280";
    });
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      sendAction(def.action);
      _closeDropdown();
    });
    actionsRow.appendChild(btn);
  }

  return dd;
}

/* ─── State updates ─── */

function updateSpacingHighlight(): void {
  if (!dropdown) return;
  const btns = dropdown.querySelectorAll<HTMLButtonElement>("[data-spacing-key]");
  btns.forEach((btn) => {
    const isActive = btn.dataset.spacingKey === currentSpacing;
    btn.style.background = isActive ? "#7c3aed" : "#f3f4f6";
    btn.style.color = isActive ? "#fff" : "#6b7280";
  });
}

function updateThemeHighlight(): void {
  if (!dropdown) return;
  const btns = dropdown.querySelectorAll<HTMLButtonElement>("[data-theme-key]");
  btns.forEach((btn) => {
    const isActive = btn.dataset.themeKey === currentTheme;
    btn.style.background = isActive ? "rgba(124,58,237,0.08)" : "#f9fafb";
    btn.style.color = isActive ? "#7c3aed" : "#6b7280";
    btn.style.borderColor = isActive ? "rgba(124,58,237,0.3)" : "transparent";
  });
}

/* ─── Show / hide ─── */

function positionTrigger(section: HTMLElement): void {
  if (!triggerBtn) return;
  const rect = section.getBoundingClientRect();
  triggerBtn.style.top = (rect.top + 12) + "px";
  triggerBtn.style.left = (rect.right - 12) + "px";
  triggerBtn.style.transform = "translateX(-100%)";
  triggerBtn.style.display = "flex";
}

function positionDropdown(): void {
  if (!triggerBtn || !dropdown) return;
  const btnRect = triggerBtn.getBoundingClientRect();
  const spaceBelow = window.innerHeight - btnRect.bottom - 16;
  const ddHeight = Math.min(dropdown.scrollHeight, window.innerHeight * 0.7);

  if (spaceBelow > ddHeight || spaceBelow > 200) {
    dropdown.style.top = (btnRect.bottom + 6) + "px";
  } else {
    dropdown.style.top = Math.max(8, btnRect.top - ddHeight - 6) + "px";
  }
  dropdown.style.left = Math.max(8, btnRect.right - 272) + "px";
  dropdown.style.display = "block";
}

function showSectionHighlight(section: HTMLElement): void {
  if (!sectionHighlight) sectionHighlight = createSectionHighlight();
  const rect = section.getBoundingClientRect();
  sectionHighlight.style.top = rect.top + "px";
  sectionHighlight.style.left = rect.left + "px";
  sectionHighlight.style.width = rect.width + "px";
  sectionHighlight.style.height = rect.height + "px";
  sectionHighlight.style.display = "block";
}

function openDropdown(): void {
  if (!dropdown) return;
  menuOpen = true;
  updateSpacingHighlight();
  updateThemeHighlight();
  positionDropdown();
}

function _closeDropdown(): void {
  if (dropdown) dropdown.style.display = "none";
  menuOpen = false;
}

function hideAll(): void {
  _closeDropdown();
  if (triggerBtn) triggerBtn.style.display = "none";
  if (sectionHighlight) sectionHighlight.style.display = "none";
  hoveredSection = null;
}

/* ─── Event handlers ─── */

function handleMouseMove(e: MouseEvent): void {
  if (!menuEnabled) return;

  const target = e.target as HTMLElement;

  // Don't change hover target while dropdown is open
  if (menuOpen) return;

  // Check if mouse is over menu elements
  if (target.closest?.("[data-section-menu]")) return;

  const section = findNearestSection(target);

  if (section && section !== hoveredSection) {
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
    hoveredSection = section;
    currentSpacing = detectSpacing(section);
    currentTheme = detectTheme(section);

    const nameEl = triggerBtn?.querySelector('[data-section-menu="name"]');
    if (nameEl) nameEl.textContent = deriveSectionName(section);

    positionTrigger(section);
    showSectionHighlight(section);
  } else if (!section && hoveredSection) {
    // Start hide timer
    if (!hideTimer) {
      hideTimer = setTimeout(() => {
        if (!menuOpen) hideAll();
        hideTimer = null;
      }, 300);
    }
  }
}

function handleScroll(): void {
  if (!hoveredSection || !triggerBtn) return;
  if (triggerBtn.style.display === "none") return;
  positionTrigger(hoveredSection);
  if (menuOpen) positionDropdown();
  if (sectionHighlight) showSectionHighlight(hoveredSection);
}

function handleOutsideClick(e: MouseEvent): void {
  if (!menuOpen) return;
  const target = e.target as HTMLElement;
  if (target.closest?.("[data-section-menu]")) return;
  _closeDropdown();
}

/* ─── Public API ─── */

export function init(): void {
  triggerBtn = createTrigger();
  dropdown = createDropdown();
}

export function enable(): void {
  menuEnabled = true;
  document.addEventListener("mousemove", handleMouseMove, true);
  window.addEventListener("scroll", handleScroll, { passive: true });
  document.addEventListener("click", handleOutsideClick, true);
}

export function disable(): void {
  menuEnabled = false;
  hideAll();
  document.removeEventListener("mousemove", handleMouseMove, true);
  window.removeEventListener("scroll", handleScroll);
  document.removeEventListener("click", handleOutsideClick, true);
}

export function closeDropdown(): void {
  _closeDropdown();
}
