import Link from "next/link";
import { SITE } from "@/lib/site";
import { NavLinks } from "@/components/NavLinks";
import { PhoneIcon } from "@/components/PhoneIcon";
import { SpotifyLink } from "@/components/SpotifyLink";
import { ThemeToggle } from "@/components/ThemeToggle";

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

        {/* Desktop nav — active link wears its brand colour as a pill. */}
        <NavLinks
          className="hidden items-center gap-2 md:flex"
          linkClassName="px-3 py-1.5 text-sm"
        />

        {/* Right cluster — order: Reservieren | Spotify | ThemeToggle (far right) */}
        <div className="flex items-center gap-2">
          {/* Mobile: phone-CTA (compact). Desktop: Reservieren-CTA. */}
          <a
            href={`tel:${SITE.phone}`}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium md:hidden"
            style={{
              backgroundColor: "var(--color-accent)",
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

          {/* Hausplaylist — monochrome by default, lights up Spotify-green on hover */}
          <SpotifyLink variant="icon" />

          {/* ThemeToggle — always at the absolute far right */}
          <ThemeToggle />
        </div>
      </nav>

      {/* Mobile sub-nav — same brand-pill logic, smaller pills.
          overflow-x-auto + hidden scrollbar = silent scroll fallback
          if labels grow past the viewport width on small phones
          (iPhone SE 375px etc.). On wider mobile (≥ 414px) all four
          pills currently fit in one row centered. */}
      <div
        className="border-t px-4 py-2 md:hidden"
        style={{ borderColor: "var(--color-noir-border)" }}
      >
        <NavLinks
          className="flex justify-center gap-2 overflow-x-auto text-sm [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          linkClassName="inline-block px-2.5 py-1"
        />
      </div>
    </header>
  );
}
