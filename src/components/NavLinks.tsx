"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Nav links are defined once and rendered into both the desktop and
 * mobile bars. Each entry carries its own active-state colour pair —
 * the active page wears its brand colour like a pill, every other
 * link reads in the noir default. Logo + "/" route are not in this
 * list; the logo is the implicit Start link and shows no pill.
 *
 * Design note: matching pill colours to page identity gives a
 * single visual cue ("you are on the red page = Empfehlungen") that
 * connects nav, page hero, and brand palette in one beat.
 */
type NavLink = {
  href: string;
  label: string;
  /** Active-state CSS variables — bg/fg pulled at render time. */
  activeBg: string;
  activeFg: string;
};

const NAV_LINKS: NavLink[] = [
  {
    href: "/empfehlungen",
    label: "Empfehlungskarte",
    activeBg: "var(--color-bg-marinara)",
    activeFg: "var(--color-on-marinara)",
  },
  {
    href: "/menu",
    label: "Menü",
    activeBg: "var(--color-bg-olive)",
    activeFg: "var(--color-on-olive)",
  },
  {
    href: "/feiern",
    label: "Feiern",
    // Salmon — same hue as the Reservieren CTA, so the celebratory
    // page reads as "the warm one".
    activeBg: "var(--color-accent)",
    activeFg: "var(--color-blanc-bg)",
  },
  {
    href: "/kontakt",
    label: "Kontakt",
    // Parmigiano cream — the only "light" pill in the set, balances
    // the three saturated colours.
    activeBg: "var(--color-bg-parmigiano)",
    activeFg: "var(--color-text)",
  },
];

type Props = {
  /** Outer <ul> classes — different layout on desktop vs mobile bar. */
  className: string;
  /** Per-link sizing classes — desktop is a hair larger than mobile. */
  linkClassName: string;
};

export function NavLinks({ className, linkClassName }: Props) {
  const pathname = usePathname();

  return (
    <ul className={className} style={{ fontFamily: "var(--font-sans)" }}>
      {NAV_LINKS.map((link) => {
        const isActive = pathname === link.href;
        return (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={`rounded-full transition-colors ${linkClassName}`}
              style={
                isActive
                  ? {
                      backgroundColor: link.activeBg,
                      color: link.activeFg,
                      fontWeight: 500,
                    }
                  : { color: "var(--color-noir-text)" }
              }
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
