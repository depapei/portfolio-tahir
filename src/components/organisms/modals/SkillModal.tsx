"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { TechBadge } from "@/components/atoms/TechBadge";
import { useModalStore } from "@/store/modal-store";
import { Code, Heart } from "lucide-react";
import type { Skill } from "@/types";

export function SkillModal() {
  const { isOpen, data, closeModal } = useModalStore();

  if (!isOpen || !data || !("level" in data)) return null;
  const item = data as Skill;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) closeModal();
      }}
    >
      <DialogContent className="max-h-[85vh] overflow-y-auto border-border bg-card text-foreground sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {item.category === "hard" ? (
              <Code size={20} className="text-primary" />
            ) : (
              <Heart size={20} className="text-primary" />
            )}
            <DialogTitle className="text-xl text-foreground">
              {item.name}
            </DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground">
            {item.category === "hard" ? "Hard Skill" : "Soft Skill"}
            {item.years ? ` · ${item.years} years experience` : ""}
          </DialogDescription>
        </DialogHeader>

        {/* Level */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              Proficiency Level
            </span>
            <span className="text-sm font-bold text-primary">
              {item.level}%
            </span>
          </div>
          <Progress
            value={item.level}
            className="h-2 bg-muted [&>div]:bg-primary"
          />
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>
      </DialogContent>
    </Dialog>
  );
}
