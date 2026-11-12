"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LoadingText } from "./LoadingText";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [switching, setSwitching] = useState(false);
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

  const handleToggle = () => {
    if (switching) return;
    setSwitching(true);
    // Swap the theme while the loading screen covers the page
    timers.current.push(
      setTimeout(() => setTheme(isDark ? "light" : "dark"), 300),
      // 300ms fade-in + 600ms color crossfade + short hold
      setTimeout(() => setSwitching(false), 1100),
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

      {createPortal(
        <AnimatePresence>
          {switching && (
            <motion.div
              key="theme-loader"
              className="fixed inset-0 z-[10000] flex items-center justify-center bg-background transition-colors duration-600 ease-in-out"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <LoadingText className="text-sm text-foreground transition-colors duration-600 ease-in-out" />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
