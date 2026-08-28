import Image from "next/image";
import { AssetsNav, type AssetsNavKey } from "@/components/AssetsNav";
import { STOREFRONT_PARTNER } from "@/lib/site";

/**
 * Gemeinsames Gerüst der beiden Drucksachen-Seiten unter /assets.
 *
 * Zweck: den Stand einer Drucksache an EINER Stelle zeigen — beide Seiten
 * als Bild, die Masse zum Weitergeben an die Druckerei, die offenen Punkte,
 * und die Dateien zum Herunterladen. Bis hierher lag das in docs/ und war
 * nur im Repository sichtbar.
 *
 * Die Bilder liegen unter public/assets/print und sind damit über ihre
 * Adresse erreichbar. Das ist Absicht: sie sollen sich weitergeben lassen.
 * Die Seite selbst trägt noindex und steht in robots.ts unter /assets.
 */
export type PrintSide = {
  label: string;
  caption: string;
  /** Bilddatei — fuer Motive, die (noch) als Export vorliegen. */
  src?: string;
  alt?: string;
  /**
   * Motiv als HTML. Seit 2026-08-25 der bevorzugte Weg: kein Umweg ueber
   * PDF-Export und JPG-Zuschnitt, und damit auch keine Gelegenheit, dass
   * Anzeige und Quelle auseinanderlaufen.
   */
  node?: React.ReactNode;
};

export type PrintSpecPageProps = {
  navKey: AssetsNavKey;
  eyebrow: string;
  title: string;
  intro: string;
  status: string;
  /**
   * Eine oder zwei Seiten. Der Briefumschlag ist 1/0 bedruckt — es GIBT
   * keine zweite Seite, und eine leere Kachel dafuer waere eine Luege ueber
   * das Produkt.
   */
  sides: PrintSide[];
  specs: Array<[string, string]>;
  decisions: Array<{ title: string; body: string }>;
  openPoints: string[];
  /**
   * Dateien zum Herunterladen.
   *
   * `group` trennt, was die Druckerei bekommt, von dem, was nur uns gehoert —
   * Herleitung, Originalvorlagen der Druckerei, Bilder zum Weitergeben. Ohne
   * die Trennung steht die eine Datei, die wirklich in den Auftrag geht,
   * zwischen sechs anderen, die in der Liste gleich aussehen; genau so waehlt
   * jemand unter Zeitdruck die falsche aus. Optional: Seiten ohne `group`
   * rendern unveraendert als eine Liste ohne Zwischenueberschrift.
   */
  downloads: Array<{ href: string; label: string; hint: string; group?: string }>;
  /**
   * Reihenfolge und Beschriftung der Gruppen. Nur hier genannte Gruppen
   * bekommen eine Ueberschrift; Dateien ohne `group` stehen davor.
   */
  downloadGroups?: Array<{ key: string; title: string; note?: string }>;
  /**
   * Text fuer das Hinweisfeld der Bestellung. Bewusst als <pre> gerendert und
   * nicht als Fliesstext: er ist zum Kopieren da, nicht zum Lesen, und ein
   * umgebrochener Farbwert ist ein falscher Farbwert.
   */
  printerNote?: string;
  /** Bildseitenverhältnis, damit Next/Image nicht springt. */
  aspect: { w: number; h: number };
  /**
   * Staffelpreise der Druckerei. Der Stückpreis wird gerechnet, nicht
   * abgetippt — und die Sprungstellen werden markiert: bei diesem Anbieter
   * kostet die Stufe UNTER einer runden Zahl oft fast dasselbe wie die
   * runde selbst, was jede Bestellung dazwischen unvernünftig macht.
   */
  prices?: {
    caption: string;
    note?: string;
    rows: Array<{ qty: number; net: number; pick?: boolean }>;
  };
};

export function PrintSpecPage({
  navKey,
  eyebrow,
  title,
  intro,
  status,
  sides,
  specs,
  decisions,
  openPoints,
  downloads,
  downloadGroups,
  printerNote,
  prices,
  aspect,
}: PrintSpecPageProps) {
  const fmt = (n: number) =>
    n.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (
    <main className="px-6 py-12 sm:px-12">
      <div className="mx-auto max-w-4xl">
        <AssetsNav current={navKey} />

        <header className="mt-10">
          <p
            className="mb-3 text-xs uppercase tracking-[0.2em]"
            style={{ color: "var(--color-brand-olive)" }}
          >
            {eyebrow}
          </p>
          <h1
            className="mb-4 text-4xl sm:text-5xl"
            style={{ color: "var(--color-text)" }}
          >
            {title}
          </h1>
          <p
            className="max-w-2xl text-lg leading-relaxed"
            style={{ color: "var(--color-text-muted)" }}
          >
            {intro}
          </p>
          <p
            className="mt-4 inline-block rounded-full border px-3 py-1 text-sm"
            style={{
              borderColor: "var(--color-border-strong)",
              color: "var(--color-text-muted)",
            }}
          >
            {status}
          </p>
        </header>

        <section
          className={`mt-12 grid gap-6 ${
            sides.length > 1 ? "sm:grid-cols-2" : "sm:max-w-2xl"
          }`}
        >
          {sides.map((side) => (
            <figure key={side.label} className="m-0">
              <div
                className="overflow-hidden rounded-lg border"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "#FFFFFF",
                }}
              >
                {side.node ?? (
                  <Image
                    src={side.src as string}
                    alt={side.alt ?? ""}
                    width={aspect.w}
                    height={aspect.h}
                    className="h-auto w-full"
                  />
                )}
              </div>
              <figcaption
                className="mt-2 text-sm"
                style={{ color: "var(--color-text-muted)" }}
              >
                <span
                  className="font-medium"
                  style={{ color: "var(--color-text)" }}
                >
                  {side.label}
                </span>{" "}
                — {side.caption}
              </figcaption>
            </figure>
          ))}
        </section>

        <section className="mt-14">
          <h2
            className="mb-4 text-2xl"
            style={{ color: "var(--color-text)" }}
          >
            Masse und Material
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <tbody>
                {specs.map(([k, v]) => (
                  <tr
                    key={k}
                    className="border-b"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <th
                      scope="row"
                      className="py-2.5 pr-6 text-left font-normal align-top"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {k}
                    </th>
                    <td
                      className="py-2.5 text-left tabular-nums"
                      style={{ color: "var(--color-text)" }}
                    >
                      {v}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-14">
          <h2
            className="mb-4 text-2xl"
            style={{ color: "var(--color-text)" }}
          >
            Bewusst so gemacht
          </h2>
          <ul className="space-y-4">
            {decisions.map((d) => (
              <li key={d.title}>
                <p
                  className="font-medium"
                  style={{ color: "var(--color-text)" }}
                >
                  {d.title}
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {d.body}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14">
          <h2
            className="mb-4 text-2xl"
            style={{ color: "var(--color-text)" }}
          >
            Vor dem Druck offen
          </h2>
          <ul
            className="ml-5 list-disc space-y-2 text-sm leading-relaxed"
            style={{ color: "var(--color-text-muted)" }}
          >
            {openPoints.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </section>

        {prices ? (
          <section className="mt-14">
            <h2
              className="mb-2 text-2xl"
              style={{ color: "var(--color-text)" }}
            >
              Preise
            </h2>
            <p
              className="mb-4 max-w-2xl text-sm leading-relaxed"
              style={{ color: "var(--color-text-muted)" }}
            >
              {prices.caption}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th
                      className="border-b py-2 pr-4 text-left text-xs uppercase tracking-wider"
                      style={{
                        borderColor: "var(--color-border)",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      Auflage
                    </th>
                    <th
                      className="border-b py-2 pr-4 text-right text-xs uppercase tracking-wider"
                      style={{
                        borderColor: "var(--color-border)",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      Netto
                    </th>
                    <th
                      className="border-b py-2 text-right text-xs uppercase tracking-wider"
                      style={{
                        borderColor: "var(--color-border)",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      Pro Stück
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {prices.rows.map((r) => (
                    <tr
                      key={r.qty}
                      className="border-b"
                      style={{
                        borderColor: "var(--color-border)",
                        backgroundColor: r.pick
                          ? "var(--color-brand-cream)"
                          : undefined,
                      }}
                    >
                      <td
                        className="py-2 pr-4 tabular-nums"
                        style={{ color: "var(--color-text)" }}
                      >
                        {r.qty.toLocaleString("de-DE")} Stück
                        {r.pick ? (
                          <span
                            className="ml-2 text-xs font-medium"
                            style={{ color: "var(--color-accent)" }}
                          >
                            empfohlen
                          </span>
                        ) : null}
                      </td>
                      <td
                        className="py-2 pr-4 text-right tabular-nums"
                        style={{ color: "var(--color-text)" }}
                      >
                        {fmt(r.net)} €
                      </td>
                      <td
                        className="py-2 text-right tabular-nums"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {fmt((r.net / r.qty) * 100)} ct
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {prices.note ? (
              <p
                className="mt-4 max-w-2xl text-sm leading-relaxed"
                style={{ color: "var(--color-text-muted)" }}
              >
                {prices.note}
              </p>
            ) : null}
          </section>
        ) : null}

        {printerNote ? (
          <section className="mt-14">
            <h2
              className="mb-2 text-2xl"
              style={{ color: "var(--color-text)" }}
            >
              Hinweise für die Druckerei
            </h2>
            <p
              className="mb-4 max-w-2xl text-sm leading-relaxed"
              style={{ color: "var(--color-text-muted)" }}
            >
              Zum Kopieren in das Hinweisfeld der Bestellung. Es ersetzt keinen
              Proof — es sorgt dafür, dass die automatische Umrechnung nicht
              alleine entscheidet, wie die beiden Vollton-Flächen und der
              QR-Code aussehen.
            </p>
            <pre
              className="overflow-x-auto rounded-lg border p-4 text-xs leading-relaxed"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-blanc-bg)",
                color: "var(--color-text)",
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
                whiteSpace: "pre-wrap",
              }}
            >
              {printerNote}
            </pre>
          </section>
        ) : null}

        <section className="mt-14">
          <h2
            className="mb-4 text-2xl"
            style={{ color: "var(--color-text)" }}
          >
            Dateien
          </h2>
          {(() => {
            const zeile = (d: (typeof downloads)[number]) => (
              <li key={d.href}>
                <a
                  href={d.href}
                  download
                  className="font-medium underline"
                  style={{ color: "var(--color-accent)" }}
                >
                  {d.label}
                </a>
                <span
                  className="ml-2 text-sm"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {d.hint}
                </span>
              </li>
            );
            const gruppen = downloadGroups ?? [];
            const ohne = downloads.filter((d) => !d.group || !gruppen.some((g) => g.key === d.group));
            return (
              <>
                {ohne.length > 0 ? <ul className="space-y-3">{ohne.map(zeile)}</ul> : null}
                {gruppen.map((g) => {
                  const dateien = downloads.filter((d) => d.group === g.key);
                  if (dateien.length === 0) return null;
                  return (
                    <div key={g.key} className="mt-8 first:mt-0">
                      <h3
                        className="text-sm font-semibold uppercase tracking-wider"
                        style={{ color: "var(--color-text)" }}
                      >
                        {g.title}
                      </h3>
                      {g.note ? (
                        <p className="mb-3 mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>
                          {g.note}
                        </p>
                      ) : (
                        <div className="mb-3" />
                      )}
                      <ul className="space-y-3">{dateien.map(zeile)}</ul>
                    </div>
                  );
                })}
              </>
            );
          })()}
        </section>

        <p
          className="mt-14 text-sm leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          Der QR-Code beider Drucksachen wird aus derselben Konstante erzeugt
          wie der Bestellknopf der Website und nach dem Erzeugen wieder
          eingelesen. Ziel:{" "}
          <a
            href={STOREFRONT_PARTNER.url}
            target="_blank"
            rel="noopener"
            className="underline"
            style={{ color: "var(--color-accent)" }}
          >
            die eigene Bestellseite
          </a>
          .
        </p>
      </div>
    </main>
  );
}
