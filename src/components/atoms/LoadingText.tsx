import { cn } from "@/lib/utils";

export function LoadingText({ className }: { className?: string }) {
  return (
    <p
      role="status"
      aria-live="polite"
      className={cn(
        "text-xs font-bold tracking-widest text-muted-foreground uppercase",
        "animate-pulse",
        className,
      )}
    >
      Sedang memuat...
    </p>
  );
}

export function LoadingSection({ id }: { id: string }) {
  return (
    <section id={id} className="py-24">
      <div className="mx-auto flex max-w-7xl justify-center px-6">
        <LoadingText />
      </div>
    </section>
  );
}
