/**
 * Inventur der Bild-Herkunft auf den öffentlichen Seiten.
 *
 * ANLASS: seit dem 2. August 2026 gelten die Transparenzpflichten der
 * KI-Verordnung (Artikel 50). Eine pauschale Kennzeichnungspflicht für alle
 * KI-Bilder gibt es nicht — die Pflicht greift bei Inhalten, die Reales
 * täuschend echt darstellen. Ob unsere Bilder darunterfallen, ist eine
 * juristische Bewertung und steht ausdrücklich NICHT hier: sie ist als
 * Auftrag an den DPO vorgemerkt.
 *
 * Was hier steht, ist die Tatsachengrundlage dafür — und die ist unabhängig
 * von jeder Rechtsfrage nützlich: welches Bild auf welcher Seite stammt
 * woher.
 *
 * ERHOBEN AM 2026-08-25 durch Auswertung aller Bildpfade in src/ (ohne
 * /assets und /sandbox) gegen die Liste unten. Nicht geschätzt.
 */

type Zeile = {
  datei: string;
  seite: string;
  herkunft: "ki" | "foto" | "offen";
};

/**
 * Die fünf `offen`-Zeilen sind der eigentliche Fund. Sie sind NICHT
 * "vermutlich KI" — sie sind undokumentiert, und dazu gehört ausgerechnet
 * die Startseiten-Bildfolge und das Vorschaubild, das beim Teilen der Seite
 * erscheint. Ein Rateergebnis hier einzutragen wäre schlimmer als die Lücke.
 */
const ZEILEN: Zeile[] = [
  { datei: "hero-goldoni-velvet.webp", seite: "Startseite (Bildfolge) + Vorschaubild beim Teilen", herkunft: "offen" },
  { datei: "hero-goldoni-interior.webp", seite: "Startseite (Bildfolge) + strukturierte Daten", herkunft: "offen" },
  { datei: "hero-goldoni-angel.webp", seite: "Startseite (Bildfolge)", herkunft: "offen" },
  { datei: "hero-impressum-trauben.webp", seite: "Impressum", herkunft: "offen" },
  { datei: "hero-kontakt-pizzo.webp", seite: "Kontakt", herkunft: "offen" },
  { datei: "hero-menu-dishes.webp", seite: "Speisekarte + strukturierte Daten", herkunft: "ki" },
  { datei: "hero-empfehlungen-overhead-tafel.webp", seite: "Empfehlungskarte", herkunft: "ki" },
  { datei: "hero-feiern-saal.webp", seite: "Feste feiern (Hero)", herkunft: "foto" },
  { datei: "feiern-saal-bogenfenster-tafel.webp", seite: "Feste feiern (Galerie)", herkunft: "foto" },
  { datei: "feiern-kandelaber-rosen-lilien.webp", seite: "Feste feiern (Galerie)", herkunft: "foto" },
  { datei: "feiern-tafel-aus-naehe.webp", seite: "Feste feiern (Galerie)", herkunft: "foto" },
  { datei: "feiern-saal-historische-banner.webp", seite: "Feste feiern (Galerie)", herkunft: "foto" },
];

const LABEL: Record<Zeile["herkunft"], string> = {
  ki: "KI-erzeugt",
  foto: "Echtes Foto",
  offen: "nicht dokumentiert",
};

export function BildHerkunftInventur() {
  const offen = ZEILEN.filter((z) => z.herkunft === "offen").length;
  const ki = ZEILEN.filter((z) => z.herkunft === "ki").length;
  const foto = ZEILEN.filter((z) => z.herkunft === "foto").length;

  return (
    <section
      className="mb-16 rounded-lg border p-6"
      style={{
        borderColor: "var(--color-border)",
        backgroundColor: "var(--color-bg)",
      }}
    >
      <h2 className="mb-2 text-2xl" style={{ color: "var(--color-text)" }}>
        Bild-Herkunft auf den öffentlichen Seiten
      </h2>
      <p
        className="mb-4 max-w-3xl text-sm leading-relaxed"
        style={{ color: "var(--color-text-muted)" }}
      >
        Erhoben am 25. August 2026 aus allen Bildpfaden im Quelltext, nicht
        geschätzt. Anlass sind die seit dem 2. August 2026 geltenden
        Transparenzpflichten der KI-Verordnung. <strong>Ob und welche dieser
        Bilder gekennzeichnet werden müssen, ist eine juristische Bewertung
        und steht hier bewusst nicht</strong> — sie ist als Auftrag an den
        Datenschutzbeauftragten vorgemerkt. Diese Tabelle liefert die
        Tatsachen dafür.
      </p>

      <p
        className="mb-4 text-sm"
        style={{ color: "var(--color-text)" }}
      >
        {ZEILEN.length} Bilder live: {foto} echte Fotos, {ki} KI-erzeugt,{" "}
        <strong style={{ color: "var(--color-accent)" }}>
          {offen} ohne dokumentierte Herkunft
        </strong>
        .
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              {["Datei", "Wo sie erscheint", "Herkunft"].map((h) => (
                <th
                  key={h}
                  className="border-b py-2 pr-4 text-left text-xs uppercase tracking-wider"
                  style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ZEILEN.map((z) => (
              <tr
                key={z.datei}
                className="border-b"
                style={{ borderColor: "var(--color-border)" }}
              >
                <td
                  className="py-2 pr-4 font-mono text-xs"
                  style={{ color: "var(--color-text)" }}
                >
                  {z.datei}
                </td>
                <td className="py-2 pr-4" style={{ color: "var(--color-text-muted)" }}>
                  {z.seite}
                </td>
                <td className="py-2">
                  <span
                    className="whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium"
                    style={
                      z.herkunft === "offen"
                        ? {
                            backgroundColor: "var(--color-accent)",
                            color: "var(--color-bg)",
                          }
                        : {
                            border: "1px solid var(--color-border-strong)",
                            color: "var(--color-text-muted)",
                          }
                    }
                  >
                    {LABEL[z.herkunft]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p
        className="mt-4 max-w-3xl text-sm leading-relaxed"
        style={{ color: "var(--color-text-muted)" }}
      >
        <strong style={{ color: "var(--color-text)" }}>
          Der Fund sind die fünf offenen Zeilen.
        </strong>{" "}
        Sie stehen nicht in der Asset-Liste unten und tragen deshalb weder
        Prompt noch Notiz — darunter die gesamte Startseiten-Bildfolge und das
        Bild, das beim Teilen der Seite als Vorschau erscheint. Ihre Herkunft
        ist damit aus dem Repository nicht rekonstruierbar. Sie hier zu raten
        wäre schlimmer als die Lücke: die Frage, die beantwortet werden soll,
        lautet gerade, welche Bilder KI-erzeugt sind.
      </p>
    </section>
  );
}
