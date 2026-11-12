"use client";

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEducations } from "@/hooks/use-data";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { EducationCard } from "@/components/molecules/EducationCard";
import { LoadingSection } from "@/components/atoms/LoadingText";
import { useIsMobile } from "@/hooks/use-mobile";

export function EducationSection() {
  const { data: educations, isLoading } = useEducations();
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

  if (isLoading || !educations) {
    return <LoadingSection id="education" />;
  }

  return (
    <section id="education" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader
            eyebrow="Academic Background"
            title="Education"
            subtitle="My academic background and qualifications."
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
                {educations.map((item) => (
                  <div key={item.id} className="embla__slide">
                    <EducationCard item={item} />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={() => emblaApi?.scrollPrev()}
                disabled={!canScrollPrev}
                aria-label="Previous education"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:bg-muted active:scale-90 disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => emblaApi?.scrollNext()}
                disabled={!canScrollNext}
                aria-label="Next education"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:bg-muted active:scale-90 disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="grid gap-4 sm:grid-cols-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {educations.map((item) => (
              <EducationCard key={item.id} item={item} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
