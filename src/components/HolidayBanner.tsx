import Image from "next/image";

/**
 * HolidayBanner — Ankündigung der Sommerschliessung.
 *
 * ENTWURF, noch nicht auf einer öffentlichen Seite eingebunden. Zu sehen auf
 * der internen /sandbox.
 *
 * Warum eine eigene Komponente und kein Umbau des SundayBanner: die beiden
 * schliessen sich zeitlich aus. Der Sonntagsstreifen läuft bis einschliesslich
 * Sonntag, 2. August; die Schliessung beginnt am Montag, 3. August. Es steht
 * also nie beides gleichzeitig da, und zwei kurze Komponenten mit je einem
 * Ablaufdatum sind ehrlicher als eine mit einer Fallunterscheidung.
 *
 * ZWEI DINGE FEHLEN NOCH:
 *
 * 1. DAS BILD. `HOLIDAY_IMAGE` zeigt auf eine Datei, die es noch nicht gibt —
 *    der Betreiber liefert ein Urlaubsmotiv nach. Solange sie fehlt, rendert
 *    die Komponente einen ruhigen Farbverlauf statt eines kaputten Bildes.
 *    Wenn das Motiv da ist: nach public/images/ legen, hier den Pfad setzen,
 *    fertig. Vorher als WebP konvertieren (siehe /assets zur Begründung —
 *    Hero-PNGs kosten LCP-Budget auf Mobil).
 *
 * 2. DAS WIEDERERÖFFNUNGSDATUM IST UNBESTÄTIGT. Der Betreiber nannte
 *    „ab Mittwoch, den 24.". Der 24. August 2026 ist ein MONTAG, und montags
 *    ist ohnehin Ruhetag. Nach der Schliessung bis Sonntag, 23. folgen Montag
 *    24. und Dienstag 25. als reguläre Ruhetage — der erste Tag zurück wäre
 *    damit MITTWOCH, DER 26. AUGUST. Der Wochentag stimmt, die Zahl nicht.
 *    Unten steht die abgeleitete Fassung; sie gehört bestätigt, bevor das
 *    Banner öffentlich wird. Ein falsches Datum hier heisst Gäste vor
 *    verschlossener Tür.
 */

/** Pfad zum Urlaubsmotiv. `null`, solange der Betreiber keines geliefert hat. */
const HOLIDAY_IMAGE: string | null = null;

/**
 * Erster Tag der Schliessung und erster Tag zurück.
 *
 * Als ISO-Datum gehalten, nicht als Fliesstext, damit die Wochentage aus dem
 * Datum abgeleitet und nicht danebengeschrieben werden — genau der Fehler, der
 * diesen Entwurf mit einem Montag statt eines Mittwochs erreicht hat.
 */
const CLOSED_FROM = "2026-08-03";
const CLOSED_UNTIL = "2026-08-23";
const REOPEN = "2026-08-26";

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

export function HolidayBanner() {
  const von = zerlege(CLOSED_FROM);
  const bis = zerlege(CLOSED_UNTIL);
  const zurueck = zerlege(REOPEN);

  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: "#8E2800" }}
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
          style={{
            background:
              "linear-gradient(120deg, #8E2800 0%, #B64926 55%, #746B03 100%)",
          }}
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
