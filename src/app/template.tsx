"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import React from "react";

// ── Easter egg messages ───────────────────────────────────────────────────────
const MESSAGES = [
  { line1: "hold tight,", line2: "magic in transit." },
  { line1: "compiling", line2: "good vibes ↗" },
  { line1: "you blinked.", line2: "page didn't." },
  { line1: "0.4s of", line2: "pure darkness." },
  { line1: "loading…", line2: "just kidding, done." },
  { line1: "between", line2: "two worlds." },
  { line1: "ctrl + z", line2: "won't work here." },
  { line1: "pixels", line2: "on the move ↗" },
  { line1: "the void", line2: "says hi." },
  { line1: "you caught", line2: "the curtain." },
];

let _msgIndex = -1;
function nextMessage() {
  _msgIndex = (_msgIndex + 1) % MESSAGES.length;
  return MESSAGES[_msgIndex];
}

// ── Template ──────────────────────────────────────────────────────────────────

export default function Template({ children }: { children: React.ReactNode }) {
  // Selected CLIENT-SIDE ONLY to avoid SSR/hydration mismatch.
  // _msgIndex is a module-level variable — it persists in the Node.js process
  // across SSR requests. Server picks message N, client picks message 0 → mismatch.
  // Start null (server + client initial render identical), set after mount.
  const [msg, setMsg] = useState<{ line1: string; line2: string } | null>(null);

  useEffect(() => {
    setMsg(nextMessage());
  }, []);

  return (
    <>
      {/* ── Transition overlay ── */}
      <motion.div
        id="page-transition-overlay"
        className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden"
        style={{ backgroundColor: "#0A0A0A" }}
        initial={{ y: "0%" }}
        animate={{ y: "-100%" }}
        transition={{ duration: 0.6, delay: 0.25, ease: [0.87, 0, 0.13, 1] }}
      >
        {/* Easter egg — client-only, avoids hydration mismatch */}
        {msg && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut", delay: 0.05 }}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            {/* Top rule */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: 0.08 }}
              style={{
                width: "min(320px, 80vw)",
                height: 1,
                background: "rgba(255,255,255,0.12)",
                marginBottom: "1.5rem",
                transformOrigin: "left",
              }}
            />

            {/* Ghost line */}
            <p
              style={{
                fontFamily: "var(--font-inter, Inter, sans-serif)",
                fontSize: "clamp(2rem, 6vw, 4.5rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 0.95,
                color: "rgba(255,255,255,0.08)",
                textAlign: "center",
                margin: 0,
                textTransform: "lowercase",
              }}
            >
              {msg.line1}
            </p>

            {/* Bright line */}
            <p
              style={{
                fontFamily: "var(--font-inter, Inter, sans-serif)",
                fontSize: "clamp(2rem, 6vw, 4.5rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 0.95,
                color: "rgba(255,255,255,0.55)",
                textAlign: "center",
                margin: 0,
                textTransform: "lowercase",
              }}
            >
              {msg.line2}
            </p>

            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              style={{
                marginTop: "1.75rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                color: "rgba(255,255,255,0.18)",
                fontFamily: "var(--font-inter, Inter, sans-serif)",
                fontSize: "0.65rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              <span style={{ display: "inline-block", width: 24, height: 1, background: "currentColor" }} />
              ashish · creative dev
              <span style={{ display: "inline-block", width: 24, height: 1, background: "currentColor" }} />
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {/* ── Page content ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.87, 0, 0.13, 1], delay: 0.2 }}
      >
        {children}
      </motion.div>
    </>
  );
}
