import { PageHero } from "@/components/PageHero";
import { StructuredData } from "@/components/StructuredData";
import { LEGAL } from "@/lib/legal";
import { SITE } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata = pageMetadata({
  title: "Impressum",
  description: "Anbieterkennzeichnung gemaess § 5 DDG.",
  path: "/impressum",
  noFollow: true,
});

export default function ImpressumPage() {
  return (
    <main>
      <StructuredData
        data={breadcrumbJsonLd([{ name: "Impressum", path: "/impressum" }])}
      />
      <PageHero
        src="/images/hero-impressum-trauben.webp"
        alt="Hände halten frisch geerntete dunkle Weintrauben — Symbol für italienische Gastfreundschaft"
      />
      <div className="px-6 pb-20 pt-12 sm:px-12 sm:pb-24">
        <div className="mx-auto max-w-3xl">
          <p
            className="mb-3 text-xs uppercase tracking-[0.2em]"
            style={{ color: "var(--color-brand-olive)" }}
          >
            Rechtliches
          </p>
          <h1
            className="mb-6 text-4xl sm:text-5xl"
            style={{ color: "var(--color-text)" }}
          >
            Impressum
          </h1>
          <p
            className="mb-12 text-lg leading-relaxed"
            style={{ color: "var(--color-text-muted)" }}
          >
            Anbieterkennzeichnung gemäß § 5 Digitale-Dienste-Gesetz (DDG) und
            § 18 Abs. 2 Medienstaatsvertrag (MStV).
          </p>

          <div className="space-y-10">
            {/* § 5 Abs. 1 Nr. 1 DDG — Anbieter */}
            <Section title="Anbieter">
              <p>{LEGAL.owner.tradeName}</p>
              <p>Inhaber: {LEGAL.owner.name}</p>
              <p>{LEGAL.owner.street}</p>
              <p>
                {LEGAL.owner.postalCode} {LEGAL.owner.city}
              </p>
              <p>{LEGAL.owner.country}</p>
              <p
                className="mt-2 text-sm"
                style={{ color: "var(--color-text-muted)" }}
              >
                Rechtsform: {LEGAL.owner.legalForm}
              </p>
            </Section>

            {/* § 5 Abs. 1 Nr. 2 DDG — Kontakt */}
            <Section title="Kontakt">
              <p>
                Telefon:{" "}
                <a
                  href={`tel:${LEGAL.contact.phone.replace(/[^+\d]/g, "")}`}
                  className="underline"
                  style={{ color: "var(--color-accent)" }}
                >
                  {LEGAL.contact.phone}
                </a>
              </p>
              <p>
                E-Mail:{" "}
                <a
                  href={SITE.emailMailto}
                  className="underline"
                  style={{ color: "var(--color-accent)" }}
                >
                  {LEGAL.contact.email}
                </a>
              </p>
            </Section>

            {/* § 5 Abs. 1 Nr. 6 DDG — USt-IdNr. nur falls vorhanden */}
            {LEGAL.ustId ? (
              <Section title="Umsatzsteuer-Identifikationsnummer">
                <p>{LEGAL.ustId}</p>
                <p
                  className="mt-2 text-sm"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Umsatzsteuer-Identifikationsnummer gemäß § 27 a
                  Umsatzsteuergesetz.
                </p>
              </Section>
            ) : null}

            {/* § 5 Abs. 1 Nr. 3 DDG — Aufsichtsbehörde */}
            <Section title="Aufsichtsbehörde">
              <p>{LEGAL.authority.name}</p>
              <p>{LEGAL.authority.street}</p>
              <p>
                {LEGAL.authority.postalCode} {LEGAL.authority.city}
              </p>
              <p className="mt-2">
                <a
                  href={LEGAL.authority.url}
                  className="underline"
                  style={{ color: "var(--color-accent)" }}
                  rel="nofollow noopener"
                >
                  {LEGAL.authority.url}
                </a>
              </p>
            </Section>


            {/* Betriebshaftpflichtversicherung */}
            <Section title="Betriebshaftpflichtversicherung">
              <p>{LEGAL.insurance.name}</p>
              <p>{LEGAL.insurance.street}</p>
              <p>
                {LEGAL.insurance.postalCode} {LEGAL.insurance.city}
              </p>
              <p
                className="mt-2 text-sm"
                style={{ color: "var(--color-text-muted)" }}
              >
                Geltungsraum der Versicherung: {LEGAL.insurance.scope}
              </p>
            </Section>

            {/* § 18 Abs. 2 MStV — Verantwortlich für den Inhalt */}
            <Section title="Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV">
              <p>{LEGAL.responsibleForContent.name}</p>
              <p>{LEGAL.responsibleForContent.street}</p>
              <p>
                {LEGAL.responsibleForContent.postalCode}{" "}
                {LEGAL.responsibleForContent.city}
              </p>
            </Section>

            {/* § 36 VSBG — Teilnahmebereitschaft. Der frueher hier stehende
                Verweis auf die EU-Plattform zur Online-Streitbeilegung ist am
                2026-08-27 entfallen: die Plattform wurde zum 20.07.2025 durch
                VO (EU) 2024/3228 abgeschaltet, ec.europa.eu/consumers/odr
                leitet seither auf eine Abschaltmeldung. Ein Pflichthinweis auf
                eine nicht mehr existierende Stelle ist kein Pflichthinweis. */}
            <Section title="Streitschlichtung">
              <p>
                Wir sind nicht bereit oder verpflichtet, an
                Streitbeilegungsverfahren vor einer
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </Section>



          </div>

          <p
            className="mt-16 text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            Stand: {formatDate(LEGAL.lastUpdated)}
          </p>
        </div>
      </div>
    </main>
  );
}

/**
 * Kleine, lokal verwendete Section-Komponente — hält das Impressum-Markup
 * konsistent ohne globalen Komponenten-Bloat.
 */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2
        className="mb-3 text-xl sm:text-2xl"
        style={{ color: "var(--color-heading-italian)" }}
      >
        {title}
      </h2>
      <div
        className="space-y-1 leading-relaxed"
        style={{ color: "var(--color-text-muted)" }}
      >
        {children}
      </div>
    </section>
  );
}

/**
 * "2026-04-29" → "29. April 2026"
 */
function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const months = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ];
  return `${day}. ${months[month - 1]} ${year}`;
}
