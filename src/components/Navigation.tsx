"use client";
import { TransitionLink as Link } from "@/components/TransitionLink";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useTheme } from "next-themes";
import { AnimatedThemeToggle } from "@/components/ui/animated-theme-toggle";
import { SVG3D } from "3dsvg";

export function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const logoColor = mounted && resolvedTheme === "dark" ? "#f5f5f5" : "#111111";

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useGSAP(() => {
    gsap.from(navRef.current, {
      y: -20,
      opacity: 0,
      duration: 0.6,
      delay: 0,
      ease: "power2.out",
    });
  }, []);

  return (
    <nav
      ref={navRef}
      className="flex flex-col md:flex-row w-full justify-between items-start md:items-center text-sm md:text-base font-normal mb-16 relative z-50"
    >
      <div className="flex w-full justify-between items-center md:contents">
        <Link
          href="/"
          className="w-[100px] sm:w-[140px] h-[60px] md:w-[250px] md:h-[80px] shrink-0 overflow-visible flex items-center cursor-pointer"
        >
          <div className="-ml-6 sm:-ml-4 md:-ml-2 mt-0 md:mt-[-30px] scale-[0.6] sm:scale-[0.75] md:scale-100 origin-left hover:opacity-80 transition-opacity">
            <SVG3D
              text="45"
              font="Permanent Marker"
              width="250px"
              height="120px"
              zoom={4}
              intro="none"
              shadow={true}
              smoothness={0.6}
              color={logoColor}
              material="holographic"
              metalness={0.8}
              roughness={0.1}
              opacity={0.7}
              animate="float"
              cursorOrbit
              orbitStrength={0.49}
              resetOnIdle
              resetDelay={0.5}
              lightPosition={[-2.5, 0, 10]}
              lightIntensity={1.2}
              ambientIntensity={0.3}
            />
          </div>
        </Link>

        {/* Mobile Hamburger & Theme */}
        <div className="md:hidden flex justify-end items-center gap-2">
          {mounted && (
            <AnimatedThemeToggle className="scale-75 origin-right border-none shadow-none hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current rounded-sm min-w-[44px] min-h-[44px] flex items-center justify-center" />
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="uppercase font-medium tracking-wide cursor-pointer hover:opacity-50 transition-opacity duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current rounded-sm p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            {isOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {/* <div className="hidden md:block flex-1 text-left">Creative Developer / Freelance</div> */}
      <div className="hidden md:block flex-1 text-center">Based in Earth</div>

      {/* Desktop Links */}
      <div className="hidden md:flex flex-1 gap-6 justify-end items-center">
        <Link
          href="/#work"
          className="cursor-pointer hover:opacity-50 transition-opacity duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current rounded-sm p-1"
        >
          Work
        </Link>
        <Link
          href="/#about"
          className="cursor-pointer hover:opacity-50 transition-opacity duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current rounded-sm p-1"
        >
          About
        </Link>
        <Link
          href="/#contact"
          className="cursor-pointer hover:opacity-50 transition-opacity duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current rounded-sm p-1"
        >
          Contact
        </Link>
        {mounted && (
          <AnimatedThemeToggle className="ml-2 scale-90 border-none shadow-none hover:bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current rounded-sm" />
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="w-full flex flex-col gap-6 text-2xl uppercase pt-8 mt-4 border-t border-black/10 dark:border-white/10 md:hidden bg-transparent">
          <Link
            href="/#work"
            onClick={() => setIsOpen(false)}
            className="cursor-pointer hover:opacity-50 transition-opacity duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current rounded-sm inline-block w-fit"
          >
            Work
          </Link>
          <Link
            href="/#about"
            onClick={() => setIsOpen(false)}
            className="cursor-pointer hover:opacity-50 transition-opacity duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current rounded-sm inline-block w-fit"
          >
            About
          </Link>
          <Link
            href="/#contact"
            onClick={() => setIsOpen(false)}
            className="cursor-pointer hover:opacity-50 transition-opacity duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current rounded-sm inline-block w-fit"
          >
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
}
