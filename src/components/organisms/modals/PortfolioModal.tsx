"use client";

import { useState } from "react";
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
import { generatePlaceholderImage } from "@/lib/utils/helpers";
import {
  ExternalLink,
  Github,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import type { PortfolioItem } from "@/types";

export function PortfolioModal() {
  const { isOpen, data, closeModal } = useModalStore();
  const [activeImg, setActiveImg] = useState(0);

  if (!isOpen || !data || !("thumbnail" in data)) return null;
  const item = data as PortfolioItem;
  const images =
    item.gallery?.length > 0
      ? item.gallery
      : [item.thumbnail || generatePlaceholderImage(item.title)];

  const handleClose = () => {
    setActiveImg(0);
    closeModal();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) handleClose();
      }}
    >
      <DialogContent className="max-h-[85vh] overflow-y-auto border-border bg-card text-foreground sm:max-w-2xl lg:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-foreground">
            {item.title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {item.shortDescription}
          </DialogDescription>
        </DialogHeader>

        {/* Gallery */}
        <div className="space-y-3">
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <img
              src={images[activeImg] || generatePlaceholderImage(item.title)}
              alt={item.title}
              className="h-auto w-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImg(idx)}
                  className={`shrink-0 overflow-hidden rounded-md border ${
                    idx === activeImg ? "border-primary" : "border-border"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Gallery ${idx + 1}`}
                    className="h-16 w-24 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>

        <Separator className="bg-border" />

        {/* Responsibilities */}
        {item.responsibilities.length > 0 && (
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
              <AlertTriangle size={14} className="text-primary" />
              Responsibilities
            </h4>
            <ul className="space-y-2">
              {item.responsibilities.map((r, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Challenges */}
        {item.challenges.length > 0 && (
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
              <AlertTriangle size={14} className="text-primary" />
              Challenges
            </h4>
            <ul className="space-y-2">
              {item.challenges.map((c, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--ink-faint)]" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Results */}
        {item.results.length > 0 && (
          <div>
            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
              <TrendingUp size={14} className="text-primary" />
              Results
            </h4>
            <ul className="space-y-2">
              {item.results.map((r, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle
                    size={14}
                    className="mt-0.5 shrink-0 text-green-500"
                  />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Technologies */}
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

        {/* Links */}
        <div className="flex flex-wrap gap-3 pt-2">
          {item.liveUrl && (
            <a
              href={item.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <ExternalLink size={14} />
              Live Demo
            </a>
          )}
          {item.repoUrl && (
            <a
              href={item.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <Github size={14} />
              Source Code
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
