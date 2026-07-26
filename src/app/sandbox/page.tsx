import type { Metadata } from "next";
import Image from "next/image";

/**
 * /sandbox — interne Vorschauflaeche.
 *
 * TEMPORAER. Existiert, damit der Wolt-Storefront-Bestellknopf isoliert
 * angeschaut werden kann, BEVOR er in DeliveryBanner + Footer verdrahtet wird
 * (Work Order 2026-07-25, §4e). Wird umbenannt oder geloescht, sobald Variante
 * A/B entschieden ist — diese Route soll nicht zur Dauereinrichtung werden.
 *
 * `noindex, nofollow` auf der Seite; zusaetzlich in robots.ts disallowed.
 */
export const metadata: Metadata = {
  title: "Sandbox (intern)",
  description: "Interne Vorschau — nicht Teil der oeffentlichen Website.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/sandbox" },
};

/**
 * TODO(4a): Wandert nach `SITE.delivery` mit `channel: "own"`, sobald das
 * Datenmodell umgebaut ist. Hier bewusst hartkodiert — so kann die Vorschau
 * den Live-Banner und den Footer nicht veraendern.
 *
 * `/de/`-Variante, nicht `/en/`: Wolts Mail, PDF und QR-Code tragen alle die
 * englische Fassung. Ziel per curl -I mit 200 verifiziert (2026-07-25).
 */
const STOREFRONT_URL =
  "https://order.site/goldoni/de/deu/stuttgart/restaurant/ristorante-goldoni-sf";

export default function SandboxPage() {
  return (
    <main
      className="flex min-h-[70vh] items-center justify-center px-6 py-24"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/*
        Kein `aria-label` — und das ist Absicht, im Unterschied zur Wolt-Kachel
        in DeliveryBanner.tsx. Dort ist der sichtbare Text nur das Fragment
        "Bestellen mit", also muss der zugaengliche Name per aria-label kommen.
        Hier ist der sichtbare Text vollstaendig ("Jetzt bestellen" +
        "bestellt ueber Wolt"), der zugaengliche Name entsteht daraus direkt,
        und WCAG 2.5.3 Label-in-Name ist trivial erfuellt. Kein aria-label
        nachruesten — das wuerde die Regel erst brechen.
      */}
      <a
        href={STOREFRONT_URL}
        target="_blank"
        // `noopener` WITHOUT `noreferrer` — the pair is a copy-paste habit, but
        // they do two different jobs and we only want one of them.
        //
        // `noopener` is the security half: it severs `window.opener`, so the
        // opened tab cannot reach back and redirect this page (tabnabbing).
        // Non-negotiable, stays.
        //
        // `noreferrer` would additionally strip the Referer header — and that
        // is the one thing this link must NOT do. The entire economic case for
        // the Storefront is "these are OUR visitors, so the commission is 3,5 %
        // instead of ~30 %". Without a referrer the order arrives at Wolt as
        // direct traffic and the website can never be credited for it. That
        // number is not reconstructable after the fact.
        //
        // Privacy is already handled one level up: the site-wide
        // `Referrer-Policy: strict-origin-when-cross-origin` (next.config.ts)
        // sends only the origin `https://ristorante-goldoni.de`, never the path.
        // Attribution without leaking which page the guest came from.
        rel="noopener"
        className="inline-flex items-center gap-4 rounded-xl px-7 py-4 shadow-sm transition-transform hover:scale-[1.02] focus-visible:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-4"
        style={{
          backgroundColor: "var(--color-accent)",
          outlineColor: "var(--color-accent)",
        }}
      >
        {/*
          Die Wolt-Marke behaelt ihre eigene Brand-Portal-Scheibe in Wolt-Cyan
          — die Marke sitzt also nie direkt auf Goldoni-Salmon. Damit ist die
          offene Brand-Portal-Frage aus §5.4 des Work Orders hier nicht
          beruehrt, sondern umgangen.

          alt="" mit Absicht: siehe Hinweis oben. Ein nicht-leerer alt wuerde
          "Wolt" in den sichtbaren Textinhalt des Links injizieren.
        */}
        <Image
          src="/images/wolt-logo.png"
          alt=""
          width={96}
          height={96}
          className="block h-11 w-11 flex-shrink-0 rounded-full sm:h-12 sm:w-12"
        />
        <span className="flex flex-col text-left">
          <span
            className="text-lg font-semibold leading-tight sm:text-xl"
            style={{ color: "var(--color-on-marinara)" }}
          >
            Jetzt bestellen
          </span>
          {/* Mozzarella auf Salmon = 5,1:1, Parmigiano auf Salmon = 4,6:1 —
              beide ueber der AA-Schwelle von 4,5:1 fuer Fliesstext. */}
          <span
            className="mt-0.5 text-xs font-medium uppercase tracking-wide sm:text-sm"
            style={{ color: "var(--color-on-marinara-muted)" }}
          >
            bestellt über Wolt
          </span>
        </span>
      </a>
    </main>
  );
}
