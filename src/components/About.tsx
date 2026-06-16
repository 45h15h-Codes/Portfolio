"use client";
import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Word-by-word text reveal
    const text = new SplitType(".bio-text", { types: "words" });
    gsap.from(text.words, {
      scrollTrigger: {
        trigger: ".bio-text",
        start: "top 80%",
      },
      opacity: 0,
      y: 10,
      duration: 0.5,
      stagger: 0.02,
      ease: "power2.out",
    });

    // Photo reveal wipe
    gsap.to(".photo-overlay", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
      },
      scaleX: 0,
      duration: 1,
      ease: "expo.out",
    });

    // Photo parallax
    gsap.to(".about-photo", {
      yPercent: -20,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    // Skills list underline draw
    gsap.to(".skill-underline", {
      scrollTrigger: {
        trigger: ".skill-list",
        start: "top 85%",
      },
      scaleX: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out",
    });

    return () => {
      text.revert();
    };
  }, { scope: containerRef });

  return (
    <section id="about" ref={containerRef} className="about-container w-full px-6 md:px-12 py-24 md:py-32 flex flex-col md:flex-row items-stretch gap-16 md:gap-0">
      {/* Left Column (40%) */}
      <div className="w-full md:w-[40%] relative pr-0 md:pr-16">
        <div className="relative w-full aspect-[3/4] md:aspect-[4/5] overflow-hidden">
          <div className="photo-overlay absolute inset-0 bg-[#E8E6DF] origin-right z-20"></div>
          <div className="about-photo relative w-full h-[125%] top-0">
            <Image
              src="/about.png"
              alt="Candid portrait"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover grayscale"
            />
          </div>
        </div>
      </div>

      {/* Right Column (60%) */}
      <div className="w-full md:w-[60%] flex flex-col justify-between">
        <div>
          <p className="bio-text text-[18px] md:text-[22px] leading-[1.8] font-normal max-w-3xl mb-16">
            I am a creative developer bridging the gap between design and engineering. 
            With a strong focus on aesthetics and interaction, I build digital experiences 
            that are both visually striking and performant. My work involves collaborating 
            closely with designers and agencies to bring ambitious concepts to life on the web.
          </p>
          <ul className="skill-list flex flex-col gap-4 text-sm md:text-base font-medium uppercase tracking-widest text-[#0A0A0A]/60">
            {["Creative Development", "WebGL & 3D Interactions", "Motion & Animation", "Frontend Architecture"].map((skill, i) => (
              <li key={i} className="skill-item relative w-fit pb-1 text-[#0A0A0A]">
                {skill}
                <div className="skill-underline absolute bottom-0 left-0 w-full h-[1px] bg-current origin-left scale-x-0"></div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-24 md:mt-32">
          <a href="#" className="group flex items-center w-fit gap-2 text-sm md:text-base font-bold uppercase tracking-wide hover:opacity-50 transition-opacity duration-300 min-h-[44px] py-2">
            LinkedIn
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
              <line x1="5" y1="19" x2="19" y2="5"></line>
              <polyline points="9 5 19 5 19 15"></polyline>
            </svg>
          </a>
          <a href="#" className="group flex items-center w-fit gap-2 text-sm md:text-base font-bold uppercase tracking-wide hover:opacity-50 transition-opacity duration-300 min-h-[44px] py-2">
            GitHub
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
              <line x1="5" y1="19" x2="19" y2="5"></line>
              <polyline points="9 5 19 5 19 15"></polyline>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
