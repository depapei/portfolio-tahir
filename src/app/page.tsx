"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Footer } from "@/components/molecules/Footer";
import { HeroSection } from "@/components/organisms/HeroSection";
import { AboutSection } from "@/components/organisms/AboutSection";
import { PortfolioSection } from "@/components/organisms/PortfolioSection";
import { SkillsSection } from "@/components/organisms/SkillsSection";
import { ExperienceSection } from "@/components/organisms/ExperienceSection";
import { EducationSection } from "@/components/organisms/EducationSection";
import { CertificatesSection } from "@/components/organisms/CertificatesSection";
import { HobbiesSection } from "@/components/organisms/HobbiesSection";
import { ContactSection } from "@/components/organisms/ContactSection";
import { ModalManager } from "@/components/organisms/modals/ModalManager";
import { LoadingText } from "@/components/atoms/LoadingText";
import { useProfile } from "@/hooks/use-data";

export default function HomePage() {
  const { isLoading } = useProfile();

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="preloader"
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-background"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <LoadingText className="text-sm text-foreground" />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <PortfolioSection />
        <SkillsSection />
        <ExperienceSection />
        <EducationSection />
        <CertificatesSection />
        <HobbiesSection />
        <ContactSection />
      </main>
      <Footer />
      <ModalManager />
    </div>
  );
}
