"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { TechBadge } from "@/components/atoms/TechBadge";
import { useModalStore } from "@/store/modal-store";
import { formatDate, formatDuration } from "@/lib/utils/helpers";
import { MapPin, Briefcase, CheckCircle, ListChecks } from "lucide-react";
import type { Experience } from "@/types";

export function ExperienceModal() {
  const { isOpen, data, closeModal } = useModalStore();

  if (!isOpen || !data || !("company" in data)) return null;
  const item = data as Experience;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) closeModal();
      }}
    >
      <DialogContent className="max-h-[85vh] overflow-y-auto border-border bg-card text-foreground sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-foreground">
            {item.role}
          </DialogTitle>
          <DialogDescription className="flex flex-wrap items-center gap-3 text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Briefcase size={14} className="text-primary" />
              {item.company}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={14} className="text-primary" />
              {item.location}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 text-sm text-[var(--ink-faint)]">
          <span>
            {formatDate(item.startDate)} — {item.endDate}
          </span>
          <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {formatDuration(item.startDate, item.endDate)}
          </span>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>

        <Separator className="bg-border" />

        {/* Responsibilities */}
        {item.responsibilities.length > 0 && (
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
              <ListChecks size={14} className="text-primary" />
              Responsibilities
            </h4>
            <ul className="space-y-2">
              {item.responsibilities.map((r, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Achievements */}
        {item.achievements.length > 0 && (
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
              <CheckCircle size={14} className="text-green-500" />
              Key Achievements
            </h4>
            <ul className="space-y-2">
              {item.achievements.map((a, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle
                    size={14}
                    className="mt-0.5 shrink-0 text-green-500"
                  />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Technologies */}
        {item.technologies.length > 0 && (
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">
              Technologies
            </h4>
            <div className="flex flex-wrap gap-2">
              {item.technologies.map((tech) => (
                <TechBadge key={tech} name={tech} />
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
