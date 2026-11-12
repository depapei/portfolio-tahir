import {
  PortfolioItem,
  Skill,
  Experience,
  Education,
  Certificate,
  Hobby,
} from "@/types";

// cn utility is already available via @/lib/utils
export function formatDuration(
  startDate: string,
  endDate: string | "Present",
): string {
  const start = new Date(startDate);
  const end = endDate === "Present" ? new Date() : new Date(endDate);
  const years = end.getFullYear() - start.getFullYear();
  const months = end.getMonth() - start.getMonth();

  if (years === 0) {
    return `${Math.abs(months)} month${Math.abs(months) !== 1 ? "s" : ""}`;
  }
  if (years === 1) {
    return "1 year";
  }
  return `${years} years`;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

export function getFeaturedItem<T extends PortfolioItem>(
  items: T[],
): T | undefined {
  return items.find((item) => "featured" in item && item.featured);
}

export function getTypeGuard(
  type: string,
): (
  data: PortfolioItem | Skill | Experience | Education | Certificate | Hobby,
) => boolean {
  const typeMap: Record<string, string> = {
    portfolio: "thumbnail",
    skill: "level",
    experience: "company",
    education: "institution",
    certificate: "issuer",
    hobby: "images",
  };
  const key = typeMap[type] || "";
  return (data) => key in data;
}

export function generatePlaceholderImage(
  text: string,
  width: number = 800,
  height: number = 600,
): string {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect width='${width}' height='${height}' fill='%23111111'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23B91C1C' font-family='monospace' font-size='18'%3E${encodeURIComponent(text)}%3C/text%3E%3C/svg%3E`;
}
