import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

/**
 * 404 — Custom not-found page.
 *
 * App-Router-Konvention: `src/app/not-found.tsx` greift für jede URL,
 * die kein anderer Route-Handler bedient. Next.js setzt automatisch
 * den HTTP-Status auf 404 — wir müssen nichts manuell setzen.
 *
 * Layout-Linie: kein PageHero (braucht eine 404-Seite nicht), aber
 * gleiche Container-/Eyebrow-/H1-/Lead-Konventionen wie /kontakt und
 * /feiern, damit das Brand-Bild geschlossen bleibt. CTAs als
 * Pill-Liste mit klarer Hierarchie: Start zuerst, danach die zwei
 * meistnachgefragten Inhalts-Pfade (Empfehlungen + Speisekarte) und
 * eine Kontakt-Brücke für Notfälle.
 */

export const metadata: Metadata = {
  // robots noindex: 404-Seiten sollen nicht indexiert werden, sonst
  // erscheinen sie potenziell in Suchergebnissen statt nur die echten
  // Inhaltsseiten.
  title: "Seite nicht gefunden — Ristorante Goldoni",
  description:
    "Diese Seite haben wir nicht — vielleicht wurde sie verschoben oder gibt es nicht mehr. Hier geht's zurück zur Speisekarte, zu unseren wöchentlichen Empfehlungen oder direkt zum Kontakt.",
  robots: { index: false, follow: true },
};

interface QuickLink {
  href: string;
  label: string;
  helper: string;
}

const QUICK_LINKS: QuickLink[] = [
  {
    href: "/empfehlungen",
    label: "Empfehlungen der Woche",
    helper: "Was die Küche derzeit besonders empfiehlt",
  },
  {
    href: "/menu",
    label: "Speisekarte",
    helper: "Antipasti, Pasta, Pizze, Carne e Pesce, Dolci",
  },
  {
    href: "/feiern",
    label: "Feiern",
    helper: "Hochzeiten, Geburtstage, Firmenfeiern — wir richten aus",
  },
  {
    href: "/kontakt",
    label: "Kontakt",
    helper: "Schreiben Sie uns, wir antworten zeitnah",
  },
];

export default function NotFound() {
  return (
    <main>
      <div className="px-6 pb-20 pt-20 sm:px-12 sm:pb-24 sm:pt-28">
        <div className="mx-auto max-w-3xl">
          <p
            className="mb-3 text-xs uppercase tracking-[0.2em]"
            style={{ color: "var(--color-brand-olive)" }}
          >
            Mi dispiace
          </p>
          <h1
            className="mb-6 text-4xl sm:text-5xl"
            style={{ color: "var(--color-text)" }}
          >
            Diese Seite haben wir nicht
          </h1>
          <p
            className="mb-10 text-lg leading-relaxed"
            style={{ color: "var(--color-text-muted)" }}
          >
            Vielleicht wurde die Seite verschoben, vielleicht ist der Link
            ein bisschen veraltet &mdash; oder es war einfach ein Tippfehler.
            Egal: hier geht&rsquo;s direkt weiter.
          </p>

          {/* Quick links — 4 wichtigste Ziele als Karten */}
          <ul className="mb-12 grid gap-4 sm:grid-cols-2">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block h-full rounded-lg border p-5 transition-colors hover:border-current"
                  style={{
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-bg-muted)",
                  }}
                >
                  <span
                    className="block text-base font-medium"
                    style={{ color: "var(--color-accent)" }}
                  >
                    {link.label}
                    <span aria-hidden> &rarr;</span>
                  </span>
                  <span
                    className="mt-1 block text-sm"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {link.helper}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Phone fallback for visitors who'd rather speak directly */}
          <div
            className="flex flex-col gap-3 rounded-lg border p-6 sm:flex-row sm:items-center sm:justify-between"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-bg)",
            }}
          >
            <p style={{ color: "var(--color-text-muted)" }}>
              Lieber direkt am Telefon? Auch gerne &mdash; wir sind für Sie
              da.
            </p>
            <a
              href={`tel:${SITE.phone}`}
              className="shrink-0 inline-flex items-center gap-2 whitespace-nowrap rounded-md px-5 py-3 text-base font-medium"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "#FAFAFA",
              }}
              aria-label={`Anrufen: ${SITE.phoneDisplay}`}
            >
              {/* Inline phone icon — same SVG path as Header + /feiern */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>Anrufen</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
