/**
 * Ristorante Goldoni — Single source of truth for legal data
 * (Impressum + Datenschutz).
 *
 * SITE (lib/site.ts) holds public-facing facts (address shown on contact page,
 * hours, social links). LEGAL holds the data that is required by § 5 DDG
 * (Digitale-Dienste-Gesetz, ersetzt seit 14.05.2024 das TMG), § 18 Abs. 2 MStV
 * und Art. 13/14 DSGVO.
 *
 * Update here, propagates to /impressum and /datenschutz.
 *
 * STATUS 2026-04-29 (Linus Session d):
 * - ustId vom Inhaber bestätigt (DE363209537) und gesetzt. Restaurant ist
 *   umsatzsteuerpflichtig (kein Kleinunternehmer nach § 19 UStG).
 *   Die alte WordPress-Site zeigte "DE 123 456 789" als offensichtlichen
 *   Platzhalter — dieser ist hier durch die echte Nummer ersetzt.
 */

export const LEGAL = {
  /**
   * § 5 Abs. 1 Nr. 1 DDG — Name und Anschrift, unter der der Anbieter
   * niedergelassen ist. Bei Personengesellschaften / juristischen Personen
   * zusätzlich Vertretungsberechtigte. Hier: Einzelunternehmen.
   */
  owner: {
    legalForm: "Einzelunternehmer",
    name: "Silvio Brunetti",
    tradeName: "Ristorante Goldoni",
    street: "Reinsburgstraße 151",
    postalCode: "70197",
    city: "Stuttgart",
    country: "Deutschland",
  },

  /**
   * § 5 Abs. 1 Nr. 2 DDG — Angaben, die eine schnelle elektronische
   * Kontaktaufnahme und unmittelbare Kommunikation ermöglichen.
   */
  contact: {
    phone: "+49 (711) 659 98 89",
    fax: "+49 (711) 659 98 89",
    email: "info@goldoni-online.de",
  },

  /**
   * § 5 Abs. 1 Nr. 6 DDG — Umsatzsteuer-Identifikationsnummer
   * "soweit vorhanden". Wenn leer, wird die Zeile im Impressum nicht
   * gerendert (Kleinunternehmer nach § 19 UStG haben keine).
   */
  ustId: "DE363209537",

  /**
   * § 5 Abs. 1 Nr. 3 DDG — Zuständige Aufsichtsbehörde, soweit die Tätigkeit
   * einer behördlichen Zulassung bedarf. Gastronomie benötigt Gaststätten-
   * erlaubnis nach § 2 GastG.
   */
  authority: {
    name: "Landeshauptstadt Stuttgart — Amt für öffentliche Ordnung",
    street: "Eberhardstraße 39",
    postalCode: "70173",
    city: "Stuttgart",
    url: "https://www.stuttgart.de/leben/aemter-und-behoerden/amt-fuer-oeffentliche-ordnung.php",
  },

  /**
   * § 5 Abs. 1 Nr. 5 DDG — Berufsrechtliche Regelungen, soweit der Anbieter
   * eine erlaubnispflichtige Tätigkeit ausübt.
   */
  profession: {
    title: "Gastwirt",
    grantedIn: "Bundesrepublik Deutschland",
    regulation: "Gaststättengesetz (GastG)",
    regulationUrl: "https://www.gesetze-im-internet.de/gastg/",
  },

  /**
   * Berufshaftpflichtversicherung — nicht zwingend Pflicht, aber auf der
   * bestehenden Site angegeben und übernommen.
   */
  insurance: {
    name: "SIGNAL IDUNA Gruppe",
    street: "Joseph-Scherer-Straße 3",
    postalCode: "44139",
    city: "Dortmund",
    scope: "Deutschland",
  },

  /**
   * § 18 Abs. 2 MStV — Verantwortlich für den Inhalt der journalistisch-
   * redaktionell gestalteten Angebote.
   */
  responsibleForContent: {
    name: "Silvio Brunetti",
    street: "Reinsburgstraße 151",
    postalCode: "70197",
    city: "Stuttgart",
  },

  /**
   * Datenschutz-spezifische Stammdaten — werden auf /datenschutz gerendert.
   *
   * Wenn Hoster oder Mail-Provider gewechselt werden, hier anpassen.
   */
  dataProtection: {
    /**
     * Aufsichtsbehörde nach Art. 51 DSGVO für Sitz Stuttgart.
     */
    supervisoryAuthority: {
      name: "Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg",
      street: "Lautenschlagerstraße 20",
      postalCode: "70173",
      city: "Stuttgart",
      phone: "+49 711 615541-0",
      email: "poststelle@lfdi.bwl.de",
      url: "https://www.baden-wuerttemberg.datenschutz.de",
    },
    /**
     * Hosting-Provider (Auftragsverarbeiter nach Art. 28 DSGVO).
     */
    hoster: {
      name: "Vercel Inc.",
      address: "340 S Lemon Ave #4133, Walnut, CA 91789, USA",
      privacyUrl: "https://vercel.com/legal/privacy-policy",
      dpaUrl: "https://vercel.com/legal/dpa",
    },
    /**
     * E-Mail-Versand für Formularanfragen.
     *
     * Routing läuft über das bestehende DomainFactory-SMTP-Postfach des
     * Inhabers (kein zusätzlicher US-Auftragsverarbeiter, kein Drittland-
     * Transfer für den Mail-Pfad). DomainFactory ist bereits als Hoster
     * der Mail-Infrastruktur vertraglich gebunden — DSGVO-Vertrag liegt
     * über das Hosting-Konto vor.
     */
    mailService: {
      name: "DomainFactory GmbH",
      address: "Oskar-Messter-Str. 33, 85737 Ismaning, Deutschland",
      privacyUrl: "https://www.df.eu/de/datenschutz/",
      dpaUrl: "https://www.df.eu/de/agb/",
    },
  },

  /**
   * Letzte redaktionelle Aktualisierung dieses Impressums + Datenschutz (ISO 8601).
   * Nicht gesetzlich vorgeschrieben, aber gute Praxis und hilft bei
   * späteren Audits.
   *
   * 2026-04-29: USt-IdNr ergänzt (PR #25), E-Mail-Versand-Abschnitt von
   * Resend auf DomainFactory-SMTP umgestellt (PR-30).
   * 2026-06-12: Cloudflare Turnstile als Formular-Spam-Schutz ergänzt
   * (US-Auftragsverarbeiter, §4 Datenschutz).
   */
  lastUpdated: "2026-06-12",
} as const;

export type LegalConfig = typeof LEGAL;
