"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

export function Contact() {
  const containerRef = useRef<HTMLElement>(null);
  const emailRef = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      // Background color transition on scroll
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 60%",
        onEnter: () =>
          gsap.to(document.body, {
            backgroundColor: "#0A0A0A",
            color: "#E8E6DF",
            duration: 0.6,
          }),
        onLeaveBack: () =>
          gsap.to(document.body, {
            backgroundColor: "var(--background)",
            color: "var(--foreground)",
            duration: 0.6,
          }),
      });

      // Headline CTA Staggered letter rise
      const headlineText = new SplitType(".contact-headline-line", {
        types: "chars",
      });
      // Wrap chars to hide overflow for the rise effect
      headlineText.chars?.forEach((char) => {
        const wrap = document.createElement("div");
        wrap.style.overflow = "hidden";
        wrap.style.display = "inline-block";
        char.parentNode?.insertBefore(wrap, char);
        wrap.appendChild(char);
      });

      gsap.from(headlineText.chars, {
        scrollTrigger: {
          trigger: ".contact-headline-line",
          start: "top 80%",
        },
        y: 80,
        stagger: 0.03,
        duration: 1,
        ease: "expo.out",
      });

      // Social links Fade up stagger
      gsap.from(".social-link", {
        scrollTrigger: {
          trigger: ".social-container",
          start: "top 90%",
        },
        y: 20,
        opacity: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: "power2.out",
      });

      // Letter scramble on email hover
      const emailEl = emailRef.current;
      if (emailEl) {
        const original = emailEl.innerText;
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let interval: ReturnType<typeof setInterval>;

        emailEl.addEventListener("mouseenter", () => {
          let iter = 0;
          clearInterval(interval);
          interval = setInterval(() => {
            emailEl.innerText = original
              .split("")
              .map((c, i) => {
                if (c === "@" || c === ".") return c; // keep special chars
                if (i < iter) return original[i];
                return chars[Math.floor(Math.random() * 26)];
              })
              .join("");

            if (iter >= original.length) {
              clearInterval(interval);
              emailEl.innerText = original;
            }
            iter += 0.4;
          }, 30);
        });
        emailEl.addEventListener("mouseleave", () => {
          clearInterval(interval);
          emailEl.innerText = original;
        });
      }

      return () => {
        headlineText.revert();
      };
    },
    { scope: containerRef },
  );

  return (
    <footer
      id="contact"
      ref={containerRef}
      className="relative overflow-hidden w-full px-6 md:px-12 py-12 flex flex-col items-center text-center min-h-screen transition-colors duration-500"
    >
      <div className="flex flex-col items-center justify-center flex-1 w-full relative z-10">
        <h2 className="contact-headline-line text-[clamp(36px,12vw,160px)] font-black uppercase leading-[0.85] tracking-tighter whitespace-nowrap">
          LET&apos;S WORK
        </h2>
        <h2 className="contact-headline-line text-[clamp(36px,12vw,160px)] font-black uppercase leading-[0.85] tracking-tighter mb-8 md:mb-12 whitespace-nowrap">
          TOGETHER
        </h2>
        <a
          ref={emailRef}
          href="mailto:hello@example.com"
          className="text-xl sm:text-2xl md:text-4xl font-medium tracking-tight transition-opacity duration-300 inline-block uppercase break-all"
        >
          hello@example.com
        </a>
      </div>

      <div className="social-container w-full flex flex-col md:flex-row justify-between items-end border-t border-current/10 pt-8 md:pt-12 mt-auto relative z-10">
        <div className="flex flex-col md:flex-row gap-8 md:gap-24 w-full md:w-auto mb-8 md:mb-0 text-left">
          <div className="flex flex-col gap-4 text-sm md:text-base font-medium uppercase tracking-widest">
            <a
              href="#"
              className="social-link hover:opacity-50 transition-opacity duration-300 min-h-[44px] flex items-center"
            >
              Twitter / X
            </a>
            <a
              href="#"
              className="social-link hover:opacity-50 transition-opacity duration-300 min-h-[44px] flex items-center"
            >
              LinkedIn
            </a>
          </div>
          <div className="flex flex-col gap-4 text-sm md:text-base font-medium uppercase tracking-widest">
            <a
              href="#"
              className="social-link hover:opacity-50 transition-opacity duration-300 min-h-[44px] flex items-center"
            >
              GitHub
            </a>
            <a
              href="#"
              className="social-link hover:opacity-50 transition-opacity duration-300 min-h-[44px] flex items-center"
            >
              Dribbble
            </a>
          </div>
        </div>

        <div className="w-full md:w-auto text-left md:text-right text-xs md:text-sm font-medium uppercase tracking-widest opacity-40">
          © {new Date().getFullYear()} Ashish. All rights reserved.
        </div>
      </div>

      {/* Large background text */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-[-5%] font-extrabold tracking-tighter pointer-events-none select-none text-center px-4 opacity-[0.12] leading-none"
        style={{
          fontSize: "clamp(5rem, 30vw, 30rem)",
          maxWidth: "100vw",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 20%, transparent 90%)",
          maskImage: "linear-gradient(to bottom, black 20%, transparent 90%)",
        }}
      >
        45h15h
      </div>
    </footer>
  );
}
