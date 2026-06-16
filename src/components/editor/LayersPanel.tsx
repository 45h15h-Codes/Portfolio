"use client";

import type { Shape } from "./types";

interface Props {
  shapes: Shape[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onReorder: (id: string, direction: "up" | "down") => void;
  onToggleVisible: (id: string) => void;
}

const TYPE_ICONS: Record<string, string> = {
  rect: "▭",
  ellipse: "◯",
  line: "✏",
  text: "T",
};

export function LayersPanel({ shapes, selectedId, onSelect, onReorder, onToggleVisible }: Props) {
  const sorted = [...shapes].sort((a, b) => b.zIndex - a.zIndex);

  return (
    <div
      style={{
        width: 220,
        borderLeft: "1px solid var(--editor-border)",
        background: "var(--editor-surface)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "10px 14px",
          borderBottom: "1px solid var(--editor-border)",
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "var(--editor-fg-muted)",
        }}
      >
        Layers
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {sorted.length === 0 && (
          <p style={{ padding: 14, fontSize: 12, color: "var(--editor-fg-muted)", margin: 0 }}>
            No layers yet
          </p>
        )}
        {sorted.map((shape) => {
          const isSelected = shape.id === selectedId;
          return (
            <div
              key={shape.id}
              onClick={() => onSelect(shape.id)}
              style={{
                padding: "7px 10px",
                background: isSelected ? "var(--editor-selection)" : "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 7,
                borderLeft: isSelected ? "2px solid var(--editor-accent)" : "2px solid transparent",
                transition: "background 0.1s",
              }}
            >
              <span style={{ fontSize: 13, opacity: 0.6 }}>
                {TYPE_ICONS[shape.type] ?? "?"}
              </span>
              <span
                style={{
                  flex: 1,
                  fontSize: 12,
                  color: shape.visible === false ? "var(--editor-fg-muted)" : "var(--editor-fg)",
                  textDecoration: shape.visible === false ? "line-through" : "none",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {shape.type === "text" ? (shape.text || "Text") : `${shape.type} #${shape.id.slice(-4)}`}
              </span>
              {/* Reorder */}
              <button
                onClick={(e) => { e.stopPropagation(); onReorder(shape.id, "up"); }}
                title="Move up"
                style={layerBtnStyle}
              >▲</button>
              <button
                onClick={(e) => { e.stopPropagation(); onReorder(shape.id, "down"); }}
                title="Move down"
                style={layerBtnStyle}
              >▼</button>
              {/* Visibility */}
              <button
                onClick={(e) => { e.stopPropagation(); onToggleVisible(shape.id); }}
                title={shape.visible === false ? "Show" : "Hide"}
                style={{ ...layerBtnStyle, opacity: shape.visible === false ? 0.4 : 1 }}
              >
                {shape.visible === false ? "○" : "●"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const layerBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "1px 4px",
  fontSize: 10,
  color: "var(--editor-fg-muted)",
  borderRadius: 3,
  lineHeight: 1,
};
