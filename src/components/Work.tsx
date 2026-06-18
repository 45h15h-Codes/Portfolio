"use client";
import Image from "next/image";
import { TransitionLink } from "@/components/TransitionLink";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { id: "01", title: "Diamond CRM", client: "OM GEMS", tag: "LARAVEL - VUE.JS", year: "2025", img: "/project_1.png" },
  { id: "02", title: "Banking System", client: "PERSONAL", tag: "MICROSERVICES - LARAVEL", year: "2025", img: "/project_2.png" },
  { id: "03", title: "GitReport", client: "OPEN SOURCE", tag: "NODE.JS - TYPESCRIPT", year: "2024", img: "/project_3.png" },
  { id: "04", title: "Veritas Gem Lab", client: "OM GEMS", tag: "TYPESCRIPT - WEB APP", year: "2025", img: "/project_3.png" },
  { id: "05", title: "Gold API", client: "OPEN SOURCE", tag: "PYTHON - REST API", year: "2024", img: "/project_2.png" },
  { id: "06", title: "RankUp", client: "FREELANCE", tag: "TYPESCRIPT - WEB APP", year: "2025", img: "/project_1.png" },
  { id: "07", title: "Portfolio", client: "PERSONAL", tag: "NEXT.JS - GSAP", year: "2025", img: "/project_2.png" },
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
    <section id="work" ref={containerRef} className="w-full px-6 md:px-12 py-24 md:py-32 relative">
      {/* Header section */}
      <div className="w-full flex flex-col md:block mb-16 md:mb-24 relative">
        <div className="md:absolute md:top-0 md:left-0 text-[10px] md:text-xs font-semibold uppercase tracking-widest text-foreground/50 mb-2 md:mb-0 md:mt-4">
          / SELECTED
        </div>
        <h2 className="text-[14vw] md:text-[9vw] font-black uppercase tracking-tighter leading-none md:mx-auto text-foreground md:text-center">
          RECENT WORK
        </h2>
      </div>

      <div className="w-full relative">
        <div className="section-border absolute top-0 left-0 w-full h-[1px] bg-foreground/10 z-10"></div>
        
        {projects.map((project) => (
          <TransitionLink 
            key={project.id}
            href={`/project/${project.id}`}
            className="group project-row block relative flex flex-col md:flex-row items-start md:items-center w-full py-6 md:py-8 cursor-pointer hover:bg-foreground/[0.03] transition-colors duration-300"
          >
            <div className="row-border absolute bottom-0 left-0 w-full h-[1px] bg-foreground/10"></div>
            
            <div className="w-full md:w-[8%] text-xs font-semibold tracking-wider text-foreground/40 mb-2 md:mb-0 transition-colors duration-300 md:pl-2">
              {project.id}
            </div>
            
            <div className="w-full md:w-[32%] text-[28px] md:text-[32px] font-extrabold tracking-tight leading-none text-foreground group-hover:text-foreground/80 transition-transform duration-300 md:group-hover:translate-x-2">
              {project.title}
            </div>
            
            <div className="w-full md:w-[25%] mt-2 md:mt-0 text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground/50 transition-transform duration-300 md:group-hover:translate-x-2 hidden md:block">
              {project.client}
            </div>
            
            <div className="w-full md:w-[25%] mt-1 md:mt-0 text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground/50 transition-transform duration-300 md:group-hover:translate-x-2 hidden md:block">
              {project.tag}
            </div>
            
            <div className="w-full md:w-[10%] mt-4 md:mt-0 text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.15em] text-foreground/50 text-left md:text-right transition-transform duration-300 md:group-hover:-translate-x-2 hidden md:block md:pr-2">
              {project.year} ↗
            </div>

            {/* Mobile metadata */}
            <div className="w-full flex md:hidden justify-between mt-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-foreground/50">
               <div>{project.tag}</div>
               <div>{project.year} ↗</div>
            </div>

            {/* Hover Image */}
            <div className="project-img absolute right-1/4 top-1/2 -translate-y-1/2 w-[60vw] md:w-[28vw] aspect-[4/3] pointer-events-none opacity-0 scale-90 z-20 hidden md:block shadow-2xl">
              <Image
                src={project.img}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 60vw, 28vw"
                className="object-cover"
              />
            </div>
          </TransitionLink>
        ))}
      </div>
    </section>
  );
}
