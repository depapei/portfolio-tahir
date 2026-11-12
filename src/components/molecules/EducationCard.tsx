"use client";

import { GraduationCap, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useModalStore } from "@/store/modal-store";
import { formatDate } from "@/lib/utils/helpers";
import type { Education } from "@/types";

interface EducationCardProps {
  item: Education;
  className?: string;
}

export function EducationCard({ item, className }: EducationCardProps) {
  const openModal = useModalStore((s) => s.openModal);

  return (
    <button
      onClick={() => openModal("education", item)}
      className={cn(
        "group relative flex flex-col gap-3 rounded-3xl border border-border bg-card p-6 text-left transition-all hover:shadow-notion-soft cursor-pointer",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[var(--sticker-purple)]/30 dark:bg-[var(--sticker-purple)]/15">
          <GraduationCap size={20} className="text-[var(--sticker-purple-deep)] dark:text-[var(--sticker-purple)]" />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-[22px] font-bold tracking-[-0.25px] text-foreground transition-colors group-hover:text-primary">
            {item.institution}
          </h3>
          <p className="text-sm text-muted-foreground">
            {item.degree} in {item.field}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-[var(--ink-faint)]">
        <Calendar size={12} />
        <span>
          {formatDate(item.startDate)} — {formatDate(item.endDate)}
        </span>
      </div>
      {item.gpa && (
        <p className="text-sm font-medium text-foreground">GPA: {item.gpa}</p>
      )}
      <p className="line-clamp-3 text-[16px] leading-relaxed text-muted-foreground">{item.description}</p>
    </button>
  );
}
