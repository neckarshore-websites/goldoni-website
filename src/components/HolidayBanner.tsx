import Image from "next/image";

/**
 * HolidayBanner — Ankündigung der Sommerschliessung.
 *
 * TERMINIERT: erscheint automatisch ab Montag, 3. August 2026 (Beginn der
 * Schliessung selbst), blendet sich automatisch ab Montag, 24. August wieder
 * aus. War kurz am 2026-07-26 sofort live geschaltet (Betreiber-Wunsch, einmal
 * in echter Umgebung ansehen), kurz auf den 4. August verschoben, dann auf
 * ausdrücklichen Betreiber-Wunsch wieder auf den 3. gezogen — volle Deckung
 * der Schliessung, keine Lücke. Weiterhin permanent auf /sandbox zu sehen
 * (siehe `forcePreview`).
 *
 * WÄHREND DER SCHLIESSUNG VERSCHWINDET AUCH DAS BESTELLBANNER (Wolt/Uber Eats)
 * UND DAS SONNTAGSBANNER VON DER STARTSEITE. Betreiber-Entscheidung: aus einer
 * geschlossenen Küche heraus zu bestellen ist unmöglich, also hat ein
 * Bestellbanner in dieser Zeit keinen Sinn — „alles raus, nur noch Azzurro
 * oben". `isSummerClosureWindow()` exportiert exakt dasselbe Zeitfenster, das
 * dieses Banner selbst zeigt, damit `page.tsx` beide Banner mit EINER
 * Zeitquelle steuert statt einer zweiten, separat gepflegten.
 *
 * Das Bestellbanner kommt am 24. August automatisch zurück (derselbe Cutoff).
 * Ob das Sonntagsbanner danach wieder erscheint, ist bewusst NICHT Teil dieser
 * Logik — SundayBanner.tsx läuft mit seinem eigenen, permanenten Ablauf
 * (2. August, kein Wiedereinschalten) weiter, unberührt von dieser Datei. Das
 * ist Absicht: die Wiedereinführung hängt laut Betreiber vom Wetter ab und ist
 * eine eigene, spätere Entscheidung.
 *
 * ALLE DATEN BESTÄTIGT 2026-07-26 (vor Ort):
 * - Wiedereröffnung: Mittwoch, 26. August. Die ursprüngliche Angabe „ab
 *   Mittwoch, den 24." war in sich widersprüchlich — der 24. ist ein Montag —
 *   und wurde zur abgeleiteten Fassung korrigiert, dann vom Betreiber bestätigt.
 * - Das Banner blendet sich am Montag, 24. August aus — VOR der Wiedereröffnung,
 *   nicht erst danach. Absicht: Montag und Dienstag (24./25.) sind ohnehin die
 *   Standard-Ruhetage, die die Fussleiste immer als „Mo + Di geschlossen"
 *   zeigt. Ein Sonderhinweis für diese zwei Tage ist überflüssig.
 *
 * KEIN FOTO GEPLANT (Stand 2026-07-26). Der Betreiber hat den Azzurro-Verlauf
 * allein für ausreichend befunden. `HOLIDAY_IMAGE` bleibt als Erweiterungspunkt
 * stehen, falls sich das ändert — sonst nichts weiter zu tun.
 */

/** Pfad zum Urlaubsmotiv. `null` = kein Foto geplant; siehe Docblock oben. */
const HOLIDAY_IMAGE: string | null = null;

/**
 * Erster Tag der Schliessung, letzter geschlossener Tag, erster Tag zurück.
 *
 * Als ISO-Datum gehalten, nicht als Fliesstext, damit die Wochentage aus dem
 * Datum abgeleitet und nicht danebengeschrieben werden — genau der Fehler, der
 * die erste Fassung dieses Banners mit einem Montag statt eines Mittwochs
 * erreicht hat.
 */
const CLOSED_FROM = "2026-08-03";
const CLOSED_UNTIL = "2026-08-23";
const REOPEN = "2026-08-26";

/**
 * MASTER-SCHALTER. Auf `false` setzen, um NUR DIESES BANNER sofort
 * auszublenden. Wirkt NICHT auf die Unterdrückung von Bestell-/Sonntagsbanner
 * unten — die folgt ausschliesslich dem Zeitfenster (`isSummerClosureWindow`),
 * unabhängig davon, ob die Ankündigung selbst gerade sichtbar ist. Ein Gast
 * soll nie "jetzt bestellen" lesen, während die Küche tatsächlich zu hat, nur
 * weil jemand die Ankündigungs-Kachel abgeschaltet hat.
 */
const BANNER_ENABLED = true;

/**
 * Beginn der Sichtbarkeit: Montag, 3. August 2026, 00:00 Europe/Berlin
 * (CEST = UTC+2) — exakt der Beginn der Schliessung, keine Lücke.
 */
const BANNER_VISIBLE_FROM = new Date("2026-08-03T00:00:00+02:00").getTime();

/**
 * Cutoff: Beginn von Montag, 24. August 2026, Europe/Berlin (CEST = UTC+2).
 * Bewusst VOR der Wiedereröffnung (26. August), nicht danach — siehe Docblock
 * oben: die letzten zwei geschlossenen Tage sind ohnehin Standard-Ruhetage.
 */
const BANNER_EXPIRES_AT = new Date("2026-08-24T00:00:00+02:00").getTime();

/**
 * Reine Datumsfrage, ohne `BANNER_ENABLED` — bewusst getrennt, siehe Kommentar
 * dort. Exportiert, weil `page.tsx` dieselbe Grenze braucht, um Bestell- und
 * Sonntagsbanner während der Schliessung zu unterdrücken. Eine Zeitquelle,
 * zwei Konsumenten, statt zweier separat gepflegter Daten.
 */
export function isSummerClosureWindow(): boolean {
  const now = Date.now();
  return now >= BANNER_VISIBLE_FROM && now < BANNER_EXPIRES_AT;
}

const WOCHENTAGE = [
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
  "Sonntag",
];
const MONATE = [
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

/** "2026-08-26" -> { wochentag: "Mittwoch", datum: "26. August" } */
function zerlege(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  // UTC, damit die Zeitzone des Servers den Wochentag nicht verschiebt.
  const dt = new Date(Date.UTC(y, m - 1, d));
  return {
    wochentag: WOCHENTAGE[(dt.getUTCDay() + 6) % 7],
    datum: `${d}. ${MONATE[m - 1]}`,
  };
}

/**
 * Azzurro — italienisches Meeresblau, bewusst eine Ausnahme von der warmen
 * Tavola-Palette (Salmon/Marinara/Olive), die den Rest der Website trägt.
 * Betreiber-Entscheidung 2026-07-26: für eine "wir sind im Urlaub"-Anzeige
 * passt Meer und Himmel besser als Terracotta.
 *
 * Die drei Töne sind absichtlich dunkel genug gehalten, dass weisser Text
 * überall im Verlauf über 4,5:1 Kontrast bleibt (WCAG AA) — ein hellerer
 * dritter Ton wurde geprüft und verworfen (~2,8:1, durchgefallen).
 */
const AZZURRO_GRADIENT =
  "linear-gradient(120deg, #0B3D5C 0%, #145C7A 55%, #1B6B93 100%)";
const AZZURRO_FALLBACK = "#123C5A";

export function HolidayBanner({
  forcePreview = false,
}: {
  /**
   * Umgeht den Master-Schalter UND das Zeitfenster — NUR für /sandbox. Ohne
   * das würde die Vorschauseite selbst nichts mehr zeigen, sobald das
   * Zeitfenster wirkt: eine Vorschau, die sich wegdatiert, ist keine Vorschau
   * mehr. Dieselbe Idee wie das `partners`-Prop in DeliveryBanner für die
   * (inzwischen entfernte) A/B-Fläche.
   */
  forcePreview?: boolean;
} = {}) {
  if (!forcePreview && (!BANNER_ENABLED || !isSummerClosureWindow())) {
    return null;
  }

  const von = zerlege(CLOSED_FROM);
  const bis = zerlege(CLOSED_UNTIL);
  const zurueck = zerlege(REOPEN);

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: AZZURRO_FALLBACK }}
      aria-label="Betriebsferien"
    >
      {HOLIDAY_IMAGE ? (
        <Image
          src={HOLIDAY_IMAGE}
          alt=""
          fill
          priority
          className="object-cover"
          style={{ opacity: 0.38 }}
          sizes="100vw"
        />
      ) : (
        // Platzhalter, solange kein Motiv geliefert ist — ein ruhiger Verlauf
        // statt eines kaputten Bildes.
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: AZZURRO_GRADIENT }}
        />
      )}

      <div className="relative mx-auto max-w-6xl px-6 py-10 text-center sm:px-12 sm:py-14">
        <p
          className="font-display text-lg italic sm:text-xl"
          style={{ color: "#FEF1A5" }}
        >
          Arrivederci &mdash; ci vediamo presto!
        </p>
        <h2
          className="mt-2 text-2xl font-bold sm:text-3xl"
          style={{ color: "#FAFAFA" }}
        >
          Wir machen Sommerpause
        </h2>
        <p
          className="mx-auto mt-3 max-w-xl text-sm leading-relaxed sm:text-base"
          style={{ color: "#FAFAFA" }}
        >
          Vom{" "}
          <strong>
            {von.wochentag}, {von.datum}
          </strong>{" "}
          bis{" "}
          <strong>
            {bis.wochentag}, {bis.datum}
          </strong>{" "}
          bleibt unsere Küche kalt &mdash; wir tanken Sonne in Italien.
        </p>
        <p
          className="mt-4 inline-block rounded-full px-5 py-2 text-sm font-semibold sm:text-base"
          style={{ backgroundColor: "#FEF1A5", color: "#1A1612" }}
        >
          Wieder für Sie da ab {zurueck.wochentag}, {zurueck.datum}
        </p>
      </div>
    </section>
  );
}
