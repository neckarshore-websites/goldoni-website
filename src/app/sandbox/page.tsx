import type { Metadata } from "next";
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
    </main>
  );
}
