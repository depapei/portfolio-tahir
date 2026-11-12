"use client";

import { SkillBadge } from "@/components/atoms/SkillBadge";
import { SectionHeader } from "@/components/molecules/SectionHeader";
import { LoadingText } from "@/components/atoms/LoadingText";
import { useSkills } from "@/hooks/use-data";
import { useIsMobile } from "@/hooks/use-mobile";
import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Code, Heart } from "lucide-react";
import { useEffect, useState } from "react";

export function SkillsSection() {
  const { data: skills, isLoading } = useSkills();
  const isMobile = useIsMobile();
  const [hardRef, hardApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  });
  const [softRef, softApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    containScroll: "trimSnaps",
  });

  const hardSkills = skills?.filter((s) => s.category === "hard") ?? [];
  const softSkills = skills?.filter((s) => s.category === "soft") ?? [];

  const [showAllSkills, setShowAllSkills] = useState(false);

  const displayedSkills = showAllSkills ? hardSkills : hardSkills.slice(0, 5);

  return (
    <section id="skills" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader
            eyebrow="What I Bring"
            title="Skills"
            subtitle="Technologies and competencies I bring to every project."
          />
        </motion.div>

        {isLoading ? (
          <LoadingText />
        ) : (
          <div className="space-y-12">
            {/* Hard Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="mb-5 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-[12px] bg-[var(--sticker-sky)]/25">
                  <Code size={18} className="text-[var(--notion-blue)]" />
                </span>
                <h3 className="text-xl font-semibold tracking-[-0.25px] text-foreground">
                  Hard Skills
                </h3>
              </div>
              {isMobile ? (
                <CarouselWrapper emblaRef={hardRef} emblaApi={hardApi}>
                  {hardSkills.map((skill) => (
                    <div key={skill.id} className="embla__slide">
                      <SkillBadge skill={skill} />
                    </div>
                  ))}
                </CarouselWrapper>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    <AnimatePresence>
                      {displayedSkills.map((skill) => (
                        <motion.div
                          key={skill.id}
                          layout
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -12 }}
                          transition={{ duration: 0.2 }}
                        >
                          <SkillBadge skill={skill} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {hardSkills.length > 5 && (
                    <button
                      type="button"
                      onClick={() => setShowAllSkills((prev) => !prev)}
                      className="mt-4 text-sm font-medium text-[var(--notion-blue)] hover:underline hover:cursor-pointer"
                    >
                      {showAllSkills
                        ? "See Less"
                        : `See More (+${hardSkills.length - 5})`}
                    </button>
                  )}
                </>
              )}
            </motion.div>

            {/* Soft Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="mb-5 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-[12px] bg-[var(--sticker-pink)]/15">
                  <Heart size={18} className="text-[var(--sticker-pink)]" />
                </span>
                <h3 className="text-xl font-semibold tracking-[-0.25px] text-foreground">
                  Soft Skills
                </h3>
              </div>
              {isMobile ? (
                <CarouselWrapper emblaRef={softRef} emblaApi={softApi}>
                  {softSkills.map((skill) => (
                    <div key={skill.id} className="embla__slide">
                      <SkillBadge skill={skill} />
                    </div>
                  ))}
                </CarouselWrapper>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {softSkills.map((skill) => (
                    <SkillBadge key={skill.id} skill={skill} />
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}

function CarouselWrapper({
  children,
  emblaRef,
  emblaApi,
}: {
  children: React.ReactNode;
  emblaRef: (node: HTMLElement | null) => void;
  emblaApi: ReturnType<typeof useEmblaCarousel>[1];
}) {
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

  return (
    <>
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">{children}</div>
      </div>
      <div className="mt-4 flex items-center justify-center gap-2">
        <button
          onClick={() => emblaApi?.scrollPrev()}
          disabled={!canScrollPrev}
          aria-label="Previous skills"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:bg-muted active:scale-90 disabled:opacity-30"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => emblaApi?.scrollNext()}
          disabled={!canScrollNext}
          aria-label="Next skills"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-foreground transition-all hover:bg-muted active:scale-90 disabled:opacity-30"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </>
  );
}
