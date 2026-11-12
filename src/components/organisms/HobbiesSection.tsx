"use client";

import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";
import { useHobbies } from "@/hooks/use-data";
import { useModalStore } from "@/store/modal-store";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { LoadingSection } from "@/components/atoms/LoadingText";
import { generatePlaceholderImage } from "@/lib/utils/helpers";
import type { Hobby } from "@/types";

export function getHobbyImages(hobby: Hobby): string[] {
  return hobby.images.length > 0
    ? hobby.images
    : [generatePlaceholderImage(hobby.title, 800, 800)];
}

export function HobbiesSection() {
  const { data: hobbies, isLoading } = useHobbies();
  const { openModal } = useModalStore();
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
    emblaApi.on("reInit", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  if (isLoading || !hobbies) {
    return <LoadingSection id="hobbies" />;
  }

  if (hobbies.length === 0) return null;

  return (
    <section id="hobbies" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader
            eyebrow="Beyond Work"
            title="Hobbies"
            subtitle="What keeps me curious and recharged outside of work."
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="embla" ref={emblaRef}>
            <div className="embla__container">
              {hobbies.map((hobby) => (
                <div key={hobby.id} className="embla__slide">
                  <HobbyCard
                    hobby={hobby}
                    onOpen={() => openModal("hobby", hobby)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canScrollPrev}
              aria-label="Previous hobbies"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:bg-muted active:scale-90 disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canScrollNext}
              aria-label="Next hobbies"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:bg-muted active:scale-90 disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function HobbyCard({ hobby, onOpen }: { hobby: Hobby; onOpen: () => void }) {
  const images = getHobbyImages(hobby);

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`${hobby.title}: lihat detail`}
      className="group relative aspect-square w-full cursor-pointer overflow-hidden rounded-3xl border border-border bg-card text-left focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
    >
      <img
        src={images[0]}
        alt={hobby.title}
        loading="lazy"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 md:group-hover:scale-105"
      />

      {images.length > 1 && (
        <span className="absolute top-4 right-4 z-20 inline-flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
          <Images size={12} />
          {images.length}
        </span>
      )}

      {/* Front layer: always visible on mobile, revealed on hover from md up */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/50 to-black/10 p-6 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
        <h3 className="text-2xl font-black tracking-tight text-white uppercase transition-transform duration-300 md:translate-y-3 md:group-hover:translate-y-0">
          {hobby.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/80 transition-transform delay-75 duration-300 md:translate-y-3 md:group-hover:translate-y-0">
          {hobby.description}
        </p>
      </div>
    </button>
  );
}
