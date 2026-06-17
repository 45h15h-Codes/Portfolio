"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { getOrCreateFingerprint } from "@/lib/fingerprint";

type Cursor = {
  x: number;
  y: number;
  color: string;
};

const COLORS = ["#FF3366", "#33FF66", "#3366FF", "#FF33FF", "#33FFFF", "#FFCC33"];

export function LiveCursors() {
  const [cursors, setCursors] = useState<Record<string, Cursor>>({});
  const [myColor] = useState(() => COLORS[Math.floor(Math.random() * COLORS.length)]);
  const myIdRef = useRef<string>("");

  useEffect(() => {
    myIdRef.current = getOrCreateFingerprint();
    
    const channel = supabase.channel("editor-cursors");

    channel
      .on("broadcast", { event: "cursor-move" }, ({ payload }) => {
        if (payload.id !== myIdRef.current) {
          setCursors((prev) => ({
            ...prev,
            [payload.id]: {
              x: payload.x,
              y: payload.y,
              color: payload.color,
              lastSeen: Date.now(),
            },
          }));
        }
      })
      .subscribe();

    const handleMouseMove = (e: MouseEvent) => {
      channel.send({
        type: "broadcast",
        event: "cursor-move",
        payload: {
          id: myIdRef.current,
          x: e.clientX,
          y: e.clientY,
          color: myColor,
        },
      });
    };

    let timeout: ReturnType<typeof setTimeout> | null = null;
    const throttledMove = (e: MouseEvent) => {
      if (!timeout) {
        timeout = setTimeout(() => {
          handleMouseMove(e);
          timeout = null;
        }, 50); // 20 fps for broadcast
      }
    };

    window.addEventListener("mousemove", throttledMove);

    // Cleanup inactive cursors every second
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setCursors((prev) => {
        const next = { ...prev };
        let changed = false;
        for (const id in next) {
          if (now - (next[id] as any).lastSeen > 3000) {
            delete next[id];
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }, 1000);

    return () => {
      window.removeEventListener("mousemove", throttledMove);
      clearInterval(cleanupInterval);
      supabase.removeChannel(channel);
    };
  }, [myColor]);

  // If no other cursors, render nothing
  const activeIds = Object.keys(cursors);
  if (activeIds.length === 0) return null;

  return (
    <>
      {activeIds.map((id) => {
        const cursor = cursors[id];
        return (
          <div
            key={id}
            style={{
              position: "fixed",
              left: cursor.x,
              top: cursor.y,
              pointerEvents: "none",
              zIndex: 9999,
              transition: "left 100ms linear, top 100ms linear",
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              style={{
                fill: cursor.color,
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                transform: "translate(-2px, -2px)",
              }}
            >
              <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
            </svg>
            <div
              style={{
                backgroundColor: cursor.color,
                color: "#000",
                fontSize: "10px",
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: "4px",
                marginLeft: "2px",
                marginTop: "12px",
                fontFamily: "var(--font-inter, sans-serif)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
              }}
            >
              Visitor
            </div>
          </div>
        );
      })}
    </>
  );
}
