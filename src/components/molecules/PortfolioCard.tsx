"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { useModalStore } from "@/store/modal-store";
import { TechBadge } from "@/components/atoms/TechBadge";
import type { PortfolioItem } from "@/types";
import { generatePlaceholderImage } from "@/lib/utils/helpers";

interface PortfolioCardProps {
  item: PortfolioItem;
  isFeatured?: boolean;
  className?: string;
}

export function PortfolioCard({
  item,
  isFeatured = false,
  className,
}: PortfolioCardProps) {
  const openModal = useModalStore((s) => s.openModal);
  const [imgSrc, setImgSrc] = useState(
    item.thumbnail || generatePlaceholderImage(item.title),
  );

  return (
    <button
      onClick={() => openModal("portfolio", item)}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card text-left transition-all hover:shadow-notion-soft",
        isFeatured && "md:col-span-2 md:row-span-2",
        className,
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-muted",
          isFeatured ? "aspect-[16/9]" : "aspect-[16/10]",
        )}
      >
        <img
          src={imgSrc}
          alt={item.title}
          onError={() => setImgSrc(generatePlaceholderImage(item.title))}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {item.featured && (
          <span className="absolute top-3 left-3 rounded-full border border-border bg-card px-2 py-1 text-[12px] font-semibold text-primary">
            Featured
          </span>
        )}
        <ExternalLink className="absolute top-3 right-3 h-5 w-5 text-foreground opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <h3 className="text-[22px] font-bold tracking-[-0.25px] text-foreground transition-colors group-hover:text-primary">
          {item.title}
        </h3>
        <p className="line-clamp-2 text-[16px] leading-relaxed text-muted-foreground">
          {item.shortDescription}
        </p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {item.technologies.slice(0, isFeatured ? 6 : 4).map((tech) => (
            <TechBadge key={tech} name={tech} />
          ))}
          {item.technologies.length > (isFeatured ? 6 : 4) && (
            <span className="inline-flex items-center px-2.5 py-1 text-xs text-muted-foreground">
              +{item.technologies.length - (isFeatured ? 6 : 4)}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
