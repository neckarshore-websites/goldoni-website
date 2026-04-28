import Link from "next/link";
import { SITE } from "@/lib/site";
import { ThemeToggle } from "@/components/ThemeToggle";

const NAV_LINKS = [
  { href: "/", label: "Start", featured: false },
  { href: "/empfehlungen", label: "Empfehlungskarte", featured: true },
  { href: "/menu", label: "Menü", featured: false },
  { href: "/feiern", label: "Feiern", featured: false },
  { href: "/kontakt", label: "Kontakt", featured: false },
] as const;

/** Inline phone icon — same stroke style as ThemeToggle. */
function PhoneIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

/**
 * Site Header — theme-fixed noir (espresso/black) in both light and dark.
 *
 * The shell of the site (Header + Footer-top + Footer-copyright) acts as
 * an editorial frame around the page; its colour identity does not flip
 * with the user's theme. Tokens come from globals.css `--color-noir-*`.
 *
 * Mobile: two-row Header (main nav + sub-nav of secondary links).
 * Desktop: single-row Header with full nav inline.
 */
export function Header() {
  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-md"
      style={{
        backgroundColor:
          "color-mix(in oklab, var(--color-noir-bg) 92%, transparent)",
        borderColor: "var(--color-noir-border)",
        color: "var(--color-noir-text)",
      }}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 sm:px-12">
        {/* Logo / Wordmark with Salmon accent dot */}
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl tracking-tight sm:text-2xl"
          aria-label={`${SITE.name} — Startseite`}
        >
          <span
            aria-hidden
            className="inline-block h-2 w-2 rounded-full sm:h-2.5 sm:w-2.5"
            style={{ backgroundColor: "var(--color-accent)" }}
          />
          <span style={{ color: "var(--color-noir-text)" }}>
            {SITE.name.replace("Ristorante ", "")}
          </span>
          <span
            className="hidden text-xs font-normal uppercase tracking-[0.2em] sm:inline"
            style={{
              color: "var(--color-noir-eyebrow)",
              fontFamily: "var(--font-sans)",
            }}
          >
            Ristorante
          </span>
        </Link>

        {/* Desktop nav */}
        <ul
          className="hidden items-center gap-2 md:flex"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {NAV_LINKS.slice(1).map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-full px-3 py-1.5 text-sm transition-colors"
                style={
                  link.featured
                    ? {
                        // Parmigiano pill stays — pops on noir, pops on cream page.
                        color: "var(--color-blanc-text)",
                        backgroundColor: "var(--color-noir-eyebrow)",
                        fontWeight: 500,
                      }
                    : { color: "var(--color-noir-text)" }
                }
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
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium md:hidden"
            style={{
              backgroundColor: "var(--color-accent)",
              // Salmon-on-noir; CTA text reads on the salmon swatch directly.
              color: "var(--color-blanc-bg)",
            }}
            aria-label={`Anrufen: ${SITE.phoneDisplay}`}
          >
            <PhoneIcon />
            <span>Anrufen</span>
          </a>
          <a
            href={`tel:${SITE.phone}`}
            className="hidden md:inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "var(--color-blanc-bg)",
            }}
          >
            <PhoneIcon />
            <span>Reservieren</span>
          </a>
        </div>
      </nav>

      {/* Mobile sub-nav */}
      <ul
        className="flex justify-center gap-2 border-t px-4 py-2 text-sm md:hidden"
        style={{
          borderColor: "var(--color-noir-border)",
          fontFamily: "var(--font-sans)",
        }}
      >
        {NAV_LINKS.slice(1).map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-block rounded-full px-2.5 py-1 transition-colors"
              style={
                link.featured
                  ? {
                      color: "var(--color-blanc-text)",
                      backgroundColor: "var(--color-noir-eyebrow)",
                      fontWeight: 500,
                    }
                  : { color: "var(--color-noir-text)" }
              }
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </header>
  );
}
