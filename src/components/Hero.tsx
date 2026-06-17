"use client";
import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Headline text
      gsap.from(".headline", {
        clipPath: "inset(100% 0 0 0)",
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.1,
      });

      // Photo
      gsap.from(".hero-photo", {
        scale: 1.05,
        opacity: 0,
        duration: 1.1,
        delay: 0.3,
        ease: "power2.out",
      });

      // Name (bottom-right) & Tagline
      gsap.from(".hero-bottom", {
        y: 60,
        opacity: 0,
        duration: 1,
        delay: 0.5,
        stagger: 0.2,
        ease: "power3.out",
      });

      // Scroll arrow bounce loop
      gsap.to(".scroll-arrow", {
        y: 8,
        repeat: -1,
        yoyo: true,
        duration: 0.7,
        ease: "power1.inOut",
      });
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="flex-1 flex flex-col w-full h-full">
      {/* Hero Headline */}
      <div className="w-full flex justify-start mb-16 md:mb-24">
        <h1 className="text-[clamp(32px,11vw,160px)] font-black uppercase leading-[0.85] tracking-tighter w-full md:w-[80%] break-words">
          <div className="headline">CREATIVE</div>
          <div className="headline">DEVELOPER</div>
        </h1>
      </div>

      {/* Portrait Photo */}
      <div className="hero-photo w-full md:w-[40%] aspect-square relative mb-24 md:mb-32">
        <Image
          src="/cat-pfp.jpg"
          alt="Creative Developer Portrait"
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 40vw"
          className="object-cover grayscale"
          priority
        />
      </div>

      {/* Footer / Bottom Section */}
      <div className="flex flex-col-reverse md:flex-row w-full justify-between items-end mt-auto gap-16 md:gap-0">
        <div className="hero-bottom w-full md:w-1/3 flex flex-col gap-6">
          <svg
            className="scroll-arrow"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="square"
            strokeLinejoin="miter"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>
          <p className="text-sm md:text-base font-normal max-w-[280px] uppercase leading-relaxed tracking-wide">
            SELF-LEARNING DEVELOPER SPECIALIZING IN FULL STACK SOLUTIONS
          </p>
        </div>
        <div className="hero-bottom w-full md:w-auto text-right">
          <h2
            role="button"
            tabIndex={0}
            className="text-[clamp(36px,11vw,160px)] font-black uppercase leading-[0.75] tracking-tighter cursor-pointer break-all md:break-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-8"
            onClick={() => {
              const handleNavigate = () => {
                document.body.style.transition = "opacity 0.3s ease";
                document.body.style.opacity = "0";
                setTimeout(() => {
                  window.location.href = "/editor";
                  // Restore opacity in case the navigation doesn't go through
                  setTimeout(() => {
                    document.body.style.opacity = "1";
                  }, 1000);
                }, 300);
              };
              handleNavigate();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                // trigger the same navigation logic
                const target = e.currentTarget as HTMLElement;
                target.click();
              }
            }}
          >
            45H15H
          </h2>
        </div>
      </div>
    </div>
  );
}
