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

    // Recalculate trigger positions after SplitType changed DOM layout
    ScrollTrigger.refresh();

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
          <div className="about-photo relative w-full h-[105%] top-0">
            <Image
              src="/about-giphy.gif"
              alt="Candid portrait"
              fill
              unoptimized
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
            As a Full Stack Developer, I build custom E-commerce and CRM solutions. 
            I specialize in Laravel and PHP, along with MySQL, HTML, and CSS. 
            I’m passionate about continuous learning, problem-solving, and 
            turning ideas into practical, scalable digital solutions.
          </p>
          <ul className="skill-list flex flex-col gap-4 text-sm md:text-base font-medium uppercase tracking-widest text-foreground/60">
            {["Laravel & PHP", "React & Next.js", "System Architecture", "MySQL & Web Tech"].map((skill, i) => (
              <li key={i} className="skill-item relative w-fit pb-1 text-foreground">
                {skill}
                <div className="skill-underline absolute bottom-0 left-0 w-full h-[1px] bg-current origin-left scale-x-0"></div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-24 md:mt-32">
          <a href="https://www.linkedin.com/in/ashish-vala" target="_blank" rel="noopener noreferrer" className="group flex items-center w-fit gap-2 text-sm md:text-base font-bold uppercase tracking-wide hover:opacity-50 transition-opacity duration-300 min-h-[44px] py-2">
            LinkedIn
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
              <line x1="5" y1="19" x2="19" y2="5"></line>
              <polyline points="9 5 19 5 19 15"></polyline>
            </svg>
          </a>
          <a href="https://github.com/45h15h-Codes" target="_blank" rel="noopener noreferrer" className="group flex items-center w-fit gap-2 text-sm md:text-base font-bold uppercase tracking-wide hover:opacity-50 transition-opacity duration-300 min-h-[44px] py-2">
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
