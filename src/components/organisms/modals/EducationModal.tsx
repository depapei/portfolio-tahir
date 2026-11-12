"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useModalStore } from "@/store/modal-store";
import { formatDate } from "@/lib/utils/helpers";
import { GraduationCap, Calendar, CheckCircle, Star } from "lucide-react";
import type { Education } from "@/types";

export function EducationModal() {
  const { isOpen, data, closeModal } = useModalStore();

  if (!isOpen || !data || !("institution" in data)) return null;
  const item = data as Education;

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
            <GraduationCap size={20} className="text-primary" />
            <DialogTitle className="text-xl text-foreground">
              {item.institution}
            </DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground">
            {item.degree} in {item.field}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 text-sm text-[var(--ink-faint)]">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {formatDate(item.startDate)} — {formatDate(item.endDate)}
          </span>
          {item.gpa && (
            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              GPA: {item.gpa}
            </span>
          )}
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>

        {item.achievements.length > 0 && (
          <>
            <Separator className="bg-border" />
            <div>
              <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
                <Star size={14} className="text-primary" />
                Achievements
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
