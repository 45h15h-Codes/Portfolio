"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function KonamiListener() {
  const router = useRouter();
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    let konamiProgress: string[] = [];

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input or textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      konamiProgress.push(key);
      konamiProgress = konamiProgress.slice(-KONAMI_SEQUENCE.length);

      if (konamiProgress.join(",") === KONAMI_SEQUENCE.join(",")) {
        konamiProgress = [];

        // Announce to screen readers before the visual transition
        setAnnouncement("Navigating to secret page");

        // Add fade out effect
        document.body.style.transition = "opacity 0.3s ease";
        document.body.style.opacity = "0";

        setTimeout(() => {
          router.push("/wall");
          // Restore opacity after navigation
          setTimeout(() => {
            document.body.style.opacity = "1";
            setAnnouncement("");
          }, 100);
        }, 300);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <span
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: "absolute",
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: "hidden",
        clip: "rect(0,0,0,0)",
        whiteSpace: "nowrap",
        border: 0,
      }}
    >
      {announcement}
    </span>
  );
}
