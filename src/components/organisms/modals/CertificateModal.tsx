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
import { formatDate } from "@/lib/utils/helpers";
import { Award, Calendar, ExternalLink } from "lucide-react";
import type { Certificate } from "@/types";

export function CertificateModal() {
  const { isOpen, data, closeModal } = useModalStore();

  if (!isOpen || !data || !("issuer" in data)) return null;
  const item = data as Certificate;

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
            <Award size={20} className="text-primary" />
            <DialogTitle className="text-xl text-foreground">
              {item.title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground">
            {item.issuer}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 text-sm text-[var(--ink-faint)]">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {formatDate(item.date)}
          </span>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>

        {item.credentialUrl && (
          <a
            href={item.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <ExternalLink size={14} />
            View Credential
          </a>
        )}

        {item.skills.length > 0 && (
          <>
            <Separator className="bg-border" />
            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">
                Skills Covered
              </h4>
              <div className="flex flex-wrap gap-2">
                {item.skills.map((skill) => (
                  <TechBadge key={skill} name={skill} />
                ))}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
