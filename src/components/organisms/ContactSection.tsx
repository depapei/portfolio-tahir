"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { useProfile } from "@/hooks/use-data";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { ContactForm } from "@/components/molecules/ContactForm";
import { LoadingSection } from "@/components/atoms/LoadingText";
import { iconMap, socialLinks } from "./HeroSection";
import Link from "next/link";

export function ContactSection() {
  const { data: profile, isLoading } = useProfile();

  if (isLoading || !profile) {
    return <LoadingSection id="contact" />;
  }

  const contactItems = [
    {
      icon: Mail,
      label: "Email",
      value: profile.email,
      href: `mailto:${profile.email}`,
    },
    {
      icon: Phone,
      label: "Phone",
      value: profile.phone,
      href: `tel:${profile.phone}`,
    },
    { icon: MapPin, label: "Location", value: profile.location },
  ];

  return (
    <section id="contact" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader
            eyebrow="Let's Talk"
            title="Get In Touch"
            subtitle="Open to opportunities in data and business analysis."
          />
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact info */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="space-y-6">
              {contactItems.map((item, idx) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div
                    className={
                      idx === 0
                        ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[var(--sticker-sky)]/25"
                        : idx === 1
                          ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[var(--sticker-teal)]/15"
                          : "flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[var(--sticker-purple)]/30"
                    }
                  >
                    <item.icon
                      size={20}
                      className={
                        idx === 0
                          ? "text-[var(--notion-blue)]"
                          : idx === 1
                            ? "text-[var(--sticker-teal)]"
                            : "text-[var(--sticker-purple-deep)] dark:text-[var(--sticker-purple)]"
                      }
                    />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold tracking-[0.125px] text-[var(--ink-faint)] uppercase">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-sm text-foreground transition-colors hover:text-primary"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm text-foreground">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <p className="mb-4 text-[12px] font-semibold tracking-[0.125px] text-[var(--ink-faint)] uppercase">
                Social
              </p>
              <div className="flex gap-2">
                {socialLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    aria-label={link.name}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:bg-muted active:scale-90"
                  >
                    {iconMap[link.icon]}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
