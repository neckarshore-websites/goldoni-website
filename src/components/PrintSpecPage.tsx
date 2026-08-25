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
  src: string;
  alt: string;
};

export type PrintSpecPageProps = {
  navKey: AssetsNavKey;
  eyebrow: string;
  title: string;
  intro: string;
  status: string;
  sides: [PrintSide, PrintSide];
  specs: Array<[string, string]>;
  decisions: Array<{ title: string; body: string }>;
  openPoints: string[];
  downloads: Array<{ href: string; label: string; hint: string }>;
  /** Bildseitenverhältnis, damit Next/Image nicht springt. */
  aspect: { w: number; h: number };
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
  aspect,
}: PrintSpecPageProps) {
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

        <section className="mt-12 grid gap-6 sm:grid-cols-2">
          {sides.map((side) => (
            <figure key={side.label} className="m-0">
              <div
                className="overflow-hidden rounded-lg border"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "#FFFFFF",
                }}
              >
                <Image
                  src={side.src}
                  alt={side.alt}
                  width={aspect.w}
                  height={aspect.h}
                  className="h-auto w-full"
                />
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

        <section className="mt-14">
          <h2
            className="mb-4 text-2xl"
            style={{ color: "var(--color-text)" }}
          >
            Dateien
          </h2>
          <ul className="space-y-3">
            {downloads.map((d) => (
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
            ))}
          </ul>
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
