import type { Metadata } from "next";
import { StructuredData } from "@/components/StructuredData";
import { LEGAL } from "@/lib/legal";
import { SITE } from "@/lib/site";
import { breadcrumbJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Datenschutzerklaerung — Ristorante Goldoni",
  description:
    "Informationen zur Verarbeitung personenbezogener Daten gemaess Art. 13 DSGVO.",
  robots: { index: true, follow: false },
  alternates: { canonical: "/datenschutz" },
};

export default function DatenschutzPage() {
  return (
    <main className="px-6 py-20 sm:px-12 sm:py-24">
      <StructuredData
        data={breadcrumbJsonLd([
          { name: "Datenschutz", path: "/datenschutz" },
        ])}
      />
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
          Datenschutzerklärung
        </h1>
        <p
          className="mb-12 text-lg leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          Diese Erklärung informiert Sie nach Art. 13 und 14
          Datenschutz-Grundverordnung (DSGVO) über Art, Umfang und Zweck der
          Verarbeitung personenbezogener Daten auf dieser Webseite.
        </p>

        <div className="space-y-12">
          {/* 1. Verantwortlicher */}
          <Section title="1. Verantwortlicher">
            <p>
              Verantwortlich im Sinne der DSGVO und sonstiger nationaler
              Datenschutzgesetze sowie sonstiger datenschutzrechtlicher
              Bestimmungen ist:
            </p>
            <p className="mt-3">
              {LEGAL.owner.tradeName}
              <br />
              {LEGAL.owner.name}
              <br />
              {LEGAL.owner.street}
              <br />
              {LEGAL.owner.postalCode} {LEGAL.owner.city}
              <br />
              {LEGAL.owner.country}
            </p>
            <p className="mt-3">
              Telefon:{" "}
              <a
                href={`tel:${LEGAL.contact.phone.replace(/[^+\d]/g, "")}`}
                className="underline"
                style={{ color: "var(--color-accent)" }}
              >
                {LEGAL.contact.phone}
              </a>
              <br />
              E-Mail:{" "}
              <a
                href={SITE.emailMailto}
                className="underline"
                style={{ color: "var(--color-accent)" }}
              >
                {LEGAL.contact.email}
              </a>
            </p>
            <p
              className="mt-3 text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              Ein Datenschutzbeauftragter ist nicht bestellt. Eine
              Bestellpflicht besteht für unseren Betrieb nach Art. 37 DSGVO,
              § 38 BDSG nicht.
            </p>
          </Section>

          {/* 2. Allgemeine Hinweise */}
          <Section title="2. Allgemeine Hinweise zur Datenverarbeitung">
            <p>
              Wir verarbeiten personenbezogene Daten nur dann, wenn dies zur
              Bereitstellung einer funktionsfähigen Webseite, zur Beantwortung
              Ihrer Anfragen oder aufgrund einer entsprechenden Einwilligung
              erforderlich ist. Eine Verarbeitung erfolgt regelmäßig nur,
              soweit eine Rechtsgrundlage nach Art. 6 Abs. 1 DSGVO besteht.
            </p>
            <p className="mt-3">
              Diese Webseite nutzt aus Sicherheitsgründen eine
              SSL-/TLS-Verschlüsselung für die Übertragung vertraulicher
              Inhalte (z.&nbsp;B. Anfragen über Kontaktformulare). Eine
              verschlüsselte Verbindung erkennen Sie an der Adresszeile des
              Browsers (»https://«) sowie am Schloss-Symbol.
            </p>
          </Section>

          {/* 3. Hosting */}
          <Section title="3. Hosting und Server-Logfiles">
            <p>
              Diese Webseite wird gehostet bei{" "}
              <strong>{LEGAL.dataProtection.hoster.name}</strong>,{" "}
              {LEGAL.dataProtection.hoster.address}.
            </p>
            <p className="mt-3">
              Bei jedem Aufruf erfasst der Hoster automatisch Daten in
              Server-Logfiles, die Ihr Browser übermittelt. Dies sind:
            </p>
            <ul className="mt-2 ml-6 list-disc space-y-1">
              <li>IP-Adresse des anfragenden Geräts</li>
              <li>Datum und Uhrzeit der Anfrage</li>
              <li>aufgerufene URL und HTTP-Statuscode</li>
              <li>übertragene Datenmenge</li>
              <li>Browsertyp und -version, Betriebssystem</li>
              <li>Referrer-URL (zuvor besuchte Seite)</li>
            </ul>
            <p className="mt-3">
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO
              (berechtigtes Interesse an der technischen Bereitstellung und
              Sicherheit der Webseite).
            </p>
            <p className="mt-3">
              <strong>Speicherdauer:</strong> Die Logfiles werden vom Hoster
              für maximal 30 Tage gespeichert und anschließend gelöscht, sofern
              keine Anhaltspunkte für einen Sicherheitsvorfall vorliegen.
            </p>
            <p className="mt-3">
              <strong>Drittlandübermittlung:</strong> Vercel ist ein
              US-Unternehmen. Die Datenverarbeitung kann auch in den USA
              stattfinden. Vercel stellt geeignete Garantien nach Art. 46
              DSGVO bereit (Standardvertragsklauseln, EU-US Data Privacy
              Framework). Datenschutzhinweise des Hosters:{" "}
              <a
                href={LEGAL.dataProtection.hoster.privacyUrl}
                className="underline"
                style={{ color: "var(--color-accent)" }}
                rel="nofollow noopener"
                target="_blank"
              >
                {LEGAL.dataProtection.hoster.privacyUrl}
              </a>
            </p>
          </Section>

          {/* 4. Kontaktformular */}
          <Section title="4. Kontaktformular und Feiern-Anfrage">
            <p>
              Wenn Sie uns über das{" "}
              <a
                href="/kontakt"
                className="underline"
                style={{ color: "var(--color-accent)" }}
              >
                Kontaktformular
              </a>{" "}
              oder das Formular für{" "}
              <a
                href="/feiern"
                className="underline"
                style={{ color: "var(--color-accent)" }}
              >
                Feieranfragen
              </a>{" "}
              erreichen, verarbeiten wir die folgenden Daten:
            </p>
            <ul className="mt-2 ml-6 list-disc space-y-1">
              <li>Name (Pflichtangabe)</li>
              <li>E-Mail-Adresse (Pflichtangabe)</li>
              <li>Telefonnummer (optional bei Kontakt; Pflicht bei Feiern)</li>
              <li>Ihre Nachricht bzw. Anmerkungen</li>
              <li>
                bei Feieranfragen zusätzlich: Anlass, Wunschdatum, Gästeanzahl,
                Wunschzeit
              </li>
            </ul>
            <p className="mt-3">
              <strong>Zweck:</strong> Bearbeitung Ihrer Anfrage,
              Vertragsanbahnung (z.&nbsp;B. bei Tisch- und Feierreservierung)
              sowie nachfolgende Kommunikation.
            </p>
            <p className="mt-3">
              <strong>Rechtsgrundlage:</strong>
            </p>
            <ul className="mt-2 ml-6 list-disc space-y-1">
              <li>
                Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage auf den
                Abschluss oder die Durchführung eines Vertrags abzielt
                (z.&nbsp;B. Tisch- oder Feierreservierung).
              </li>
              <li>
                Art. 6 Abs. 1 lit. f DSGVO bei sonstigen Anfragen
                (berechtigtes Interesse an der Beantwortung).
              </li>
            </ul>
            <p className="mt-3">
              <strong>Speicherdauer:</strong> Wir speichern Ihre Anfrage und
              die zugehörige Korrespondenz, bis der Zweck der Speicherung
              entfällt &mdash; in der Regel nach Abschluss der Konversation
              bzw. der Veranstaltung. Zwingende gesetzliche
              Aufbewahrungsfristen (insbesondere handels- und steuerrechtliche
              Pflichten nach §§ 147 AO, 257 HGB) bleiben unberührt.
            </p>
            <p className="mt-3">
              <strong>Spam-Schutz:</strong> Die Formulare nutzen ein
              unsichtbares Honeypot-Feld zur automatisierten Erkennung von
              Bot-Anfragen. Es werden hierbei keine zusätzlichen
              personenbezogenen Daten erhoben.
            </p>
          </Section>

          {/* 5. E-Mail-Versand via Resend */}
          <Section title="5. E-Mail-Versand über Resend">
            <p>
              Für den technischen Versand der Formular-Eingaben an unser
              Postfach setzen wir den Dienst{" "}
              <strong>{LEGAL.dataProtection.mailService.name}</strong>,{" "}
              {LEGAL.dataProtection.mailService.address} ein.
            </p>
            <p className="mt-3">
              Die im Formular eingegebenen Daten werden zu diesem Zweck an
              Resend übermittelt und dort kurzfristig zur Zustellung der
              E-Mail verarbeitet. Mit Resend besteht ein Vertrag zur
              Auftragsverarbeitung nach Art. 28 DSGVO.
            </p>
            <p className="mt-3">
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b bzw.
              lit. f DSGVO (siehe oben).
            </p>
            <p className="mt-3">
              <strong>Drittlandübermittlung:</strong> Resend hat seinen Sitz
              in den USA. Die Übermittlung erfolgt auf Grundlage von
              Standardvertragsklauseln nach Art. 46 DSGVO sowie ergänzender
              Sicherheitsmaßnahmen. Datenschutzhinweise:{" "}
              <a
                href={LEGAL.dataProtection.mailService.privacyUrl}
                className="underline"
                style={{ color: "var(--color-accent)" }}
                rel="nofollow noopener"
                target="_blank"
              >
                {LEGAL.dataProtection.mailService.privacyUrl}
              </a>
            </p>
          </Section>

          {/* 6. Schriften */}
          <Section title="6. Schriftarten">
            <p>
              Diese Webseite verwendet die Schriftarten »Inter« und »Playfair
              Display«. Beide werden <strong>lokal von unserem Server</strong>{" "}
              ausgeliefert (»self-hosted«). Es findet{" "}
              <strong>keine Verbindung zu Google Fonts oder anderen
              Drittanbieter-CDNs</strong> statt. Beim Aufruf einer Seite werden
              dadurch keine personenbezogenen Daten an Schriftanbieter
              übertragen.
            </p>
          </Section>

          {/* 7. Cookies und lokale Speicherung */}
          <Section title="7. Cookies und lokale Speicherung">
            <p>
              <strong>Diese Webseite setzt keine Cookies zu Tracking-,
              Analyse- oder Werbezwecken.</strong> Es werden keine
              Drittanbieter-Cookies verwendet. Aus diesem Grund verzichten wir
              auf einen Cookie-Banner.
            </p>
            <p className="mt-3">
              Lediglich für die von Ihnen aktiv gewählte Designvariante
              (hell&nbsp;/&nbsp;dunkel) speichern wir Ihre Auswahl in der
              lokalen Speicherung Ihres Browsers (»localStorage«) unter dem
              Schlüssel <code style={{ color: "var(--color-text)" }}>theme</code>.
              Diese Information verbleibt ausschließlich auf Ihrem Gerät und
              wird nicht an uns oder Dritte übertragen. Sie können diese
              Information jederzeit über die Einstellungen Ihres Browsers
              löschen.
            </p>
            <p className="mt-3">
              <strong>Rechtsgrundlage:</strong> § 25 Abs. 2 Nr. 2 TDDDG
              (technisch unbedingt erforderlich für die vom Nutzer ausdrücklich
              gewünschte Funktion).
            </p>
          </Section>

          {/* 8. Externe Links */}
          <Section title="8. Externe Links und Dienste">
            <p>
              Auf dieser Webseite finden Sie Verlinkungen zu externen Diensten:
            </p>
            <ul className="mt-2 ml-6 list-disc space-y-1">
              <li>
                Lieferdienste <strong>Wolt</strong> und{" "}
                <strong>Uber Eats</strong>
              </li>
              <li>
                Soziale Netzwerke <strong>Facebook</strong> und{" "}
                <strong>Instagram</strong> (Meta Platforms Ireland Limited,
                Merrion Road, Dublin 4, Irland)
              </li>
              <li>
                Musik-Streamingdienst <strong>Spotify</strong> (Spotify AB,
                Regeringsgatan 19, 111&nbsp;53 Stockholm, Schweden) — Link zu
                unserer Hausplaylist
              </li>
              <li>
                Routenplanung über <strong>Google Maps</strong> (Google Ireland
                Limited, Gordon House, Barrow Street, Dublin 4, Irland)
              </li>
            </ul>
            <p className="mt-3">
              Erst beim aktiven Klick auf einen dieser Links wird eine
              Verbindung zu den jeweiligen Anbietern hergestellt. Wir betten
              keine Inhalte dieser Dienste (insbesondere keine Like-Schaltflächen,
              Pixel oder eingebettete Player) in unsere Webseite ein und setzen
              keine zugehörigen Skripte oder Cookies.
            </p>
            <p className="mt-3">
              Für die Datenverarbeitung auf den Zielseiten ist der jeweilige
              Anbieter verantwortlich. Bitte informieren Sie sich dort über die
              jeweilige Datenschutzpraxis:
            </p>
            <ul className="mt-2 ml-6 list-disc space-y-1 text-sm">
              <li>
                Facebook&nbsp;/ Instagram:{" "}
                <a
                  href="https://www.facebook.com/privacy/policy/"
                  className="underline"
                  style={{ color: "var(--color-accent)" }}
                  rel="nofollow noopener"
                  target="_blank"
                >
                  facebook.com/privacy/policy
                </a>
              </li>
              <li>
                Spotify:{" "}
                <a
                  href="https://www.spotify.com/de/legal/privacy-policy/"
                  className="underline"
                  style={{ color: "var(--color-accent)" }}
                  rel="nofollow noopener"
                  target="_blank"
                >
                  spotify.com/de/legal/privacy-policy
                </a>
              </li>
              <li>
                Google Maps:{" "}
                <a
                  href="https://policies.google.com/privacy"
                  className="underline"
                  style={{ color: "var(--color-accent)" }}
                  rel="nofollow noopener"
                  target="_blank"
                >
                  policies.google.com/privacy
                </a>
              </li>
            </ul>
          </Section>

          {/* 9. Ihre Rechte */}
          <Section title="9. Ihre Rechte als betroffene Person">
            <p>
              Soweit personenbezogene Daten von Ihnen verarbeitet werden,
              stehen Ihnen als betroffener Person folgende Rechte zu:
            </p>
            <ul className="mt-2 ml-6 list-disc space-y-1">
              <li>
                <strong>Auskunft</strong> über die zu Ihrer Person gespeicherten
                Daten (Art. 15 DSGVO)
              </li>
              <li>
                <strong>Berichtigung</strong> unrichtiger Daten (Art. 16 DSGVO)
              </li>
              <li>
                <strong>Löschung</strong> Ihrer Daten (Art. 17 DSGVO)
              </li>
              <li>
                <strong>Einschränkung</strong> der Verarbeitung (Art. 18 DSGVO)
              </li>
              <li>
                <strong>Datenübertragbarkeit</strong> (Art. 20 DSGVO)
              </li>
              <li>
                <strong>Widerspruch</strong> gegen die Verarbeitung
                (Art. 21 DSGVO), insbesondere wenn die Verarbeitung auf
                Art. 6 Abs. 1 lit. f DSGVO gestützt wird
              </li>
              <li>
                <strong>Widerruf einer erteilten Einwilligung</strong> mit
                Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO)
              </li>
            </ul>
            <p className="mt-3">
              Zur Ausübung dieser Rechte genügt eine formlose Mitteilung an die
              im Abschnitt »Verantwortlicher« genannten Kontaktdaten.
            </p>
          </Section>

          {/* 10. Beschwerderecht */}
          <Section title="10. Beschwerderecht bei der Aufsichtsbehörde">
            <p>
              Sie haben gemäß Art. 77 DSGVO das Recht, sich bei einer
              Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer
              personenbezogenen Daten zu beschweren. Für unseren Sitz
              zuständig ist:
            </p>
            <p className="mt-3">
              {LEGAL.dataProtection.supervisoryAuthority.name}
              <br />
              {LEGAL.dataProtection.supervisoryAuthority.street}
              <br />
              {LEGAL.dataProtection.supervisoryAuthority.postalCode}{" "}
              {LEGAL.dataProtection.supervisoryAuthority.city}
            </p>
            <p className="mt-3">
              Telefon: {LEGAL.dataProtection.supervisoryAuthority.phone}
              <br />
              E-Mail:{" "}
              <a
                href={`mailto:${LEGAL.dataProtection.supervisoryAuthority.email}`}
                className="underline"
                style={{ color: "var(--color-accent)" }}
              >
                {LEGAL.dataProtection.supervisoryAuthority.email}
              </a>
              <br />
              Web:{" "}
              <a
                href={LEGAL.dataProtection.supervisoryAuthority.url}
                className="underline"
                style={{ color: "var(--color-accent)" }}
                rel="nofollow noopener"
                target="_blank"
              >
                {LEGAL.dataProtection.supervisoryAuthority.url}
              </a>
            </p>
          </Section>

          {/* 11. Pflicht zur Bereitstellung */}
          <Section title="11. Pflicht zur Bereitstellung der Daten">
            <p>
              Eine gesetzliche oder vertragliche Pflicht zur Bereitstellung
              Ihrer personenbezogenen Daten besteht nicht. Die Angabe der mit
              »Pflicht« gekennzeichneten Felder in unseren Formularen ist
              jedoch erforderlich, damit wir Ihre Anfrage bearbeiten und mit
              Ihnen Kontakt aufnehmen können. Ohne diese Angaben können wir
              die Anfrage nicht beantworten.
            </p>
          </Section>

          {/* 12. Automatisierte Entscheidungsfindung */}
          <Section title="12. Automatisierte Entscheidungsfindung">
            <p>
              Eine automatisierte Entscheidungsfindung einschließlich Profiling
              im Sinne von Art. 22 DSGVO findet auf dieser Webseite nicht
              statt.
            </p>
          </Section>

          {/* 13. Aktualität */}
          <Section title="13. Aktualität und Änderung dieser Datenschutzerklärung">
            <p>
              Diese Datenschutzerklärung ist aktuell gültig und hat den unten
              angegebenen Stand. Durch die Weiterentwicklung unserer Webseite
              oder aufgrund geänderter rechtlicher bzw. behördlicher Vorgaben
              kann es notwendig werden, diese Datenschutzerklärung anzupassen.
              Die jeweils aktuelle Fassung kann jederzeit auf dieser Seite
              abgerufen werden.
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
    </main>
  );
}

/**
 * Lokale Section-Komponente — analog zu /impressum, hält das Markup
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
