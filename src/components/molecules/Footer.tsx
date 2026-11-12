import { socialLinks } from "@/components/organisms/HeroSection";

const footerNav = [
  { label: "About", href: "#about" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Hobbies", href: "#hobbies" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t-2 border-border bg-[var(--canvas-soft)] pb-28 md:pb-0">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-16 px-6 pt-20 pb-12 lg:flex-row">
        <div className="max-w-md">
          <p className="mb-4 text-2xl font-black tracking-tight text-foreground uppercase sm:text-3xl md:text-4xl">
            Data. Insight. Integrity.
          </p>
          <p className="text-base leading-relaxed font-medium text-muted-foreground">
            Turning structured data into accurate insights that support
            business decision-making.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-12 sm:gap-20">
          <div>
            <p className="mb-4 text-xs font-bold tracking-widest text-muted-foreground uppercase">
              Navigate
            </p>
            <ul className="space-y-2">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm font-semibold text-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-4 text-xs font-bold tracking-widest text-muted-foreground uppercase">
              Connect
            </p>
            <ul className="space-y-2">
              {socialLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  className="text-sm font-semibold text-foreground transition-colors hover:text-primary"
                >
                  Resume
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="px-2 text-center text-[22vw] leading-[0.8] font-black tracking-tighter text-foreground/10 uppercase select-none"
      >
        Tahir
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-2 border-t-2 border-border px-6 py-6 text-xs font-medium tracking-widest text-muted-foreground uppercase sm:flex-row sm:justify-between">
        <span>&copy; {currentYear} Muhammad Tahir</span>
        <span>Jakarta, Indonesia</span>
      </div>
    </footer>
  );
}
