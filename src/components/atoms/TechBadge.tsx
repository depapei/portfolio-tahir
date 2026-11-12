import { cn } from "@/lib/utils";

interface TechBadgeProps {
  name: string;
  className?: string;
}

export function TechBadge({ name, className }: TechBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[4px] border border-border bg-card px-2.5 py-1 text-xs font-medium text-[var(--ink-secondary)] dark:text-foreground",
        className,
      )}
    >
      {name}
    </span>
  );
}
