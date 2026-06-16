"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

function isCanvasBlank(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return true;
  const pixelBuffer = new Uint32Array(
    ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer
  );
  // 0 is transparent, 0xffffffff is white (if little endian), we just check if it's all white or transparent
  // A more robust check for white background is to see if any pixel is NOT 0xffffffff (white) and NOT 0 (transparent)
  return !pixelBuffer.some((color) => color !== 0xffffffff && color !== 0);
}

function getOrCreateFingerprint() {
  let fp = localStorage.getItem("drawing_fp");
  if (!fp) {
    fp = crypto.randomUUID();
    localStorage.setItem("drawing_fp", fp);
  }
  return fp;
}

function canSubmit() {
  const last = localStorage.getItem("last_drawing_submit");
  if (!last) return true;
  const cooldownMs = 60 * 1000;
  return Date.now() - parseInt(last, 10) > cooldownMs;
}

interface Drawing {
  image_data: string;
  created_at: string;
}

export default function WallPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [status, setStatus] = useState<string>("");

  const fetchRecentDrawings = async () => {
    const { data, error } = await supabase
      .from("drawings")
      .select("image_data, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    if (!error && data) {
      setDrawings(data);
    }
  };

  useEffect(() => {
    fetchRecentDrawings();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#0a0a0a";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    let drawing = false;
    let last = { x: 0, y: 0 };

    function getPos(e: MouseEvent | TouchEvent) {
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      return { x: clientX - rect.left, y: clientY - rect.top };
    }

    function start(e: MouseEvent | TouchEvent) { 
      drawing = true; 
      last = getPos(e);
      if (e.cancelable && e.type === "touchstart") e.preventDefault();
    }
    
    function move(e: MouseEvent | TouchEvent) {
      if (!drawing || !ctx) return;
      const p = getPos(e);
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      last = p;
      if (e.cancelable && e.type === "touchmove") e.preventDefault();
    }
    
    function stop() { 
      drawing = false; 
    }

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", move);
    canvas.addEventListener("mouseup", stop);
    canvas.addEventListener("mouseleave", stop);
    canvas.addEventListener("touchstart", start as any, { passive: false });
    canvas.addEventListener("touchmove", move as any, { passive: false });
    canvas.addEventListener("touchend", stop);

    return () => {
      canvas.removeEventListener("mousedown", start);
      canvas.removeEventListener("mousemove", move);
      canvas.removeEventListener("mouseup", stop);
      canvas.removeEventListener("mouseleave", stop);
      canvas.removeEventListener("touchstart", start as any);
      canvas.removeEventListener("touchmove", move as any);
      canvas.removeEventListener("touchend", stop);
    };
  }, []);

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setStatus("");
  };

  const handleSubmit = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isCanvasBlank(canvas)) {
      setStatus("Draw something first.");
      return;
    }
    
    if (!canSubmit()) {
      setStatus("You can submit again in a minute.");
      return;
    }

    setStatus("Submitting...");
    const imageData = canvas.toDataURL("image/png");
    const fingerprint = getOrCreateFingerprint();

    const { error } = await supabase
      .from("drawings")
      .insert({ image_data: imageData, client_fingerprint: fingerprint });

    if (error) {
      setStatus("Something went wrong, try again.");
      return;
    }

    localStorage.setItem("last_drawing_submit", Date.now().toString());
    setStatus("Submitted successfully.");
    fetchRecentDrawings();
    
    // Clear canvas
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    setTimeout(() => setStatus(""), 3000);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-white dark:bg-[#0A0A0A] text-[#0A0A0A] dark:text-[#E5E5E5] transition-colors duration-400">
      <div className="max-w-4xl w-full flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-2xl font-medium tracking-tight mb-2">leave your mark</h1>
          <p className="text-sm opacity-60">Draw something and submit it to the wall.</p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <canvas
            ref={canvasRef}
            width={280}
            height={180}
            className="border border-[#0A0A0A] dark:border-[#E5E5E5] rounded-sm touch-none bg-white cursor-crosshair"
          />
          <div className="flex items-center gap-4">
            <button
              onClick={handleClear}
              className="text-sm font-medium opacity-60 hover:opacity-100 transition-opacity min-h-[44px] px-2"
            >
              Clear
            </button>
            <button
              onClick={handleSubmit}
              className="text-sm font-medium px-4 py-2 min-h-[44px] border border-[#0A0A0A] dark:border-[#E5E5E5] rounded-sm hover:bg-[#0A0A0A] hover:text-[#E5E5E5] dark:hover:bg-[#E5E5E5] dark:hover:text-[#0A0A0A] transition-colors"
            >
              Submit
            </button>
          </div>
          {status && <p className="text-xs opacity-80 h-4">{status}</p>}
        </div>

        <div className="w-full mt-12">
          <h2 className="text-sm font-medium mb-4 opacity-60 text-center">Last 10 drawings</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {drawings.map((drawing, i) => (
              <div key={i} className="aspect-[280/180] w-full border border-black/10 dark:border-white/10 rounded-sm overflow-hidden bg-white">
                <img
                  src={drawing.image_data}
                  alt={`Drawing ${i}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <Link
          href="/"
          className="mt-12 text-xs font-medium opacity-40 hover:opacity-100 transition-opacity min-h-[44px] flex items-center justify-center"
        >
          Return to surface
        </Link>
      </div>
    </main>
  );
}
