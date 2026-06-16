"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote: "Ashish elevated our product from functional to extraordinary.",
    name: "Design Team",
  },
  {
    quote: "An absolute masterclass in creative engineering and motion.",
    name: "Creative Agency",
  }
];

export function Testimonials() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(".testimonial-item", {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
      },
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.3,
      ease: "power3.out",
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="w-full px-6 md:px-12 py-24 md:py-32 flex flex-col gap-24 md:gap-32 border-t border-[#0A0A0A]/10">
      {testimonials.map((t, i) => (
        <div key={i} className="testimonial-item flex flex-col w-full max-w-5xl mx-auto text-center">
          <h3 className="text-3xl md:text-5xl lg:text-6xl font-medium italic leading-tight tracking-tight mb-8">
            &quot;{t.quote}&quot;
          </h3>
          <p className="text-sm md:text-base font-bold uppercase tracking-widest text-[#0A0A0A]/60">
            — {t.name}
          </p>
        </div>
      ))}
    </section>
  );
}
