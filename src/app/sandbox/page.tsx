import type { Metadata } from "next";
import Image from "next/image";
import { DeliveryBanner } from "@/components/DeliveryBanner";
import { SITE, STOREFRONT_PARTNER } from "@/lib/site";

/**
 * /sandbox — interne Vorschauflaeche.
 *
 * TEMPORAER. Zeigt die beiden Layout-Varianten des Bestellbanners nebeneinander,
 * damit Founder und Betreiber hinschauen statt sich etwas vorzustellen
 * (Work Order 2026-07-25, §4e). Wird geloescht, sobald A oder B entschieden ist
 * — diese Route soll nicht zur Dauereinrichtung werden.
 *
 * Beide Varianten rendern die ECHTE `DeliveryBanner`-Komponente mit dem echten
 * Storefront-Eintrag aus site.ts. Keine Kopie, keine Attrappe: was hier
 * abgenommen wird, ist was live geht.
 *
 * `noindex, nofollow` auf der Seite; zusaetzlich in robots.ts disallowed.
 */
export const metadata: Metadata = {
  title: "Sandbox (intern)",
  description: "Interne Vorschau — nicht Teil der öffentlichen Website.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/sandbox" },
};

/**
 * Der Partner-Satz NACH der Umstellung.
 *
 * Storefront statt Marktplatz-Wolt, Uber Eats bleibt. Gefiltert wird ueber den
 * Namen, weil der Marktplatz-Eintrag und die Storefront beide "Wolt" heissen —
 * der Ausdruck sagt damit woertlich, was die Umstellung tut: der eine Wolt-Weg
 * ersetzt den anderen, Uber Eats bleibt unberuehrt.
 *
 * Am Tag der Umstellung wandert genau das in site.ts und diese Zeile faellt weg.
 */
const NACH_UMSTELLUNG = [
  STOREFRONT_PARTNER,
  ...SITE.delivery.filter((p) => p.name !== STOREFRONT_PARTNER.name),
];

/**
 * Bilddateien der beiden Varianten, damit sie ohne Aufruf dieser Seite
 * weitergereicht werden können (Silvio bekommt eher ein Bild als eine URL).
 *
 * Bewusst SNAPSHOTS, keine Quelle der Wahrheit: die gerenderten Banner weiter
 * oben sind verbindlich. Wird das Banner geändert, driften diese Dateien — sie
 * gehören deshalb zusammen mit dieser Route gelöscht, sobald A oder B
 * entschieden ist. Die Maße sind die echten Dateimaße, damit next/image nicht
 * raten muss und kein Layout-Shift entsteht.
 *
 * Bewusst NUR die beiden Banner-Varianten. Ein Ganzseiten-Screenshot in
 * Handybreite wog 700 KB — für eine Seite, die man auf dem Telefon einfach
 * aufrufen kann. Das ist Ballast, kein Nutzen.
 */
const SCREENSHOTS = [
  {
    titel: "Variante A — Bestellknopf führend",
    src: "/images/sandbox/variante-a.png",
    alt: "Bestellbanner, Variante A: großer Bestellknopf, kleinere Uber-Eats-Kachel daneben.",
    width: 1600,
    height: 206,
  },
  {
    titel: "Variante B — beide gleich groß",
    src: "/images/sandbox/variante-b.png",
    alt: "Bestellbanner, Variante B: Bestellknopf und Uber-Eats-Kachel gleich groß nebeneinander.",
    width: 1600,
    height: 242,
  },
];

function Variante({
  buchstabe,
  titel,
  beschreibung,
  children,
}: {
  buchstabe: string;
  titel: string;
  beschreibung: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-16">
      <div className="mx-auto mb-4 max-w-6xl px-6 sm:px-12">
        <div className="flex items-baseline gap-3">
          <span
            className="text-3xl font-bold leading-none"
            style={{ color: "var(--color-accent)" }}
          >
            {buchstabe}
          </span>
          <h2
            className="text-xl font-semibold"
            style={{ color: "var(--color-text)" }}
          >
            {titel}
          </h2>
        </div>
        <p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>
          {beschreibung}
        </p>
      </div>
      {children}
    </section>
  );
}

export default function SandboxPage() {
  return (
    <main className="py-12" style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="mx-auto mb-12 max-w-6xl px-6 sm:px-12">
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          Interne Vorschau, nicht verlinkt und für Suchmaschinen gesperrt. Beide
          Varianten zeigen das Bestellbanner der Startseite <strong>nach</strong>{" "}
          der Umstellung: die eigene Bestellseite ersetzt den Wolt-Marktplatz,
          Uber Eats bleibt. Auf der echten Startseite steht heute unverändert
          der bisherige Zustand.
        </p>
      </div>

      <Variante
        buchstabe="A"
        titel="Bestellknopf führend"
        beschreibung="Der eigene Bestellweg groß, Uber Eats als kleinere Kachel daneben. Lenkt Gäste in den günstigeren Kanal, ohne den anderen zu verstecken."
      >
        <DeliveryBanner layout="lead" partners={NACH_UMSTELLUNG} />
      </Variante>

      <Variante
        buchstabe="B"
        titel="Beide gleich groß"
        beschreibung="Bestellknopf und Uber Eats auf gleicher Höhe. Neutraler, überlässt dem Gast die Wahl vollständig."
      >
        <DeliveryBanner layout="equal" partners={NACH_UMSTELLUNG} />
      </Variante>

      <section className="mx-auto max-w-6xl px-6 sm:px-12">
        <h2
          className="text-xl font-semibold"
          style={{ color: "var(--color-text)" }}
        >
          Fußleiste
        </h2>
        <p
          className="mt-1 text-sm"
          style={{ color: "var(--color-text-muted)" }}
        >
          Keine Variante, sondern in beiden Fällen gleich — steht auf jeder
          Seite unter &bdquo;Folgen &amp; Bestellen&ldquo;. Der eigene Bestellweg
          heißt dort nicht &bdquo;Lieferung via&ldquo;, weil das nach
          Fremdkurier klänge:
        </p>
        <ul
          className="mt-3 space-y-1 text-sm"
          style={{ color: "var(--color-text)" }}
        >
          {NACH_UMSTELLUNG.map((p) => (
            <li key={p.name}>
              &bull;{" "}
              {p.channel === "own"
                ? "Direkt bestellen"
                : `Lieferung via ${p.name}`}
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-6 sm:px-12">
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
          <ul className="space-y-1 text-sm" style={{ color: "var(--color-text)" }}>
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

      <section className="mx-auto mt-16 max-w-6xl px-6 sm:px-12">
        <h2
          className="text-xl font-semibold"
          style={{ color: "var(--color-text)" }}
        >
          Zum Weiterschicken
        </h2>
        <p
          className="mt-1 text-sm leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          Dieselben Varianten als Bilddatei — für WhatsApp, Mail oder den
          Ausdruck, wenn jemand die Seite nicht selbst aufrufen soll. Antippen
          öffnet die Datei in voller Größe.{" "}
          <strong>Achtung: das sind Momentaufnahmen.</strong> Verbindlich ist
          immer die gerenderte Fassung oben auf dieser Seite; wenn am Banner
          etwas geändert wird, veralten diese Bilder.
        </p>

        <div className="mt-6 space-y-8">
          {SCREENSHOTS.map((s) => (
            <figure key={s.src}>
              <figcaption
                className="mb-2 text-sm font-medium"
                style={{ color: "var(--color-text)" }}
              >
                {s.titel}
              </figcaption>
              <a href={s.src} target="_blank" rel="noopener">
                <Image
                  src={s.src}
                  alt={s.alt}
                  width={s.width}
                  height={s.height}
                  className="h-auto w-full rounded-lg border"
                  style={{ borderColor: "var(--color-border)" }}
                  // Preview-only assets on a noindex route — no LCP budget to
                  // protect here, so they stay lazy and out of the way.
                  loading="lazy"
                />
              </a>
            </figure>
          ))}
        </div>
      </section>
    </main>
  );
}
