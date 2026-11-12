"use client";

import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Database, Award } from "lucide-react";
import { useProfile } from "@/hooks/use-data";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { LoadingSection } from "@/components/atoms/LoadingText";

const highlights = [
  {
    icon: GraduationCap,
    value: "3.49",
    label: "GPA, Information Systems",
    tile: "bg-[var(--sticker-sky)]/25",
    iconColor: "text-[var(--notion-blue)]",
  },
  {
    icon: Briefcase,
    value: "03",
    label: "Professional Experiences",
    tile: "bg-[var(--sticker-purple)]/30",
    iconColor:
      "text-[var(--sticker-purple-deep)] dark:text-[var(--sticker-purple)]",
  },
  {
    icon: Database,
    value: "SQL",
    label: "Banking Transaction Data",
    tile: "bg-[var(--sticker-teal)]/15",
    iconColor: "text-[var(--sticker-teal)]",
  },
  {
    icon: Award,
    value: "04",
    label: "Certificates & 2 Awards",
    tile: "bg-[var(--sticker-pink)]/15",
    iconColor: "text-[var(--sticker-pink)]",
  },
];

export function AboutSection() {
  const { data: profile, isLoading } = useProfile();

  if (isLoading || !profile) {
    return <LoadingSection id="about" />;
  }

  return (
    <section id="about" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader
            eyebrow="Who I Am"
            title="About Me"
            subtitle="A brief overview of who I am and what I do."
          />
        </motion.div>

        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
          {/* About text */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-2xl leading-tight font-bold tracking-tight text-foreground md:text-3xl">
              {profile.tagline}
            </p>
            <p className="text-base leading-relaxed text-[var(--ink-secondary)] md:text-lg dark:text-muted-foreground">
              {profile.about}
            </p>
            <p className="text-base leading-relaxed text-[var(--ink-secondary)] md:text-lg dark:text-muted-foreground">
              {profile.summary}
            </p>
          </motion.div>

          {/* Highlight cards */}
          <motion.div
            className="grid gap-4 sm:grid-cols-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {highlights.map((item, i) => (
              <div
                key={item.label}
                className="relative flex min-h-[180px] flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-6 transition-all hover:shadow-notion-soft"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-2 -bottom-6 text-8xl leading-none font-black tracking-tighter text-foreground/5 select-none"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.tile}`}
                >
                  <item.icon size={22} className={item.iconColor} />
                </span>
                <div className="relative">
                  <p className="text-3xl font-black tracking-tighter text-foreground uppercase">
                    {item.value}
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
