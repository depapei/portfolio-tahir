"use client";

import { LoadingText } from "@/components/atoms/LoadingText";
import { useExperiences, useProfile, useSkills } from "@/hooks/use-data";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Github,
  Instagram,
  Linkedin,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";

interface SocialLink {
  name: string;
  url: string;
  icon: "github" | "linkedin" | "instagram" | "whatsapp";
}

export const WHATSAPP_NUMBER = "6281316672504";

const LINK = {
  whatsapp: `https://wa.me/${WHATSAPP_NUMBER}`,
  linkedin: `https://www.linkedin.com/in/muhammad-tahir-a41139245`,
};

export const socialLinks: SocialLink[] = [
  { name: "LinkedIn", url: LINK.linkedin, icon: "linkedin" },
  { name: "WhatsApp", url: LINK.whatsapp, icon: "whatsapp" },
];

export const iconMap: Record<string, React.ReactNode> = {
  github: <Github size={22} />,
  linkedin: <Linkedin size={22} />,
  instagram: <Instagram size={22} />,
  whatsapp: <MessageCircle size={22} />,
};

const pillClass =
  "rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wider text-white uppercase backdrop-blur-md sm:px-5 sm:py-2 sm:text-sm";

export function HeroSection() {
  const { data: profile, isLoading } = useProfile();
  const { data: experiences } = useExperiences();

  if (isLoading || !profile) {
    return (
      <section
        id="hero"
        className="flex h-[100svh] items-center justify-center bg-[var(--hero-band)]"
      >
        <LoadingText className="text-white/70" />
      </section>
    );
  }

  const [firstName, ...rest] = profile.name.toUpperCase().split(" ");
  const lastName = rest.join(" ");
  const [roleTop, roleBottom] = profile.role.toUpperCase().split(" & ");
  const year = new Date().getFullYear();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <section
        id="hero"
        className="relative flex h-[100svh] min-h-[640px] w-full items-center justify-center overflow-hidden bg-[var(--hero-band)] text-white"
      >
        {/* Square behind the portrait */}
        {/* <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="aspect-square w-[280px] bg-primary sm:w-[400px] md:w-[480px] lg:w-[560px]"
          />
        </div> */}

        {/* Portrait + oversized name */}
        <div className="relative z-10 flex w-full flex-col items-center px-2 md:px-14">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            className="relative z-10 h-[40vh] sm:h-[48vh] lg:h-[56vh]"
          >
            <img
              src={profile.avatar}
              alt={profile.name}
              className="h-full w-auto object-contain drop-shadow-[0_12px_32px_rgba(0,0,0,0.35)]"
              fetchPriority="high"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
            className="relative z-20 -mt-[6vw] w-full text-center text-[14vw] leading-[0.85] font-black tracking-tighter text-white uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)] select-none md:-mt-[3.5vw] md:text-[9vw]"
          >
            <span className="block md:inline">{firstName}</span>{" "}
            <span className="block md:inline">{lastName}</span>
          </motion.h1>
        </div>

        {/* Corner details */}
        <div className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-between p-5 pt-24 sm:p-8 sm:pt-28 md:p-12 md:pt-32">
          <div className="flex w-full items-start justify-between">
            <p className="max-w-[160px] text-left text-xs leading-snug font-medium tracking-widest text-white/90 uppercase sm:max-w-[240px] sm:text-sm md:text-base">
              {roleTop}
              {roleBottom && (
                <>
                  <br />& {roleBottom}
                </>
              )}
            </p>
            <p className="text-base font-bold tracking-widest text-[var(--sticker-sky)] sm:text-xl md:text-3xl">
              {year}
            </p>
          </div>

          <div className="mb-24 flex w-full flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-0">
            <div className="pointer-events-auto flex flex-wrap gap-2 sm:gap-3">
              <span className={pillClass}>GPA 3.49</span>
              {experiences && (
                <span className={pillClass}>
                  {experiences.length} Experiences
                </span>
              )}
              <button
                type="button"
                onClick={() => window.open("/resume.pdf", "_blank")}
                className={`${pillClass} inline-flex cursor-pointer items-center gap-1 transition-colors hover:bg-white hover:text-[var(--hero-band)]`}
              >
                Resume <ArrowUpRight size={14} />
              </button>
              <button
                type="button"
                onClick={() => scrollTo("contact")}
                className={`${pillClass} inline-flex cursor-pointer items-center gap-1 border-transparent bg-primary transition-colors hover:bg-white hover:text-[var(--hero-band)]`}
              >
                Contact <ArrowUpRight size={14} />
              </button>
            </div>

            <div className="hidden flex-col items-end gap-3 sm:flex">
              <p className="max-w-[300px] text-right text-sm leading-tight font-medium text-white/90 md:text-base">
                {profile.tagline}
              </p>
              <div className="pointer-events-auto flex gap-2">
                {socialLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    aria-label={link.name}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white hover:text-[var(--hero-band)] active:scale-90 [&_svg]:size-4"
                  >
                    {iconMap[link.icon]}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <HeroMarquee />
    </>
  );
}

function HeroMarquee() {
  const { data: skills } = useSkills();
  const items = (skills ?? [])
    .filter((s) => s.category === "hard")
    .map((s) => s.name);

  if (items.length === 0) return null;

  // Duplicate the track so the -50% translate loops seamlessly
  const track = [...items, ...items];

  return (
    <div className="relative z-20 w-full overflow-hidden border-y-2 border-border bg-primary py-4 select-none">
      <div className="animate-marquee flex w-max items-center">
        {track.map((name, i) => (
          <span
            key={`${name}-${i}`}
            aria-hidden={i >= items.length}
            className="flex items-center gap-6 pr-6 text-sm font-bold tracking-widest whitespace-nowrap text-white uppercase md:text-base"
          >
            {name}
            <span className="text-white/50">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
