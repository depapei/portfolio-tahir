"use client";

import { MapPin, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { useModalStore } from "@/store/modal-store";
import { formatDate, formatDuration } from "@/lib/utils/helpers";
import type { Experience } from "@/types";

interface ExperienceCardProps {
  item: Experience;
  className?: string;
}

export function ExperienceCard({ item, className }: ExperienceCardProps) {
  const openModal = useModalStore((s) => s.openModal);

  return (
    <button
      onClick={() => openModal("experience", item)}
      className={cn(
        "group relative flex flex-col gap-3 rounded-3xl border border-border bg-card p-6 text-left transition-all hover:shadow-notion-soft",
        "cursor-pointer",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <h3 className="text-[22px] font-bold tracking-[-0.25px] text-foreground transition-colors group-hover:text-primary">
            {item.role}
          </h3>
          <div className="flex items-center gap-1.5 text-sm text-primary">
            <Briefcase size={14} />
            <span>{item.company}</span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs font-medium text-muted-foreground">
            {formatDate(item.startDate)} —{" "}
            {item.endDate !== "Present"
              ? formatDate(item.endDate)
              : item.endDate}
          </p>
          <p className="text-xs text-[var(--ink-faint)]">
            {formatDuration(item.startDate, item.endDate)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-[var(--ink-faint)]">
        <MapPin size={12} />
        <span>{item.location}</span>
      </div>
      <p className="line-clamp-3 text-[16px] leading-relaxed text-muted-foreground">{item.description}</p>
      <div className="flex flex-wrap gap-1.5 pt-1">
        {item.technologies.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="inline-flex items-center rounded-[4px] border border-border bg-card px-2 py-0.5 text-xs text-[var(--ink-secondary)] dark:text-foreground"
          >
            {tech}
          </span>
        ))}
      </div>
    </button>
  );
}
