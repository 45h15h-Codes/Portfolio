"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import DesignEditor from "@/components/editor";
import type { EditorHandle } from "@/components/editor";
import { supabase } from "@/lib/supabase";
import {
  getOrCreateFingerprint,
  canSubmit,
  getLastSubmitTimestamp,
  recordSubmit,
} from "@/lib/fingerprint";
import { LiveCursors } from "@/components/editor/LiveCursors";


// ── component ─────────────────────────────────────────────────────────────────

export default function EditorClient() {
  const editorRef = useRef<EditorHandle>(null);

  // How many drawings exist on the wall
  const [wallCount, setWallCount] = useState<number | null>(null);
  // Submission state
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "submitting" | "success" | "error" | "cooldown" | "empty"
  >("idle");

  // Fetch count on mount
  useEffect(() => {
    supabase
      .from("drawings")
      .select("*", { count: "exact", head: true })
      .then(({ count, error }) => {
        if (error) {
          console.error("Failed to fetch wall count:", error);
          return; // leave wallCount as null (unknown)
        }
        setWallCount(count ?? 0);
      });
  }, []);

  const handleSubmitToWall = useCallback(async () => {
    const dataUrl = editorRef.current?.getDataURL();
    if (!dataUrl) return;

    if (!canSubmit(getLastSubmitTimestamp())) {
      setSubmitStatus("cooldown");
      setTimeout(() => setSubmitStatus("idle"), 3000);
      return;
    }

    setSubmitStatus("submitting");
    const fingerprint = getOrCreateFingerprint();

    const { error } = await supabase
      .from("drawings")
      .insert({ image_data: dataUrl, client_fingerprint: fingerprint });

    if (error) {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 3000);
      return;
    }

    recordSubmit();
    setSubmitStatus("success");
    // Update count so "View Wall" button appears if this was the first
    setWallCount((c) => (c ?? 0) + 1);
    setTimeout(() => setSubmitStatus("idle"), 3000);
  }, []);

  // Status label
  const statusLabel: Record<typeof submitStatus, string> = {
    idle: "",
    submitting: "Submitting…",
    success: "Submitted ✓",
    error: "Failed — try again",
    cooldown: "Wait 1 min between submissions",
    empty: "Draw something first",
  };

  const isSubmitting = submitStatus === "submitting";
  const showWall = wallCount !== null && wallCount > 0;

  return (
    <>
      <LiveCursors />
      <style>{`
        .editor-root {
          --editor-bg:        #f0ede6;
          --editor-surface:   #e8e6e0;
          --editor-canvas:    #f7f5f0;
          --editor-border:    rgba(10,10,10,0.1);
          --editor-grid:      rgba(10,10,10,0.25);
          --editor-fg:        #0a0a0a;
          --editor-fg-muted:  rgba(10,10,10,0.45);
          --editor-accent:    #0a0a0a;
          --editor-accent-fg: #f5f5f5;
          --editor-selection: rgba(10,10,10,0.07);
        }
        .dark .editor-root {
          --editor-bg:        #0a0a0a;
          --editor-surface:   #141414;
          --editor-canvas:    #111111;
          --editor-border:    rgba(255,255,255,0.08);
          --editor-grid:      rgba(255,255,255,0.15);
          --editor-fg:        #f5f5f5;
          --editor-fg-muted:  rgba(245,245,245,0.4);
          --editor-accent:    #f5f5f5;
          --editor-accent-fg: #0a0a0a;
          --editor-selection: rgba(255,255,255,0.06);
        }
        body:has(.editor-root) { overflow: hidden !important; }

        .editor-header-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 16px;
          min-height: 44px;
          border-radius: 6px;
          border: 1px solid var(--editor-border);
          font-size: 13px;
          font-weight: 500;
          font-family: inherit;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.15s, color 0.15s, opacity 0.15s;
          white-space: nowrap;
        }
        .editor-header-btn:disabled {
          opacity: 0.5;
          cursor: default;
        }
        .editor-header-btn.primary {
          background: var(--editor-accent);
          color: var(--editor-accent-fg);
          border-color: var(--editor-accent);
        }
        .editor-header-btn.primary:not(:disabled):hover {
          opacity: 0.85;
        }
        .editor-header-btn.ghost {
          background: transparent;
          color: var(--editor-fg);
        }
        .editor-header-btn.ghost:hover {
          background: var(--editor-selection);
        }

        @keyframes editor-status-in {
          from { opacity: 0; transform: translateY(2px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .editor-status {
          font-size: 11px;
          animation: editor-status-in 0.2s ease;
        }
      `}</style>

      <div
        className="editor-root"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 16px",
            minHeight: 60,
            borderBottom: "1px solid var(--editor-border)",
            background: "var(--editor-surface)",
            flexShrink: 0,
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          {/* Left: back link */}
          <Link
            href="/"
            className="editor-header-btn ghost"
            style={{ color: "var(--editor-fg-muted)" }}
          >
            ← Portfolio
          </Link>

          {/* Center: title */}
          <span
            className="hidden sm:block"
            style={{
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: "-0.01em",
              color: "var(--editor-fg)",
              flex: 1,
              textAlign: "center",
            }}
          >
            Design Editor
          </span>

          {/* Right: wall actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {/* Status message (success / error / etc.) */}
            {submitStatus !== "idle" && (
              <span
                className="editor-status"
                style={{
                  color:
                    submitStatus === "success"
                      ? "#1d9e75"
                      : submitStatus === "error" || submitStatus === "cooldown"
                      ? "#e05252"
                      : "var(--editor-fg-muted)",
                }}
              >
                {statusLabel[submitStatus]}
              </span>
            )}

            {/* Submit to Wall */}
            <button
              className="editor-header-btn primary"
              onClick={handleSubmitToWall}
              disabled={isSubmitting}
              title="Export current canvas and submit it to the drawing wall"
            >
              {isSubmitting ? (
                <>
                  <span
                    style={{
                      display: "inline-block",
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      border: "1.5px solid currentColor",
                      borderTopColor: "transparent",
                      animation: "spin 0.6s linear infinite",
                    }}
                  />
                  Submitting…
                </>
              ) : (
                <>↑ Submit to Wall</>
              )}
            </button>

            {/* View Wall — only shown when ≥1 drawing exists */}
            {showWall && (
              <Link
                href="/wall"
                className="editor-header-btn ghost"
                title={`${wallCount} drawing${wallCount !== 1 ? "s" : ""} on the wall`}
              >
                View Wall
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 18,
                    height: 18,
                    borderRadius: 9,
                    background: "var(--editor-accent)",
                    color: "var(--editor-accent-fg)",
                    fontSize: 10,
                    fontWeight: 600,
                    padding: "0 4px",
                  }}
                >
                  {wallCount}
                </span>
              </Link>
            )}
          </div>
        </div>

        {/* ── Editor canvas ── */}
        <div style={{ flex: 1, overflow: "hidden" }}>
          <DesignEditor ref={editorRef} />
        </div>
      </div>

      {/* Spin keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
