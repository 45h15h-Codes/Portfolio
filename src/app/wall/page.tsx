/* Hallmark · pre-emit critique: P5 H5 E5 S5 R5 V5 */
"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { isSafeImageDataUrl } from "@/lib/validateImage";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface Drawing {
  image_data: string;
  created_at: string;
}

export default function WallPage() {
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedDrawing, setSelectedDrawing] = useState<Drawing | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchRecentDrawings = async () => {
      const { data, error } = await supabase
        .from("drawings")
        .select("image_data, created_at")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Failed to fetch drawings:", error);
        setFetchError("Couldn't load the wall. Try refreshing.");
        return;
      }
      if (data) {
        setFetchError(null);
        setDrawings(data);
      }
    };
    fetchRecentDrawings();
  }, []);

  useGSAP(() => {
    // Headline animation matching main site
    gsap.from(".headline", {
      clipPath: "inset(100% 0 0 0)",
      duration: 0.9,
      ease: "power4.out",
      stagger: 0.1,
    });
    
    // Grid items animation
    gsap.from(".gallery-item", {
      opacity: 0,
      y: 40,
      duration: 0.8,
      stagger: 0.05,
      ease: "power3.out",
      delay: 0.4
    });
  }, { scope: containerRef });

  const handleDownload = (drawing: Drawing) => {
    const link = document.createElement("a");
    link.download = `visitor-mark-${new Date(drawing.created_at).getTime()}.png`;
    link.href = drawing.image_data;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main 
      ref={containerRef}
      className="w-full max-w-full overflow-x-clip min-h-screen bg-background text-foreground font-sans selection:bg-foreground selection:text-background p-6 md:p-12 pb-24"
    >
      {/* Navigation matching main site brutalism */}
      <nav className="w-full flex justify-between items-start pb-16 md:pb-24 text-[10px] md:text-xs font-mono tracking-widest uppercase opacity-80">
        <Link href="/" className="hover:opacity-60 transition-opacity">
          [ 45 ]
        </Link>
        <Link href="/editor" className="hover:opacity-60 transition-opacity">
          [ ADD DRAWING ]
        </Link>
      </nav>

      {/* Hero matching main site's huge typography */}
      <header className="w-full flex flex-col justify-start mb-24 md:mb-32">
        <h1 className="text-[clamp(32px,11vw,160px)] font-black uppercase leading-[0.85] tracking-tighter w-full break-words">
          <div className="headline">VISITOR</div>
          <div className="headline">WALL</div>
        </h1>
      </header>

      {/* Wall Gallery - Brutalist Grid with hairline borders */}
      <section className="w-full border-t border-foreground/20">
        {fetchError ? (
          <p className="py-12 uppercase font-mono text-sm opacity-60">{fetchError}</p>
        ) : drawings.length === 0 ? (
          <div className="py-24 w-full flex flex-col md:flex-row justify-between items-center border-b border-foreground/20">
            <h3 className="text-[clamp(24px,5vw,64px)] font-black uppercase tracking-tighter">NO DRAWINGS YET</h3>
            <Link 
              href="/editor" 
              className="mt-6 md:mt-0 text-sm font-mono tracking-widest uppercase hover:opacity-60 transition-opacity"
            >
              [ START DRAWING ]
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-0 border-l border-foreground/20">
            {drawings.map((drawing, i) => (
              <button 
                key={i} 
                onClick={() => isSafeImageDataUrl(drawing.image_data) && setSelectedDrawing(drawing)}
                className="gallery-item relative aspect-square border-r border-b border-foreground/20 bg-background overflow-hidden group cursor-pointer focus-visible:outline-none focus-visible:bg-foreground/5 text-left w-full h-full"
              >
                {isSafeImageDataUrl(drawing.image_data) ? (
                  <div className="w-full h-full p-8 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500 bg-foreground/5 group-hover:bg-foreground/10">
                    <img
                      src={drawing.image_data}
                      alt="A visitor's drawing"
                      className="w-full h-auto object-contain scale-90 group-hover:scale-100 transition-transform duration-500 ease-out pointer-events-none shadow-sm bg-[#f7f5f0]"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center opacity-30 text-xs font-mono uppercase tracking-widest">
                    ERROR
                  </div>
                )}
                {/* Brutalist meta labels */}
                <div className="absolute top-4 left-4 mix-blend-difference pointer-events-none">
                  <p className="text-[10px] font-mono tracking-widest uppercase text-white/50 group-hover:text-white transition-colors duration-300">
                    {new Date(drawing.created_at).toLocaleDateString(undefined, { 
                      month: '2-digit', 
                      day: '2-digit',
                      year: '2-digit'
                    }).replace(/\//g, '.')}
                  </p>
                </div>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-difference pointer-events-none">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-white">[{String(i + 1).padStart(2, '0')}]</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Footer CTA mirroring the main site's Let's Work Together */}
      {drawings.length > 0 && (
        <section className="w-full mt-32 md:mt-48 flex justify-end">
          <Link 
            href="/editor" 
            className="group focus-visible:outline-none block"
          >
            <h2 className="text-[clamp(36px,11vw,160px)] font-black uppercase leading-[0.75] tracking-tighter text-right group-hover:opacity-70 transition-opacity">
              ADD<br />YOUR<br />MARK
            </h2>
          </Link>
        </section>
      )}

      {/* Lightbox Modal */}
      {selectedDrawing && (
        <div 
          className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-md"
          onClick={() => setSelectedDrawing(null)}
        >
          {/* Top Bar */}
          <div className="w-full flex justify-between items-center p-6 md:p-12 absolute top-0 left-0 z-10 pointer-events-none">
            <div className="text-[10px] md:text-xs font-mono tracking-widest uppercase opacity-80 pointer-events-auto">
              [ {new Date(selectedDrawing.created_at).toLocaleDateString(undefined, { 
                  month: '2-digit', 
                  day: '2-digit',
                  year: 'numeric'
                }).replace(/\//g, '.')} ]
            </div>
            <div className="flex gap-6 md:gap-12 pointer-events-auto">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(selectedDrawing);
                }}
                className="text-[10px] md:text-xs font-mono tracking-widest uppercase hover:opacity-60 transition-opacity"
              >
                [ DOWNLOAD PNG ]
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDrawing(null);
                }}
                className="text-[10px] md:text-xs font-mono tracking-widest uppercase hover:opacity-60 transition-opacity"
              >
                [ CLOSE ]
              </button>
            </div>
          </div>
          
          {/* Main Image */}
          <div className="flex-1 w-full h-full p-12 md:p-24 flex items-center justify-center">
            <img 
              src={selectedDrawing.image_data} 
              alt="Enlarged drawing"
              className="max-w-[90vw] max-h-[80vh] object-contain animate-in fade-in zoom-in-95 duration-300 pointer-events-none shadow-2xl bg-[#f7f5f0]"
            />
          </div>
        </div>
      )}
    </main>
  );
}
