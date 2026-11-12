"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// Warna latar halaman tiap tema (sama dengan --background di globals.css).
// Ditulis langsung, karena variabel CSS ikut berubah di tengah animasi.
const BG = { dark: "#111110", light: "#f6f5f4" } as const;

const TOTAL_MS = 1700; // durasi seluruh animasi (lihat .tt-* di globals.css)
const SWAP_AT_MS = 700; // tema diganti saat layar tertutup penuh

type Direction = "to-light" | "to-dark";

function SunBody() {
  return (
    <div className="tt-body tt-sun">
      <span className="tt-sun-rays" />
      <span className="tt-sun-core" />
    </div>
  );
}

function MoonBody() {
  return (
    <div className="tt-body tt-moon">
      <span className="tt-crater" style={{ top: "22%", left: "28%", width: 22, height: 22 }} />
      <span className="tt-crater" style={{ top: "52%", left: "56%", width: 30, height: 30 }} />
      <span className="tt-crater" style={{ top: "64%", left: "26%", width: 14, height: 14 }} />
      <span className="tt-crater" style={{ top: "30%", left: "62%", width: 11, height: 11 }} />
    </div>
  );
}

/** Layar transisi: benda langit lama terbenam, yang baru terbit, latar ikut berganti. */
function ThemeTransition({ direction }: { direction: Direction }) {
  const toLight = direction === "to-light";
  return (
    <div className="tt-overlay" aria-hidden>
      <div className="tt-bg" style={{ background: toLight ? BG.dark : BG.light }} />
      <div className="tt-bg tt-bg-to" style={{ background: toLight ? BG.light : BG.dark }} />
      <div className="tt-stage">
        <div className="tt-orbit tt-out">{toLight ? <MoonBody /> : <SunBody />}</div>
        <div className="tt-orbit tt-in">{toLight ? <SunBody /> : <MoonBody />}</div>
      </div>
    </div>
  );
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [direction, setDirection] = useState<Direction | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Documented next-themes mounting pattern (avoids hydration mismatch)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  if (!mounted) {
    return (
      <span
        aria-hidden
        className="flex h-9 w-9 items-center justify-center rounded-full"
      />
    );
  }

  const isDark = theme === "dark";
  const next = isDark ? "light" : "dark";

  const handleToggle = () => {
    if (direction) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTheme(next);
      return;
    }
    setDirection(isDark ? "to-light" : "to-dark");
    timers.current.push(
      setTimeout(() => setTheme(next), SWAP_AT_MS),
      setTimeout(() => setDirection(null), TOTAL_MS + 50),
    );
  };

  return (
    <>
      <button
        type="button"
        onClick={handleToggle}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted"
      >
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      {direction &&
        createPortal(<ThemeTransition direction={direction} />, document.body)}
    </>
  );
}
