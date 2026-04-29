import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { StructuredData } from "@/components/StructuredData";
import { LEGAL } from "@/lib/legal";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Impressum — Ristorante Goldoni",
  description: "Anbieterkennzeichnung gemaess § 5 DDG.",
  robots: { index: true, follow: false },
  alternates: { canonical: "/impressum" },
};

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
              <p>Telefax: {LEGAL.contact.fax}</p>
              <p>
                E-Mail:{" "}
                <a
                  href={`mailto:${LEGAL.contact.email}`}
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

            {/* § 5 Abs. 1 Nr. 5 DDG — Berufsrechtliches */}
            <Section title="Berufsbezeichnung und berufsrechtliche Regelungen">
              <p>Berufsbezeichnung: {LEGAL.profession.title}</p>
              <p>Verliehen in: {LEGAL.profession.grantedIn}</p>
              <p>Es gelten folgende berufsrechtliche Regelungen:</p>
              <p>
                {LEGAL.profession.regulation}, einsehbar unter:{" "}
                <a
                  href={LEGAL.profession.regulationUrl}
                  className="underline"
                  style={{ color: "var(--color-accent)" }}
                  rel="nofollow noopener"
                >
                  {LEGAL.profession.regulationUrl}
                </a>
              </p>
            </Section>

            {/* Berufshaftpflichtversicherung */}
            <Section title="Berufshaftpflichtversicherung">
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

            {/* EU-Streitschlichtung — Art. 14 Abs. 1 ODR-VO */}
            <Section title="Streitschlichtung">
              <p>
                Die Europäische Kommission stellt eine Plattform zur
                Online-Streitbeilegung (OS) bereit:{" "}
                <a
                  href="https://ec.europa.eu/consumers/odr/"
                  className="underline"
                  style={{ color: "var(--color-accent)" }}
                  rel="nofollow noopener"
                >
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>
              <p className="mt-3">
                Unsere E-Mail-Adresse finden Sie oben im Impressum.
              </p>
              <p className="mt-3">
                Wir sind nicht bereit oder verpflichtet, an
                Streitbeilegungsverfahren vor einer
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </Section>

            {/* Haftung für Inhalte */}
            <Section title="Haftung für Inhalte">
              <p>
                Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene
                Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
                verantwortlich. Nach §§ 8 bis 10 DDG sind wir als
                Diensteanbieter jedoch nicht verpflichtet, übermittelte oder
                gespeicherte fremde Informationen zu überwachen oder nach
                Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
                hinweisen.
              </p>
              <p className="mt-3">
                Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
                Informationen nach den allgemeinen Gesetzen bleiben hiervon
                unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem
                Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung
                möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen
                werden wir diese Inhalte umgehend entfernen.
              </p>
            </Section>

            {/* Haftung für Links */}
            <Section title="Haftung für Links">
              <p>
                Unser Angebot enthält Links zu externen Webseiten Dritter, auf
                deren Inhalte wir keinen Einfluss haben. Deshalb können wir für
                diese fremden Inhalte auch keine Gewähr übernehmen. Für die
                Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
                oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten
                wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße
                überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der
                Verlinkung nicht erkennbar.
              </p>
              <p className="mt-3">
                Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist
                jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht
                zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir
                derartige Links umgehend entfernen.
              </p>
            </Section>

            {/* Urheberrecht */}
            <Section title="Urheberrecht">
              <p>
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
                diesen Seiten unterliegen dem deutschen Urheberrecht. Die
                Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
                Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen
                der schriftlichen Zustimmung des jeweiligen Autors bzw.
                Erstellers.
              </p>
              <p className="mt-3">
                Soweit die Inhalte auf dieser Seite nicht vom Betreiber
                erstellt wurden, werden die Urheberrechte Dritter beachtet.
                Insbesondere werden Inhalte Dritter als solche gekennzeichnet.
                Sollten Sie trotzdem auf eine Urheberrechtsverletzung
                aufmerksam werden, bitten wir um einen entsprechenden Hinweis.
                Bei Bekanntwerden von Rechtsverletzungen werden wir derartige
                Inhalte umgehend entfernen.
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
