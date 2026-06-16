"use client";
import Image from "next/image";
import { TransitionLink } from "@/components/TransitionLink";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { id: "01", title: "ARCHITECTURAL RENDER", tag: "Creative Dev · 2024", img: "/project_1.png" },
  { id: "02", title: "TYPOGRAPHY POSTER", tag: "Design · 2023", img: "/project_2.png" },
  { id: "03", title: "MINIMALIST MOCKUP", tag: "Web Design · 2023", img: "/project_3.png" },
];

export function Work() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Project rows fading in with stagger
    gsap.from(".project-row", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
      },
      y: 40,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: "power3.out",
    });

    // Top border expanding
    gsap.from(".section-border", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
      },
      scaleX: 0,
      transformOrigin: "left",
      duration: 0.6,
      ease: "ease-out",
    });

    // Row borders expanding
    gsap.from(".row-border", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
      },
      scaleX: 0,
      transformOrigin: "left",
      duration: 0.6,
      stagger: 0.12,
      ease: "ease-out",
    });

    // Magnetic hover
    const rows = gsap.utils.toArray<HTMLElement>(".project-row");
    rows.forEach((row) => {
      const img = row.querySelector(".project-img") as HTMLElement;
      if (img) {
        // QuickTo is GSAP's optimized way to lerp values for pointer tracking
        const xTo = gsap.quickTo(img, "x", { duration: 0.4, ease: "power3" });
        const yTo = gsap.quickTo(img, "y", { duration: 0.4, ease: "power3" });

        row.addEventListener("mousemove", (e: MouseEvent) => {
          const rect = row.getBoundingClientRect();
          xTo(e.clientX - rect.left - rect.width / 2);
          yTo(e.clientY - rect.top - rect.height / 2);
        });
        row.addEventListener("mouseenter", () => {
          gsap.to(img, { scale: 1, opacity: 1, duration: 0.3 });
        });
        row.addEventListener("mouseleave", () => {
          gsap.to(img, { scale: 0.9, opacity: 0, duration: 0.3 });
          xTo(0);
          yTo(0);
        });
      }
    });
  }, { scope: containerRef });

  return (
    <section id="work" ref={containerRef} className="w-full px-6 md:px-12 py-24 md:py-32">
      <div className="w-full relative">
        <div className="section-border absolute top-0 left-0 w-full h-[1px] bg-[#0A0A0A]/10"></div>
        {projects.map((project) => (
          <TransitionLink 
            key={project.id}
            href={`/project/${project.id}`}
            className="group project-row block relative flex flex-col md:flex-row items-start md:items-center w-full py-10 md:py-14 cursor-pointer"
          >
            <div className="row-border absolute bottom-0 left-0 w-full h-[1px] bg-[#0A0A0A]/10"></div>
            
            <div className="w-16 md:w-32 text-xl md:text-2xl text-[#0A0A0A]/40 font-medium mb-4 md:mb-0 transition-colors duration-300">
              {project.id}
            </div>
            <div className="flex-1 text-[28px] md:text-[36px] font-bold uppercase tracking-tight leading-none group-hover:text-[#0A0A0A] transition-transform duration-300 group-hover:translate-x-3">
              {project.title}
            </div>
            <div className="mt-6 md:mt-0 text-sm md:text-base font-normal uppercase transition-transform duration-300 group-hover:translate-x-3">
              {project.tag}
            </div>

            {/* Hover Image */}
            <div className="project-img absolute right-1/4 top-1/2 -translate-y-1/2 w-[60vw] md:w-[28vw] aspect-[4/3] pointer-events-none opacity-0 scale-90 z-10 hidden md:block">
              <Image
                src={project.img}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 60vw, 28vw"
                className="object-cover grayscale"
              />
            </div>
          </TransitionLink>
        ))}
      </div>
    </section>
  );
}
