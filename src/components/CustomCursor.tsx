"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Use GSAP quickTo for smooth lerping
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "power3" });

    const onMouseMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("mousemove", onMouseMove);

    // Hover effect handlers
    const handleMouseEnter = () => {
      gsap.to(cursor, { scale: 3, opacity: 1, duration: 0.3 });
    };
    const handleMouseLeave = () => {
      gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3 });
    };

    // Attach listeners to links and buttons dynamically
    const cleanupLinks: Element[] = [];
    const addListeners = () => {
      const links = document.querySelectorAll("a, button, .project-row");
      links.forEach((link) => {
        if (!cleanupLinks.includes(link)) {
          link.addEventListener("mouseenter", handleMouseEnter);
          link.addEventListener("mouseleave", handleMouseLeave);
          cleanupLinks.push(link);
        }
      });
    };

    addListeners();

    // Observe DOM changes to attach listeners to new links
    const observer = new MutationObserver(() => {
      addListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cleanupLinks.forEach((link) => {
        link.removeEventListener("mouseenter", handleMouseEnter);
        link.removeEventListener("mouseleave", handleMouseLeave);
      });
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-3 h-3 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference -translate-x-1/2 -translate-y-1/2 hidden md:block"
    ></div>
  );
}
