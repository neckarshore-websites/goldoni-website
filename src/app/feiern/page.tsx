import { SITE } from "@/lib/site";
import { FeiernForm } from "@/components/forms/FeiernForm";
import { PageHero } from "@/components/PageHero";
import { SaalGalerie, type GalleryImage } from "@/components/SaalGalerie";
import { StructuredData } from "@/components/StructuredData";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { pageMetadata } from "@/lib/page-metadata";

// Echte Saal-Fotos vom Restaurant. Hochkant, optimiert auf q=85 WebP.
// Originals stammen aus realen Anlässen — Tafel mit goldenen Stuhlhussen,
// gelbe Rosen + weiße Lilien als Tischdeko. Hero (16:9) ist ein Crop von F1.
const SAAL_GALLERY: GalleryImage[] = [
  {
    src: "/images/feiern-saal-bogenfenster-tafel.webp",
    width: 1053,
    height: 1258,
    alt: "Festlich gedeckte lange Tafel im Goldoni-Saal mit hohen Bogenfenstern, weißen Stuhlhussen mit goldenem Band, Kandelabern mit weißen Kerzen und Tischdeko aus gelben Rosen und Lilien.",
    caption: "Lange Tafel im historischen Saal mit Bogenfenstern",
  },
  {
    src: "/images/feiern-kandelaber-rosen-lilien.webp",
    width: 1136,
    height: 1534,
    alt: "Goldene Kandelaber mit weißen Kerzen, weißen Lilien, gelben Rosen und Efeu — Tischdeko-Detail im Goldoni-Saal.",
    caption: "Tischdeko — Kandelaber mit Rosen und Lilien",
  },
  {
    src: "/images/feiern-tafel-aus-naehe.webp",
    width: 1163,
    height: 1255,
    alt: "Festlich eingedeckte Tafel von oben — weiße Teller, Kristallgläser, Stuhlhussen mit goldenem Satinband, Tischdeko mit Kandelaber und Blumen.",
    caption: "Eingedeckte Festtafel, von oben",
  },
  {
    src: "/images/feiern-saal-historische-banner.webp",
    width: 1172,
    height: 1471,
    alt: "Goldoni-Saal mit historischen Wandbannern (Ludwig Köller von Leinroden, 1872), Spiegel, Holzvertäfelung und festlich gedeckter Tafel mit weißen Stuhlhussen und goldenen Bändern.",
    caption: "Saal mit historischen Bannern (Köller von Leinroden, 1872)",
  },
];

// Absolute title — bypasses root template because the page-level narrative
// already contains the brand ("Feiern bei Goldoni"). Otherwise the brand
// would render twice in <title> and og:title.
export const metadata = pageMetadata({
  title: "Feiern bei Goldoni — Private Anlässe in Stuttgart",
  description:
    "Hochzeiten, Geburtstage, Taufen, Firmenfeiern. Im Ristorante Goldoni richten wir Ihren privaten Anlass aus — mit individueller Karte und der Aufmerksamkeit, die er verdient.",
  path: "/feiern",
  absoluteTitle: true,
});

export default function FeiernPage() {
  return (
    <main>
      <StructuredData
        data={breadcrumbJsonLd([{ name: "Feiern", path: "/feiern" }])}
      />
      <PageHero
        src="/images/hero-feiern-saal.webp"
        alt="Festlich gedeckte lange Tafel im historischen Goldoni-Saal mit Bogenfenstern, goldenen Stuhlhussen und Tischdeko aus weißen Lilien und gelben Rosen"
      />
      <div className="px-6 pb-20 pt-12 sm:px-12 sm:pb-24">
      <div className="mx-auto max-w-3xl">
        <p
          className="mb-3 text-xs uppercase tracking-[0.2em]"
          style={{ color: "var(--color-brand-olive)" }}
        >
          Privat &amp; Feierlich
        </p>
        <h1
          className="mb-6 text-4xl sm:text-5xl"
          style={{ color: "var(--color-text)" }}
        >
          Feiern bei Goldoni
        </h1>
        <p
          className="mb-10 text-lg leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          Hochzeiten, Geburtstage, Taufen, Kommunionen, Firmenfeiern. Wir
          richten Ihren Anlass aus &mdash; im ganzen Restaurant oder in
          einem reservierten Bereich.
        </p>

        <h2
          className="mb-4 mt-12 text-2xl"
          style={{ color: "var(--color-text)" }}
        >
          Was wir bieten
        </h2>
        <ul className="space-y-3" style={{ color: "var(--color-text)" }}>
          <li className="flex gap-3">
            <span aria-hidden style={{ color: "var(--color-accent)" }}>
              &bull;
            </span>
            <span>
              <strong>Individuelle Karte</strong> &mdash; abgestimmt auf
              Anlass, Gästeanzahl und Vorlieben
            </span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden style={{ color: "var(--color-accent)" }}>
              &bull;
            </span>
            <span>
              <strong>Sonntag vormittags verfügbar</strong> &mdash;
              Brunch, Tauffeier, Familienfest in entspannter Atmosphäre
            </span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden style={{ color: "var(--color-accent)" }}>
              &bull;
            </span>
            <span>
              <strong>Wein- und Getränkebegleitung</strong> &mdash; aus
              unserem Keller passend zum Menü empfohlen
            </span>
          </li>
          <li className="flex gap-3">
            <span aria-hidden style={{ color: "var(--color-accent)" }}>
              &bull;
            </span>
            <span>
              <strong>Persönliche Beratung</strong> &mdash; Anfrage
              senden oder direkt anrufen
            </span>
          </li>
        </ul>

        {/* Feieranfrage form — primary path. Phone fallback below. */}
        <section
          className="mt-12 rounded-lg border p-6 sm:p-8"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-bg-muted)",
          }}
          aria-labelledby="feiern-form-heading"
        >
          <p
            className="mb-2 text-xs uppercase tracking-[0.2em]"
            style={{ color: "var(--color-brand-olive)" }}
          >
            Unverbindlich anfragen
          </p>
          <h2
            id="feiern-form-heading"
            className="mb-2 text-2xl sm:text-3xl"
            style={{ color: "var(--color-heading-italian)" }}
          >
            Feieranfrage
          </h2>
          <p
            className="mb-6"
            style={{ color: "var(--color-text-muted)" }}
          >
            Datum, Anlass und Gästeanzahl reichen für den ersten
            Aufschlag &mdash; wir rufen zurück und besprechen Karte und
            Details persönlich.
          </p>
          <FeiernForm />
        </section>

        {/* Phone fallback for visitors who prefer voice contact */}
        <div
          className="mt-8 flex flex-col gap-3 rounded-lg border p-6 sm:flex-row sm:items-center sm:justify-between"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-bg)",
          }}
        >
          <p style={{ color: "var(--color-text-muted)" }}>
            Lieber direkt am Telefon? Auch gerne &mdash; wir besprechen
            alles im Detail.
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
            {/* Inline phone icon — same path as Header PhoneIcon */}
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

        {/* Saal-Galerie — echte Fotos aus dem Restaurant. Lightbox auf
            Klick (Desktop + Mobile), ESC schließt, ← / → blättern. */}
        <section
          className="mt-16 sm:mt-20"
          aria-labelledby="saal-galerie-heading"
        >
          <p
            className="mb-3 text-xs uppercase tracking-[0.2em]"
            style={{ color: "var(--color-brand-olive)" }}
          >
            Eindrücke
          </p>
          <h2
            id="saal-galerie-heading"
            className="mb-4 text-2xl sm:text-3xl"
            style={{ color: "var(--color-heading-italian)" }}
          >
            Unser Saal
          </h2>
          <p
            className="mb-8 text-base leading-relaxed"
            style={{ color: "var(--color-text-muted)" }}
          >
            Bogenfenster, dunkle Holzvertäfelung, lange Tafel mit
            Tischdeko &mdash; ein Bild der letzten Feiern bei uns. Klicken
            Sie für die Vollansicht.
          </p>
          <SaalGalerie images={SAAL_GALLERY} />
        </section>
      </div>
      </div>
    </main>
  );
}
