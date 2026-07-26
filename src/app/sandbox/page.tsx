import type { Metadata } from "next";
import Image from "next/image";

/**
 * /sandbox — interne Arbeitsfläche.
 *
 * Nicht verlinkt, `noindex, nofollow`, zusätzlich in robots.ts disallowed.
 *
 * Ursprünglich für den A/B-Vergleich des Bestellbanners gebaut (Work Order
 * 2026-07-25 §4e). Diese Aufgabe ist erledigt — Variante A wurde am 2026-07-26
 * gewählt und ist live —, deshalb sind der Vergleich und die zugehörigen
 * Screenshots wieder entfernt. Was bleibt, sind Dinge zum Herunterladen und
 * Weitergeben, die auf der öffentlichen Website nichts zu suchen haben.
 */
export const metadata: Metadata = {
  title: "Sandbox (intern)",
  description: "Interne Arbeitsfläche — nicht Teil der öffentlichen Website.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/sandbox" },
};

export default function SandboxPage() {
  return (
    <main className="py-12" style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="mx-auto mb-12 max-w-6xl px-6 sm:px-12">
        <p
          className="max-w-2xl text-sm leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          Interne Seite, nicht verlinkt und für Suchmaschinen gesperrt. Hier
          liegen Dateien zum Herunterladen und Weitergeben.
        </p>
      </div>

      <section className="mx-auto max-w-6xl px-6 sm:px-12">
        <h2
          className="text-xl font-semibold"
          style={{ color: "var(--color-text)" }}
        >
          QR-Code zum Ausdrucken
        </h2>
        <p
          className="mt-1 max-w-2xl text-sm leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          Führt auf die eigene Bestellseite — für Tischkarten, Flyer oder den
          Aufkleber an der Tür.{" "}
          <strong>Nicht den QR-Code aus Wolts Mail verwenden:</strong> der zeigt
          auf die englische Fassung. Dieser hier wird aus derselben Adresse
          erzeugt, die auch der Bestellknopf benutzt, und ein Test liest ihn vor
          jedem Merge wieder aus — ein gedruckter Code lässt sich nicht
          nachbessern.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-6">
          <a href="/images/storefront-qr.svg" target="_blank" rel="noopener">
            <Image
              src="/images/storefront-qr.png"
              alt="QR-Code, der auf die Bestellseite von Ristorante Goldoni führt."
              width={2000}
              height={2000}
              className="h-40 w-40 rounded-lg border bg-white p-2"
              style={{ borderColor: "var(--color-border)" }}
              loading="lazy"
            />
          </a>
          <ul
            className="space-y-1 text-sm"
            style={{ color: "var(--color-text)" }}
          >
            <li>
              <a
                className="underline"
                href="/images/storefront-qr.svg"
                target="_blank"
                rel="noopener"
              >
                SVG herunterladen
              </a>{" "}
              <span style={{ color: "var(--color-text-muted)" }}>
                — für die Druckerei, beliebig skalierbar
              </span>
            </li>
            <li>
              <a
                className="underline"
                href="/images/storefront-qr.png"
                target="_blank"
                rel="noopener"
              >
                PNG herunterladen
              </a>{" "}
              <span style={{ color: "var(--color-text-muted)" }}>
                — 2000 px, für Word, Canva und Ähnliches
              </span>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
