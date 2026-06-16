"use client";

import dynamic from "next/dynamic";
import type { EditorHandle } from "./DesignEditor";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

// SSR must be disabled — Konva touches window/canvas APIs at import time.
// next/dynamic preserves forwardRef, so EditorHandle refs flow through.
const DesignEditor = dynamic(
  () => import("@/components/editor/DesignEditor"),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          color: "var(--editor-fg-muted)",
          fontSize: 13,
          fontFamily: "var(--font-inter, Inter, sans-serif)",
        }}
      >
        Loading editor…
      </div>
    ),
  }
) as ForwardRefExoticComponent<RefAttributes<EditorHandle>>;

export type { EditorHandle };
export default DesignEditor;
