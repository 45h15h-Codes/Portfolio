"use client";

import { useEffect } from "react";
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
        
        // Add fade out effect
        document.body.style.transition = "opacity 0.3s ease";
        document.body.style.opacity = "0";
        
        setTimeout(() => {
          router.push("/wall");
          // Restore opacity after navigation
          setTimeout(() => {
            document.body.style.opacity = "1";
          }, 100);
        }, 300);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return null;
}
