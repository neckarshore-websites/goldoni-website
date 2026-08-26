import { ZEILEN, istBelegt, type Zeile } from "@/lib/bild-herkunft";

/**
 * Zeigt das Bild-Herkunfts-Register an. Die Daten liegen seit dem 26.08.2026
 * in `src/lib/bild-herkunft.ts` und NICHT mehr hier — dieser Baustein stellt
 * sie nur dar.
 *
 * WARUM DER UMZUG: die Liste war eine von Hand gepflegte Momentaufnahme in
 * einer .tsx-Datei. Ein neues Hero-Bild hätte sie still veralten lassen, und
 * aus fünf undokumentierten Bildern wären unbemerkt sechs geworden. Als
 * eigenes Datenmodul kann `tests/delivery/bild-herkunft.test.ts` sie gegen die
 * tatsächlichen Bildreferenzen im Quelltext halten, in beide Richtungen.
 *
 * Die Rechtsfrage steht weiterhin ausdrücklich NICHT hier: ob und welche
 * dieser Bilder gekennzeichnet werden müssen, ist eine Bewertung und als
 * Auftrag an den DPO vorgemerkt. Diese Tabelle liefert die Tatsachen dafür.
 */

const LABEL: Record<Zeile["herkunft"], string> = {
  ki: "KI-erzeugt",
  foto: "Echtes Foto",
  offen: "nicht dokumentiert",
};

/**
 * Was in der Nachweis-Spalte steht. Ein Gedankenstrich bei einer offenen Zeile
 * ist eine Aussage, kein Platzhalter: dort IST nichts dokumentiert, und das ist
 * der Fund, den diese Tabelle festhält.
 */
function nachweisText(z: Zeile): string {
  if (!istBelegt(z.nachweis)) return "—";
  const n = z.nachweis!;
  return [n.werkzeug, n.erzeugt, n.rechte].filter(Boolean).join(" · ") || "dokumentiert";
}

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
        geschätzt — und seit dem 26. August durch eine Pflichtprüfung gehalten,
        die das Register in beide Richtungen gegen den Quelltext abgleicht. Anlass sind die seit dem 2. August 2026 geltenden
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
              {["Datei", "Wo sie erscheint", "Herkunft", "Nachweis"].map((h) => (
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
                <td
                  className="py-2 pl-4 text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {nachweisText(z)}
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
