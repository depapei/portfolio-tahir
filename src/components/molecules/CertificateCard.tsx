"use client";

import { Award, Calendar, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useModalStore } from "@/store/modal-store";
import { formatDate } from "@/lib/utils/helpers";
import type { Certificate } from "@/types";

interface CertificateCardProps {
  item: Certificate;
  className?: string;
}

export function CertificateCard({ item, className }: CertificateCardProps) {
  const openModal = useModalStore((s) => s.openModal);

  return (
    <button
      onClick={() => openModal("certificate", item)}
      className={cn(
        "group relative flex flex-col gap-3 rounded-3xl border border-border bg-card p-6 text-left transition-all hover:shadow-notion-soft cursor-pointer",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[var(--sticker-sky)]/25 dark:bg-[var(--sticker-sky)]/15">
          <Award size={20} className="text-[var(--notion-blue)]" />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="line-clamp-2 text-[22px] font-bold tracking-[-0.25px] text-foreground transition-colors group-hover:text-primary">
            {item.title}
          </h3>
          <p className="text-sm text-muted-foreground">{item.issuer}</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-[var(--ink-faint)]">
        <Calendar size={12} />
        <span>{formatDate(item.date)}</span>
        {item.credentialUrl && (
          <>
            <span className="mx-1">·</span>
            <ExternalLink size={12} />
            <span>View Credential</span>
          </>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5 pt-1">
        {item.skills.slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center rounded-[4px] border border-border bg-card px-2 py-0.5 text-xs text-[var(--ink-secondary)] dark:text-foreground"
          >
            {skill}
          </span>
        ))}
      </div>
    </button>
  );
}
