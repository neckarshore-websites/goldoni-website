import Image from "next/image";

/**
 * HolidayBanner — Ankündigung der Sommerschliessung.
 *
 * LIVE auf der Startseite seit 2026-07-26, auf ausdrücklichen Wunsch des
 * Betreibers — er wollte es einmal in der echten Umgebung sehen, bevor die
 * Schliessung überhaupt beginnt. Zusätzlich weiterhin auf /sandbox zu sehen.
 * Zum Abschalten: `BANNER_ENABLED` unten auf `false`.
 *
 * Warum eine eigene Komponente und kein Umbau des SundayBanner: die beiden
 * schliessen sich zeitlich aus. Der Sonntagsstreifen läuft bis einschliesslich
 * Sonntag, 2. August; die Schliessung beginnt am Montag, 3. August. Es steht
 * also nie beides gleichzeitig da, und zwei kurze Komponenten mit je einem
 * Ablaufdatum sind ehrlicher als eine mit einer Fallunterscheidung.
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
 * NOCH OFFEN: DAS BILD. `HOLIDAY_IMAGE` zeigt auf eine Datei, die es noch
 * nicht gibt — der Betreiber liefert ein Urlaubsmotiv nach. Solange sie
 * fehlt, rendert die Komponente den unten stehenden Azzurro-Farbverlauf statt
 * eines kaputten Bildes. Motiv da: nach public/images/ legen, Pfad hier
 * setzen, fertig — vorher als WebP (siehe /assets zur Begründung).
 */

/** Pfad zum Urlaubsmotiv. `null`, solange der Betreiber keines geliefert hat. */
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
 * MASTER-SCHALTER. Auf `false` setzen, um das Banner sofort auszublenden —
 * unabhängig vom Ablaufdatum unten. Zurück auf `true`, um es wieder zu zeigen.
 */
const BANNER_ENABLED = true;

/**
 * Cutoff: Beginn von Montag, 24. August 2026, Europe/Berlin (CEST = UTC+2).
 * Bewusst VOR der Wiedereröffnung (26. August), nicht danach — siehe Docblock
 * oben: die letzten zwei geschlossenen Tage sind ohnehin Standard-Ruhetage.
 */
const BANNER_EXPIRES_AT = new Date("2026-08-24T00:00:00+02:00").getTime();

function bannerHasExpired(): boolean {
  return Date.now() >= BANNER_EXPIRES_AT;
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

export function HolidayBanner() {
  if (!BANNER_ENABLED || bannerHasExpired()) return null;

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
