import { cn } from "@/lib/utils";

interface TimelineDotProps {
  isActive?: boolean;
  className?: string;
}

export function TimelineDot({ isActive = false, className }: TimelineDotProps) {
  return (
    <div
      className={cn(
        "relative z-10 flex h-4 w-4 items-center justify-center rounded-full border-2",
        isActive
          ? "border-primary bg-primary"
          : "border-border bg-card",
        className,
      )}
    >
      {isActive && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
    </div>
  );
}
