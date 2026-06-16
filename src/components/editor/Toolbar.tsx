"use client";

import type { Shape, ActiveTool } from "./types";

// ── Preset swatches ──────────────────────────────────────────────────────────

const PRESETS = [
  "#0a0a0a", "#f5f5f5", "#e8e6e0",
  "#d85a30", "#1d9e75", "#378add",
  "#d4537e", "#8b5cf6", "#f59e0b",
];

interface SwatchRowProps {
  onPick: (color: string) => void;
  active: string;
}

function SwatchRow({ onPick, active }: SwatchRowProps) {
  return (
    <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
      {PRESETS.map((c) => (
        <button
          key={c}
          onClick={() => onPick(c)}
          aria-label={`Color ${c}`}
          title={c}
          style={{
            width: 18,
            height: 18,
            borderRadius: 3,
            padding: 0,
            border: active === c
              ? "2px solid var(--editor-fg)"
              : "1.5px solid rgba(0,0,0,0.18)",
            background: c,
            cursor: "pointer",
            flexShrink: 0,
            boxSizing: "border-box",
            transition: "border 0.1s",
          }}
        />
      ))}
    </div>
  );
}

// ── Color controls block ─────────────────────────────────────────────────────

interface ColorControlsProps {
  // global drawing colors
  activeFill: string;
  setActiveFill: (c: string) => void;
  activeStroke: string;
  setActiveStroke: (c: string) => void;
  activeStrokeWidth: number;
  setActiveStrokeWidth: (w: number) => void;
  // selected shape (null = no selection)
  selectedShape: Shape | null;
  onUpdateSelected: (attrs: Partial<Shape>) => void;
}

function ColorControls({
  activeFill,
  setActiveFill,
  activeStroke,
  setActiveStroke,
  activeStrokeWidth,
  setActiveStrokeWidth,
  selectedShape,
  onUpdateSelected,
}: ColorControlsProps) {
  // When a shape is selected, pickers show / sync from that shape's values.
  // On change: always update global drawing color AND update selected shape if present.
  const fillVal = selectedShape
    ? selectedShape.fill === "transparent" ? "#000000" : selectedShape.fill
    : activeFill;

  const strokeVal = selectedShape ? (selectedShape.stroke || "#000000") : activeStroke;
  const strokeWidthVal = selectedShape ? selectedShape.strokeWidth : activeStrokeWidth;

  // text uses fill for color, has no meaningful stroke — keep stroke picker anyway
  // so "active stroke" stays set for subsequent shapes

  function handleFillChange(color: string) {
    setActiveFill(color);
    if (selectedShape) onUpdateSelected({ fill: color });
  }

  function handleStrokeChange(color: string) {
    setActiveStroke(color);
    if (selectedShape) onUpdateSelected({ stroke: color });
  }

  function handleWidthChange(w: number) {
    setActiveStrokeWidth(w);
    if (selectedShape) onUpdateSelected({ strokeWidth: w });
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "0 6px",
        flexWrap: "wrap",
      }}
    >
      {/* Fill */}
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 11, color: "var(--editor-fg-muted)", minWidth: 26 }}>Fill</span>
          <input
            type="color"
            value={fillVal}
            onChange={(e) => handleFillChange(e.target.value)}
            title="Fill color"
            style={{ width: 28, height: 24, borderRadius: 4, border: "1px solid var(--editor-border)", cursor: "pointer", padding: 1 }}
          />
          <SwatchRow onPick={handleFillChange} active={fillVal} />
        </div>
      </div>

      <div style={{ width: 1, height: 28, background: "var(--editor-border)" }} />

      {/* Stroke */}
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 11, color: "var(--editor-fg-muted)", minWidth: 34 }}>Stroke</span>
          <input
            type="color"
            value={strokeVal}
            onChange={(e) => handleStrokeChange(e.target.value)}
            title="Stroke color"
            style={{ width: 28, height: 24, borderRadius: 4, border: "1px solid var(--editor-border)", cursor: "pointer", padding: 1 }}
          />
          <SwatchRow onPick={handleStrokeChange} active={strokeVal} />
          <input
            type="range"
            min={0}
            max={20}
            step={0.5}
            value={strokeWidthVal}
            onChange={(e) => handleWidthChange(parseFloat(e.target.value))}
            title={`Stroke width: ${strokeWidthVal}px`}
            style={{ width: 64, accentColor: "var(--editor-fg)" }}
          />
          <span style={{ fontSize: 11, color: "var(--editor-fg-muted)", minWidth: 24 }}>
            {strokeWidthVal}px
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Main toolbar ─────────────────────────────────────────────────────────────

const TOOLS: { id: ActiveTool; label: string; icon: string }[] = [
  { id: "select", label: "Select", icon: "↖" },
  { id: "rect",   label: "Rect",   icon: "▭" },
  { id: "ellipse",label: "Ellipse",icon: "◯" },
  { id: "line",   label: "Pen",    icon: "✏" },
  { id: "text",   label: "Text",   icon: "T" },
];

export interface ToolbarProps {
  activeTool: ActiveTool;
  setActiveTool: (t: ActiveTool) => void;
  // global drawing colors — always present
  activeFill: string;
  setActiveFill: (c: string) => void;
  activeStroke: string;
  setActiveStroke: (c: string) => void;
  activeStrokeWidth: number;
  setActiveStrokeWidth: (w: number) => void;
  // selected shape — null if nothing selected
  selectedShape: Shape | null;
  onUpdateSelected: (attrs: Partial<Shape>) => void;
  onDeleteSelected: () => void;
  // text editing
  onUpdateText: (text: string) => void;
  onUpdateFontSize: (size: number) => void;
  // history / export
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  onExport: () => void;
}

export function Toolbar({
  activeTool,
  setActiveTool,
  activeFill,
  setActiveFill,
  activeStroke,
  setActiveStroke,
  activeStrokeWidth,
  setActiveStrokeWidth,
  selectedShape,
  onUpdateSelected,
  onDeleteSelected,
  onUpdateText,
  onUpdateFontSize,
  onUndo,
  onRedo,
  canUndo,
  onExport,
}: ToolbarProps) {
  return (
    <div
      style={{
        borderBottom: "1px solid var(--editor-border)",
        background: "var(--editor-surface)",
        userSelect: "none",
        flexShrink: 0,
      }}
    >
      {/* ── Row 1: tools + undo/redo + text controls + delete/export ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "8px 14px",
          flexWrap: "wrap",
        }}
      >
        {/* Tools */}
        {TOOLS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTool(t.id)}
            title={t.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 10px",
              borderRadius: 6,
              border: "1px solid var(--editor-border)",
              cursor: "pointer",
              background: activeTool === t.id ? "var(--editor-accent)" : "transparent",
              color: activeTool === t.id ? "var(--editor-accent-fg)" : "var(--editor-fg)",
              fontFamily: "inherit",
              fontSize: 12,
              fontWeight: 500,
              transition: "all 0.12s ease",
            }}
          >
            <span style={{ fontSize: 13 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}

        <Sep />

        {/* Undo / Redo */}
        <button onClick={onUndo} disabled={!canUndo} title="Undo (Ctrl+Z)" style={iconBtn(!canUndo)}>↩</button>
        <button onClick={onRedo} title="Redo (Ctrl+Y / Ctrl+Shift+Z)" style={iconBtn(false)}>↪</button>

        <div style={{ flex: 1 }} />

        {/* Text controls — only when text shape selected */}
        {selectedShape?.type === "text" && (
          <>
            <input
              type="text"
              value={selectedShape.text ?? ""}
              onChange={(e) => onUpdateText(e.target.value)}
              placeholder="Text content…"
              style={inputStyle(140)}
            />
            <input
              type="number"
              min={8}
              max={200}
              value={selectedShape.fontSize ?? 18}
              onChange={(e) => onUpdateFontSize(Number(e.target.value))}
              title="Font size"
              style={inputStyle(52)}
            />
            <Sep />
          </>
        )}

        {/* Delete */}
        {selectedShape && (
          <>
            <button
              onClick={onDeleteSelected}
              title="Delete selected (Del)"
              style={{ ...iconBtn(false), color: "#e05252" }}
            >
              🗑
            </button>
            <Sep />
          </>
        )}

        {/* Export */}
        <button onClick={onExport} title="Export as PNG" style={iconBtn(false)}>
          ↓ PNG
        </button>
      </div>

      {/* ── Row 2: always-visible color controls ── */}
      <div
        style={{
          borderTop: "1px solid var(--editor-border)",
          padding: "6px 14px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <ColorControls
          activeFill={activeFill}
          setActiveFill={setActiveFill}
          activeStroke={activeStroke}
          setActiveStroke={setActiveStroke}
          activeStrokeWidth={activeStrokeWidth}
          setActiveStrokeWidth={setActiveStrokeWidth}
          selectedShape={selectedShape}
          onUpdateSelected={onUpdateSelected}
        />
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function Sep() {
  return <div style={{ width: 1, height: 22, background: "var(--editor-border)", margin: "0 3px" }} />;
}

function iconBtn(disabled: boolean): React.CSSProperties {
  return {
    padding: "5px 10px",
    borderRadius: 6,
    border: "1px solid var(--editor-border)",
    cursor: disabled ? "default" : "pointer",
    background: "transparent",
    color: disabled ? "var(--editor-fg-muted)" : "var(--editor-fg)",
    fontFamily: "inherit",
    fontSize: 13,
    opacity: disabled ? 0.4 : 1,
    transition: "all 0.12s ease",
  };
}

function inputStyle(width: number): React.CSSProperties {
  return {
    padding: "4px 7px",
    borderRadius: 4,
    border: "1px solid var(--editor-border)",
    background: "transparent",
    color: "var(--editor-fg)",
    fontSize: 12,
    width,
    fontFamily: "inherit",
  };
}
