"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { onPreloaderDone } from "@/lib/preloader-signal";
import { cn } from "@/lib/utils";

const FONT_SIZE = 100; // satuan SVG
const LINE_GAP = FONT_SIZE * 0.88;
const DASH = 900; // lebih panjang dari keliling glyph terbesar
const STROKE_S = 2.2; // durasi menggambar garis tiap huruf
const STAGGER_S = 0.07; // jeda antar huruf
const FILL_S = 0.8; // durasi isi huruf muncul
const FALLBACK_MS = 6_000; // kalau sinyal preloader tidak pernah datang

interface DrawnLinesProps {
  lines: string[];
  play: boolean;
  instant: boolean;
  className?: string;
}

/** Teks SVG yang garis tepinya "digambar" per huruf, lalu diisi warna. */
function DrawnLines({ lines, play, instant, className }: DrawnLinesProps) {
  const groupRef = useRef<SVGGElement>(null);
  const [viewBox, setViewBox] = useState<string | null>(null);

  // Ukur teks setelah font siap supaya viewBox pas dengan hurufnya
  useLayoutEffect(() => {
    let cancelled = false;
    const measure = () => {
      const g = groupRef.current;
      if (!g || cancelled) return;
      const b = g.getBBox();
      // SVG yang sedang disembunyikan (display:none) mengukur 0 — abaikan
      if (b.width === 0 || b.height === 0) return;
      const pad = 6;
      setViewBox(
        `${b.x - pad} ${b.y - pad} ${b.width + pad * 2} ${b.height + pad * 2}`,
      );
    };
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", measure);
    };
  }, [lines]);

  let index = 0;

  return (
    <svg
      aria-hidden
      viewBox={viewBox ?? "0 0 1000 200"}
      className={cn("h-auto overflow-visible", !viewBox && "invisible", className)}
    >
      <g ref={groupRef}>
        {lines.map((line, li) => (
          <text
            key={li}
            x={0}
            y={li * LINE_GAP}
            textAnchor="middle"
            fontSize={FONT_SIZE}
            className="fill-current font-sans font-black tracking-tighter uppercase"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinejoin="round"
          >
            {Array.from(line).map((ch, ci) => {
              const i = index++;
              const delay = i * STAGGER_S;
              return (
                <tspan
                  key={ci}
                  style={{
                    strokeDasharray: DASH,
                    strokeDashoffset: play ? 0 : DASH,
                    fillOpacity: play ? 1 : 0,
                    transition: instant
                      ? "none"
                      : `stroke-dashoffset ${STROKE_S}s cubic-bezier(0.45,0,0.55,1) ${delay}s, fill-opacity ${FILL_S}s ease-out ${delay + STROKE_S - 0.3}s`,
                  }}
                >
                  {ch}
                </tspan>
              );
            })}
          </text>
        ))}
      </g>
    </svg>
  );
}

interface DrawnNameProps {
  firstName: string;
  lastName: string;
  className?: string;
}

/**
 * Nama besar di hero dengan animasi masuk ala "stroke draw":
 * garis tepi tiap huruf digambar berurutan, lalu isinya muncul.
 * Mulai setelah preloader selesai.
 */
export function DrawnName({ firstName, lastName, className }: DrawnNameProps) {
  const [play, setPlay] = useState(false);
  const [instant, setInstant] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInstant(true);
      setPlay(true);
      return;
    }
    const start = () => requestAnimationFrame(() => setPlay(true));
    const off = onPreloaderDone(start);
    const fallback = setTimeout(start, FALLBACK_MS);
    return () => {
      off();
      clearTimeout(fallback);
    };
  }, []);

  const full = `${firstName} ${lastName}`.trim();

  return (
    <h1 className={className}>
      <span className="sr-only">{full}</span>
      {/* Mobile: dua baris */}
      <DrawnLines
        lines={[firstName, lastName]}
        play={play}
        instant={instant}
        className="mx-auto block w-[86vw] md:hidden"
      />
      {/* Desktop: satu baris */}
      <DrawnLines
        lines={[full]}
        play={play}
        instant={instant}
        className="mx-auto hidden w-[84vw] md:block"
      />
    </h1>
  );
}
