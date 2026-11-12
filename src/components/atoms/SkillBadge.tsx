"use client";

import { cn } from "@/lib/utils";
import { useModalStore } from "@/store/modal-store";
import type { Skill } from "@/types";

interface SkillBadgeProps {
  skill: Skill;
  className?: string;
}

export function SkillBadge({ skill, className }: SkillBadgeProps) {
  const openModal = useModalStore((s) => s.openModal);

  return (
    <button
      onClick={() => openModal("skill", skill)}
      className={cn(
        "group relative flex w-full cursor-pointer flex-col items-start gap-2 rounded-3xl border border-border bg-card p-4 transition-all hover:shadow-notion-soft",
        className,
      )}
    >
      <div className="flex w-full items-center justify-between">
        <span className="text-sm font-semibold text-foreground">
          {skill.name}
        </span>
        <span className="text-xs font-medium text-primary">
          {skill.level}%
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${skill.level}%` }}
        />
      </div>
      <span className="text-xs capitalize text-muted-foreground">
        {skill.category === "hard" ? "Hard Skill" : "Soft Skill"}
        {skill.years ? ` · ${skill.years} yrs` : ""}
      </span>
    </button>
  );
}
