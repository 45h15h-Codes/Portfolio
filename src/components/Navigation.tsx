"use client";
import { TransitionLink as Link } from "@/components/TransitionLink";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useTheme } from "next-themes";
import { AnimatedThemeToggle } from "@/components/ui/animated-theme-toggle";

export function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useGSAP(() => {
    gsap.from(navRef.current, {
      y: -20,
      opacity: 0,
      duration: 0.6,
      delay: 0,
      ease: "power2.out"
    });
  }, []);

  return (
    <nav ref={navRef} className="flex flex-col md:flex-row w-full justify-between items-start md:items-center text-sm md:text-base font-normal mb-16 md:mb-32 relative z-50">
      <div className="flex w-full justify-between items-center md:contents">
        <div className="flex-1">Ashish</div>
        
        {/* Mobile Hamburger & Theme */}
        <div className="md:hidden flex justify-end items-center gap-4">
          {mounted && <AnimatedThemeToggle className="scale-75 origin-right border-none shadow-none hover:bg-transparent" />}
          <button onClick={() => setIsOpen(!isOpen)} className="uppercase font-medium tracking-wide">
            {isOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      <div className="hidden md:block flex-1 text-left">Creative Developer / Freelance</div>
      <div className="hidden md:block flex-1 text-center">Based in Earth</div>
      
      {/* Desktop Links */}
      <div className="hidden md:flex flex-1 gap-6 justify-end items-center">
        <Link href="/#work" className="hover:opacity-50 transition-opacity duration-300 ease-in-out">Work</Link>
        <Link href="/#about" className="hover:opacity-50 transition-opacity duration-300 ease-in-out">About</Link>
        <Link href="/#contact" className="hover:opacity-50 transition-opacity duration-300 ease-in-out">Contact</Link>
        {mounted && <AnimatedThemeToggle className="ml-2 scale-90 border-none shadow-none hover:bg-transparent" />}
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="w-full flex flex-col gap-6 text-2xl uppercase pt-8 mt-4 border-t border-current/10 md:hidden bg-transparent">
          <Link href="/#work" onClick={() => setIsOpen(false)}>Work</Link>
          <Link href="/#about" onClick={() => setIsOpen(false)}>About</Link>
          <Link href="/#contact" onClick={() => setIsOpen(false)}>Contact</Link>
        </div>
      )}
    </nav>
  );
}
