import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeader({
  title,
  eyebrow,
  subtitle,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-12 flex flex-col justify-between gap-4 border-b-2 border-border pb-6 md:flex-row",
        className,
      )}
    >
      <div>
        {eyebrow && (
          <p className="mb-2 text-sm font-medium text-primary">{eyebrow}</p>
        )}
        <h2 className="text-4xl leading-none font-black tracking-tighter text-foreground uppercase md:text-6xl lg:text-7xl">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="max-w-xs text-sm text-muted-foreground md:mt-auto md:text-right md:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
