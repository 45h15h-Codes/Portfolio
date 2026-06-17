"use client";

import { useState, useRef, useEffect, useCallback, useMemo, forwardRef, useImperativeHandle } from "react";
import { Stage, Layer, Line } from "react-konva";
import type Konva from "konva";

import { ShapeNode } from "./ShapeNode";
import { SelectionTransformer } from "./SelectionTransformer";
import { Toolbar } from "./Toolbar";
import { LayersPanel } from "./LayersPanel";
import type { Shape, ActiveTool } from "./types";

// Handle exposed via forwardRef so EditorClient can trigger PNG export
export interface EditorHandle {
  getCanvas: () => Konva.Stage | null;
}

// ── helpers ──────────────────────────────────────────────────────────────────

let _idCounter = 0;
function uid() {
  return `shape_${Date.now()}_${++_idCounter}`;
}

interface ShapeColors {
  fill: string;
  stroke: string;
  strokeWidth: number;
}

function makeShape(
  type: Exclude<ActiveTool, "select">,
  x: number,
  y: number,
  zIndex: number,
  colors: ShapeColors
): Shape {
  return {
    id: uid(),
    type,
    x,
    y,
    width: type === "ellipse" ? 80 : 120,
    height: type === "ellipse" ? 80 : 80,
    rotation: 0,
    fill: type === "line" ? "transparent" : colors.fill,
    stroke: colors.stroke,
    strokeWidth: colors.strokeWidth,
    zIndex,
    visible: true,
    text: type === "text" ? "Text" : undefined,
    fontSize: type === "text" ? 18 : undefined,
    points: type === "line" ? [0, 0] : undefined,
    tension: type === "line" ? 0.4 : undefined,
  };
}

// ── main component ────────────────────────────────────────────────────────────

const DesignEditor = forwardRef<EditorHandle>(function DesignEditor(_, ref) {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<ActiveTool>("select");

  // ── Active drawing colors ────────────────────────────────────────────────
  // These set what new shapes / lines will look like.
  // They also sync FROM selected shape when user clicks a shape.
  const [activeFill, setActiveFill] = useState("#e8e6e0");
  const [activeStroke, setActiveStroke] = useState("#0a0a0a");
  const [activeStrokeWidth, setActiveStrokeWidth] = useState(2);

  // Keep a ref so event handlers (closures) always see current values
  const activeColorsRef = useRef({ fill: activeFill, stroke: activeStroke, strokeWidth: activeStrokeWidth });
  useEffect(() => {
    activeColorsRef.current = { fill: activeFill, stroke: activeStroke, strokeWidth: activeStrokeWidth };
  }, [activeFill, activeStroke, activeStrokeWidth]);

  // history
  const historyRef = useRef<Shape[][]>([[]]);
  const historyStep = useRef(0);

  // freehand drawing
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentLine, setCurrentLine] = useState<Shape | null>(null);

  // stage container
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });

  // Expose stage to parent via ref
  useImperativeHandle(ref, () => ({
    getCanvas: () => stageRef.current,
  }), []);

  // ── history helpers ─────────────────────────────────────────────────────────

  const commitShapes = useCallback((next: Shape[]) => {
    const trimmed = historyRef.current.slice(0, historyStep.current + 1);
    trimmed.push(next);
    historyRef.current = trimmed;
    historyStep.current = trimmed.length - 1;
    setShapes(next);
  }, []);

  const undo = useCallback(() => {
    if (historyStep.current === 0) return;
    historyStep.current -= 1;
    setShapes(historyRef.current[historyStep.current]);
    setSelectedId(null);
  }, []);

  const redo = useCallback(() => {
    if (historyStep.current >= historyRef.current.length - 1) return;
    historyStep.current += 1;
    setShapes(historyRef.current[historyStep.current]);
  }, []);

  // ── resize observer ─────────────────────────────────────────────────────────

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => {
      setStageSize({
        width: container.offsetWidth,
        height: container.offsetHeight,
      });
    });
    ro.observe(container);
    setStageSize({ width: container.offsetWidth, height: container.offsetHeight });
    return () => ro.disconnect();
  }, []);

  // ── keyboard shortcuts ──────────────────────────────────────────────────────

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName.toLowerCase();
      if (tag === "input" || tag === "textarea") return;

      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && e.key === "z") { e.preventDefault(); undo(); }
      if (ctrl && (e.key === "y" || (e.shiftKey && e.key === "z"))) { e.preventDefault(); redo(); }
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        e.preventDefault();
        deleteSelected();
      }
      if (e.key === "Escape") setActiveTool("select");
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, undo, redo]);

  // ── shape mutations ─────────────────────────────────────────────────────────
  //
  // IMPORTANT: never call commitShapes() inside a setShapes() functional updater.
  // commitShapes() itself calls setShapes() — nesting them causes React to
  // batch/drop the inner call, so state is correct but undo history is broken.
  // All mutators below compute `next` from the `shapes` closure, then call
  // commitShapes(next) directly.

  // updateShape was unused and removed to fix lint errors

  // Committing update — for drag end / transform end (writes undo entry)
  const commitUpdate = useCallback(
    (id: string, attrs: Partial<Shape>) => {
      const next = shapes.map((s) => (s.id === id ? { ...s, ...attrs } : s));
      commitShapes(next);
    },
    [shapes, commitShapes]
  );

  // Toolbar/panel attribute update — always writes undo entry
  const updateSelected = useCallback(
    (attrs: Partial<Shape>) => {
      if (!selectedId) return;
      const next = shapes.map((s) => (s.id === selectedId ? { ...s, ...attrs } : s));
      commitShapes(next);
    },
    [selectedId, shapes, commitShapes]
  );

  const deleteSelected = useCallback(() => {
    if (!selectedId) return;
    const next = shapes.filter((s) => s.id !== selectedId);
    commitShapes(next);
    setSelectedId(null);
  }, [selectedId, shapes, commitShapes]);

  const reorderShape = useCallback(
    (id: string, direction: "up" | "down") => {
      const delta = direction === "up" ? 1 : -1;
      const next = shapes.map((s) =>
        s.id === id ? { ...s, zIndex: s.zIndex + delta } : s
      );
      commitShapes(next);
    },
    [shapes, commitShapes]
  );

  const toggleVisible = useCallback(
    (id: string) => {
      const next = shapes.map((s) =>
        s.id === id ? { ...s, visible: s.visible !== false } : s
      );
      commitShapes(next);
    },
    [shapes, commitShapes]
  );

  // ── stage event handlers ────────────────────────────────────────────────────

  function handleStageMouseDown(e: Konva.KonvaEventObject<MouseEvent>) {
    const isStage = e.target === e.target.getStage();
    const pos = e.target.getStage()!.getPointerPosition()!;

    // Deselect on empty canvas click (select tool)
    if (isStage && activeTool === "select") {
      setSelectedId(null);
      return;
    }

    // Freehand line — use current active colors
    if (activeTool === "line") {
      const { stroke, strokeWidth } = activeColorsRef.current;
      const id = uid();
      const line: Shape = {
        id,
        type: "line",
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        rotation: 0,
        fill: "transparent",
        stroke,
        strokeWidth,
        zIndex: shapes.length,
        visible: true,
        points: [pos.x, pos.y],
        tension: 0.4,
      };
      setCurrentLine(line);
      setIsDrawing(true);
      return;
    }

    // Drop shape on canvas click — use current active colors
    if (activeTool !== "select" && isStage) {
      const newShape = makeShape(
        activeTool as Exclude<ActiveTool, "select">,
        pos.x - 60,
        pos.y - 40,
        shapes.length,
        activeColorsRef.current
      );
      const next = [...shapes, newShape];
      commitShapes(next);
      setSelectedId(newShape.id);
      setActiveTool("select");
    }
  }

  function handleStageMouseMove(e: Konva.KonvaEventObject<MouseEvent>) {
    if (!isDrawing || !currentLine) return;
    const pos = e.target.getStage()!.getPointerPosition()!;
    setCurrentLine((prev) =>
      prev ? { ...prev, points: [...(prev.points ?? []), pos.x, pos.y] } : prev
    );
  }

  function handleStageMouseUp() {
    if (!isDrawing || !currentLine) return;
    const next = [...shapes, currentLine];
    commitShapes(next);
    setSelectedId(currentLine.id);
    setCurrentLine(null);
    setIsDrawing(false);
    setActiveTool("select");
  }

  // ── export ──────────────────────────────────────────────────────────────────

  function exportAsPNG() {
    if (!stageRef.current) return;
    const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = "design.png";
    link.href = uri;
    link.click();
  }

  // ── derived ─────────────────────────────────────────────────────────────────

  const sortedShapes = useMemo(
    () => [...shapes].sort((a, b) => a.zIndex - b.zIndex),
    [shapes]
  );
  const selectedShape = useMemo(
    () => shapes.find((s) => s.id === selectedId) ?? null,
    [shapes, selectedId]
  );
  const canUndo = historyStep.current > 0;

  // Sync active colors FROM selected shape so pickers reflect its real values
  // We use a layout effect so it runs synchronously after render
  useEffect(() => {
    if (!selectedShape) return;
    if (selectedShape.fill !== "transparent") setActiveFill(selectedShape.fill);
    setActiveStroke(selectedShape.stroke || "#0a0a0a");
    setActiveStrokeWidth(selectedShape.strokeWidth);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]); // only trigger when selection changes, not every attr update

  // ── cursor style ─────────────────────────────────────────────────────────────
  const cursorMap: Record<ActiveTool, string> = {
    select: "default",
    rect: "crosshair",
    ellipse: "crosshair",
    line: "crosshair",
    text: "text",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "var(--editor-bg)",
        color: "var(--editor-fg)",
        fontFamily: "var(--font-inter, Inter, sans-serif)",
        fontSize: 13,
        overflow: "hidden",
      }}
    >
      {/* ── Toolbar ── */}
      <Toolbar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        activeFill={activeFill}
        setActiveFill={setActiveFill}
        activeStroke={activeStroke}
        setActiveStroke={setActiveStroke}
        activeStrokeWidth={activeStrokeWidth}
        setActiveStrokeWidth={setActiveStrokeWidth}
        selectedShape={selectedShape}
        onUpdateSelected={updateSelected}
        onDeleteSelected={deleteSelected}
        onUpdateText={(text) => updateSelected({ text })}
        onUpdateFontSize={(fontSize) => updateSelected({ fontSize })}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        onExport={exportAsPNG}
      />

      {/* ── Canvas + Layers ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Canvas area */}
        <div
          ref={containerRef}
          style={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            cursor: cursorMap[activeTool],
            background: "var(--editor-canvas)",
          }}
        >
          {/* Subtle grid */}
          <svg
            style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.35 }}
            width="100%"
            height="100%"
          >
            <defs>
              <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke="var(--editor-grid)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          <Stage
            width={stageSize.width}
            height={stageSize.height}
            ref={stageRef}
            onMouseDown={handleStageMouseDown}
            onMouseMove={handleStageMouseMove}
            onMouseUp={handleStageMouseUp}
            onTouchStart={(e) => handleStageMouseDown(e as unknown as Konva.KonvaEventObject<MouseEvent>)}
            onTouchMove={(e) => handleStageMouseMove(e as unknown as Konva.KonvaEventObject<MouseEvent>)}
            onTouchEnd={handleStageMouseUp}
          >
            <Layer>
              {/* Committed shapes */}
              {sortedShapes.map((shape) => (
                <ShapeNode
                  key={shape.id}
                  shape={shape}
                  onSelect={(id) => {
                    if (activeTool === "select") setSelectedId(id);
                  }}
                  onChange={commitUpdate}
                />
              ))}

              {/* Live freehand preview */}
              {currentLine && (
                <Line
                  points={currentLine.points ?? []}
                  stroke={currentLine.stroke}
                  strokeWidth={currentLine.strokeWidth}
                  tension={currentLine.tension ?? 0.4}
                  lineCap="round"
                  lineJoin="round"
                  listening={false}
                />
              )}

              {/* Transform handles */}
              <SelectionTransformer selectedId={selectedId} stageRef={stageRef} />
            </Layer>
          </Stage>
        </div>

        {/* ── Layers panel ── */}
        <LayersPanel
          shapes={shapes}
          selectedId={selectedId}
          onSelect={(id) => { setSelectedId(id); setActiveTool("select"); }}
          onReorder={reorderShape}
          onToggleVisible={toggleVisible}
        />
      </div>

      {/* ── Status bar ── */}
      <div
        style={{
          height: 26,
          borderTop: "1px solid var(--editor-border)",
          background: "var(--editor-surface)",
          display: "flex",
          alignItems: "center",
          padding: "0 14px",
          gap: 16,
          fontSize: 11,
          color: "var(--editor-fg-muted)",
        }}
      >
        <span>{shapes.length} object{shapes.length !== 1 ? "s" : ""}</span>
        {selectedShape && (
          <>
            <span>·</span>
            <span>
              {selectedShape.type} · x {Math.round(selectedShape.x)} y {Math.round(selectedShape.y)}
              {selectedShape.type !== "line" && ` · ${Math.round(selectedShape.width)}×${Math.round(selectedShape.height)}`}
            </span>
          </>
        )}
        <span style={{ flex: 1 }} />
        <span>
          Tool: <strong style={{ color: "var(--editor-fg)" }}>{activeTool}</strong>
        </span>
      </div>
    </div>
  );
});

export default DesignEditor;
