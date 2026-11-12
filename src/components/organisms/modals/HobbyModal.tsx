"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useModalStore } from "@/store/modal-store";
import { getHobbyImages } from "@/components/organisms/HobbiesSection";
import type { Hobby } from "@/types";

export function HobbyModal() {
  const { isOpen, data, closeModal } = useModalStore();
  const [activeImg, setActiveImg] = useState(0);

  if (!isOpen || !data || !("images" in data)) return null;
  const item = data as Hobby;
  const images = getHobbyImages(item);
  const hasMany = images.length > 1;

  const handleClose = () => {
    setActiveImg(0);
    closeModal();
  };

  const go = (dir: number) =>
    setActiveImg((i) => (i + dir + images.length) % images.length);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) handleClose();
      }}
    >
      <DialogContent className="max-h-[85vh] overflow-y-auto border-border bg-card text-foreground sm:max-w-2xl lg:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black tracking-tight text-foreground uppercase">
            {item.title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Detail hobi {item.title}
          </DialogDescription>
        </DialogHeader>

        {/* Gallery */}
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-muted">
            <img
              src={images[activeImg]}
              alt={`${item.title} ${activeImg + 1}`}
              className="max-h-[55vh] w-full object-contain"
            />
            {hasMany && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Gambar sebelumnya"
                  className="absolute top-1/2 left-3 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-black/70"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Gambar berikutnya"
                  className="absolute top-1/2 right-3 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-black/70"
                >
                  <ChevronRight size={18} />
                </button>
                <span className="absolute right-3 bottom-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md">
                  {activeImg + 1} / {images.length}
                </span>
              </>
            )}
          </div>

          {hasMany && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImg(idx)}
                  aria-label={`Lihat gambar ${idx + 1}`}
                  className={`shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 ${
                    idx === activeImg ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="h-16 w-16 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="text-base leading-relaxed text-muted-foreground">
          {item.description}
        </p>
      </DialogContent>
    </Dialog>
  );
}
