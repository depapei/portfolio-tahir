"use client";

import { useRef, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePortfolio } from "@/hooks/use-data";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { PortfolioCard } from "@/components/molecules/PortfolioCard";
import { LoadingSection } from "@/components/atoms/LoadingText";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export function PortfolioSection() {
  const { data: portfolio, isLoading } = usePortfolio();
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

  if (isLoading || !portfolio) {
    return <LoadingSection id="portfolio" />;
  }

  const featured = portfolio.filter((p) => p.featured);
  const others = portfolio.filter((p) => !p.featured);

  return (
    <section id="portfolio" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader
            eyebrow="Selected Work"
            title="Portfolio"
            subtitle="A selection of projects I've worked on."
          />
        </motion.div>

        {/* Mobile: Carousel */}
        {isMobile ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="embla" ref={emblaRef}>
              <div className="embla__container">
                {portfolio.filter(Boolean).map((item) => (
                  <div key={item.id} className="embla__slide">
                    <PortfolioCard item={item} isFeatured={item.featured} />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                onClick={() => emblaApi?.scrollPrev()}
                disabled={!canScrollPrev}
                aria-label="Previous projects"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:bg-muted active:scale-90 disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => emblaApi?.scrollNext()}
                disabled={!canScrollNext}
                aria-label="Next projects"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:bg-muted active:scale-90 disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        ) : (
          /* Desktop: Grid with featured */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {featured.length > 0 && (
              <div className="mb-6 grid gap-4 md:grid-cols-3">
                {featured.map((item) => (
                  <PortfolioCard key={item.id} item={item} />
                ))}
              </div>
            )}
            {others.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {others.map((item) => (
                  <PortfolioCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
