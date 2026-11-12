"use client";

import { TimelineDot } from "@/components/atoms/TimelineDot";
import { ExperienceCard } from "@/components/molecules/ExperienceCard";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { LoadingSection } from "@/components/atoms/LoadingText";
import { useExperiences } from "@/hooks/use-data";
import { useIsMobile } from "@/hooks/use-mobile";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export function ExperienceSection() {
  const { data: experiences, isLoading } = useExperiences();
  const isMobile = useIsMobile();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  if (isLoading || !experiences) {
    return <LoadingSection id="experience" />;
  }

  return (
    <section id="experience" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader
            eyebrow="Career Journey"
            title="Experience"
            subtitle="My professional journey and career highlights."
          />
        </motion.div>

        {isMobile ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="embla" ref={emblaRef}>
              <div className="embla__container">
                {experiences.map((item, idx) => (
                  <div key={item.id} className="embla__slide">
                    <ExperienceCard item={item} />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={() => emblaApi?.scrollPrev()}
                disabled={!canScrollPrev}
                aria-label="Previous experience"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:bg-muted active:scale-90 disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => emblaApi?.scrollNext()}
                disabled={!canScrollNext}
                aria-label="Next experience"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:bg-muted active:scale-90 disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        ) : (
          /* Desktop: Timeline layout */
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Timeline line */}
            <div className="absolute top-0 bottom-0 left-2 hidden w-px bg-border md:block" />
            <div className="space-y-8">
              {experiences.map((item, idx) => (
                <div key={item.id} className="relative hidden md:flex md:gap-6">
                  {/* Dot */}
                  <div className="relative z-10 flex flex-col items-center pt-6">
                    <TimelineDot isActive={idx === 0} />
                  </div>
                  {/* Card */}
                  <div className="flex-1">
                    <ExperienceCard item={item} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
