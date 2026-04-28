import Link from "next/link";
import { SITE } from "@/lib/site";
import { ThemeToggle } from "@/components/ThemeToggle";

const NAV_LINKS = [
  { href: "/", label: "Start" },
  { href: "/menu", label: "Menue" },
  { href: "/empfehlungen", label: "Empfehlungen" },
  { href: "/feiern", label: "Feiern" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

export function Header() {
  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-md"
      style={{
        backgroundColor: "color-mix(in oklab, var(--color-bg) 90%, transparent)",
        borderColor: "var(--color-border)",
      }}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-12">
        {/* Logo / Wordmark */}
        <Link
          href="/"
          className="font-display text-xl tracking-tight sm:text-2xl"
          style={{ color: "var(--color-text)" }}
          aria-label={`${SITE.name} — Startseite`}
        >
          {SITE.name.replace("Ristorante ", "")}
          <span
            className="ml-2 hidden text-xs font-normal uppercase tracking-[0.2em] sm:inline"
            style={{ color: "var(--color-brand-olive)", fontFamily: "var(--font-sans)" }}
          >
            Ristorante
          </span>
        </Link>

        {/* Desktop nav */}
        <ul
          className="hidden gap-8 md:flex"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {NAV_LINKS.slice(1).map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm transition-colors hover:opacity-80"
                style={{ color: "var(--color-text)" }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right cluster */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Mobile: phone-CTA (compact). Desktop: Reservieren-CTA. */}
          <a
            href={`tel:${SITE.phone}`}
            className="md:hidden rounded-md px-3 py-2 text-sm font-medium"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "var(--color-bg)",
            }}
            aria-label={`Anrufen: ${SITE.phoneDisplay}`}
          >
            Anrufen
          </a>
          <a
            href={`tel:${SITE.phone}`}
            className="hidden md:inline-block rounded-md px-4 py-2 text-sm font-medium transition-colors"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "var(--color-bg)",
            }}
          >
            Reservieren
          </a>
        </div>
      </nav>

      {/* Mobile sub-nav */}
      <ul
        className="flex justify-center gap-6 border-t px-6 py-3 text-sm md:hidden"
        style={{
          borderColor: "var(--color-border)",
          fontFamily: "var(--font-sans)",
        }}
      >
        {NAV_LINKS.slice(1).map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="transition-colors hover:opacity-80"
              style={{ color: "var(--color-text)" }}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </header>
  );
}
