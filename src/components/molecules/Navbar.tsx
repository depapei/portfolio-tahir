"use client";

import { useEffect, useCallback } from "react";
import {
  Briefcase,
  FolderKanban,
  Heart,
  Mail,
  Sparkles,
  User,
} from "lucide-react";
import { useUIStore } from "@/store/ui-store";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "../atoms/ThemeToggle";

const navLinks = [
  { label: "About", href: "#about", icon: User },
  { label: "Portfolio", href: "#portfolio", icon: FolderKanban },
  { label: "Skills", href: "#skills", icon: Sparkles },
  { label: "Experience", href: "#experience", icon: Briefcase },
  { label: "Hobbies", href: "#hobbies", icon: Heart },
  { label: "Contact", href: "#contact", icon: Mail },
];

const pill =
  "pointer-events-auto rounded-full border border-border bg-card/70 shadow-notion-soft backdrop-blur-xl";

export function Navbar() {
  const { activeSection, setActiveSection } = useUIStore();

  const handleScroll = useCallback(() => {
    const sections = navLinks.map((link) => link.href.substring(1));
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = document.getElementById(sections[i]);
      if (section && section.getBoundingClientRect().top <= 120) {
        setActiveSection(sections[i]);
        return;
      }
    }
    setActiveSection("hero");
  }, [setActiveSection]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleNavClick = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const Logo = (
    <button
      onClick={() => handleNavClick("#hero")}
      className={cn(
        pill,
        "flex h-12 cursor-pointer items-center gap-2 px-2 pr-4 text-foreground",
      )}
      aria-label="Back to top"
    >
      <img src="/icon.svg" alt="" className="h-8 w-8 rounded-full" />
      <span className="text-sm font-black tracking-tight uppercase">
        Muhammad Tahir<span className="text-primary">.</span>
      </span>
    </button>
  );

  return (
    <>
      {/* Desktop: floating pills */}
      <nav className="pointer-events-none fixed inset-x-0 top-4 z-50 mx-auto hidden max-w-7xl items-center justify-between px-6 md:top-6 md:flex">
        {Logo}

        <ul className={cn(pill, "flex h-12 items-center gap-1 px-1.5")}>
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            const Icon = link.icon;
            return (
              <li key={link.href}>
                <button
                  onClick={() => handleNavClick(link.href)}
                  aria-label={link.label}
                  className={cn(
                    "group flex h-9 cursor-pointer items-center rounded-full px-2.5 text-sm font-semibold transition-all",
                    isActive
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon size={18} className="shrink-0" />
                  <span
                    className={cn(
                      "overflow-hidden whitespace-nowrap transition-all duration-300",
                      isActive
                        ? "ml-2 max-w-[120px]"
                        : "max-w-0 group-hover:ml-2 group-hover:max-w-[120px]",
                    )}
                  >
                    {link.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className={cn(pill, "flex h-12 items-center gap-1.5 px-1.5")}>
          <ThemeToggle />
          <button
            onClick={() => handleNavClick("#contact")}
            className="h-9 cursor-pointer rounded-full bg-primary px-4 text-sm font-semibold text-white transition-all hover:bg-[var(--notion-blue-active)] active:scale-95"
          >
            Get in touch
          </button>
        </div>
      </nav>

      {/* Mobile: top bar */}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex items-center justify-between px-4 md:hidden">
        {Logo}
        <div className={cn(pill, "flex h-12 items-center px-1.5")}>
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile: bottom tab bar */}
      <nav
        aria-label="Mobile navigation"
        className="pointer-events-none fixed inset-x-4 bottom-6 z-50 flex justify-center md:hidden"
      >
        <ul className={cn(pill, "flex items-center gap-1 p-1.5")}>
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            const Icon = link.icon;
            return (
              <li key={link.href}>
                <button
                  onClick={() => handleNavClick(link.href)}
                  aria-label={link.label}
                  className={cn(
                    "flex h-11 items-center rounded-full px-3 text-xs font-semibold transition-all",
                    isActive
                      ? "bg-primary text-white"
                      : "text-muted-foreground",
                  )}
                >
                  <Icon size={18} className="shrink-0" />
                  {isActive && <span className="ml-1.5">{link.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
