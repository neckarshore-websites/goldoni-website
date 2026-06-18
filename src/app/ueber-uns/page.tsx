import Link from "next/link";
import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { PageHero } from "@/components/PageHero";
import { StructuredData } from "@/components/StructuredData";
import { pageMetadata } from "@/lib/page-metadata";
import { breadcrumbJsonLd, personJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = pageMetadata({
  title: "Über uns",
  description:
    "Silvio Brunetti führt das Ristorante Goldoni im Stuttgarter Westen — italienische Gastlichkeit mit Herz, gehobene Küche zu angemessenen Preisen, im denkmalgeschützten Jugendstil-Haus von 1905/06.",
  path: "/ueber-uns",
  ogImage: {
    url: "/images/hero-goldoni-interior.webp",
    alt: "Gastraum des Ristorante Goldoni mit historischer Holzvertäfelung",
  },
});

export default function UeberUns() {
  return (
    <main>
      {/* E-E-A-T: named host (Person) + breadcrumb. Native ld+json via
          StructuredData so it lands in the SSR HTML for crawlers. */}
      <StructuredData data={personJsonLd()} />
      <StructuredData
        data={breadcrumbJsonLd([{ name: "Über uns", path: "/ueber-uns" }])}
      />

      <PageHero
        src="/images/hero-goldoni-interior.webp"
        alt="Gastraum des Ristorante Goldoni mit historischer Holzvertäfelung"
      />

      {/* Intro — eyebrow + H1 + lead. The lead doubles as the
          citable summary passage for AI answer engines. */}
      <section className="px-6 pt-16 pb-6 sm:px-12 sm:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <p
            className="mb-3 text-xs uppercase tracking-[0.25em]"
            style={{ color: "var(--color-brand-olive)" }}
          >
            Ristorante Goldoni
          </p>
          <h1
            className="mb-6 text-4xl sm:text-5xl"
            style={{ color: "var(--color-heading-italian)" }}
          >
            Über uns
          </h1>
          <p
            className="mx-auto max-w-2xl text-lg leading-relaxed"
            style={{ color: "var(--color-text-muted)" }}
          >
            Im Mittelpunkt des Goldoni steht der Mensch — der Gast. Drumherum:
            gehobene italienische Küche zu angemessenen Preisen, eigens
            kuratierte Weine und ein Haus mit über 120 Jahren Gastgeschichte.
          </p>
        </div>
      </section>

      {/* Ihr Gastgeber */}
      <section className="px-6 py-12 sm:px-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <h2
            className="mb-6 text-2xl sm:text-3xl"
            style={{ color: "var(--color-heading-italian)" }}
          >
            Ihr Gastgeber
          </h2>
          <div
            className="space-y-4 text-base leading-relaxed sm:text-lg"
            style={{ color: "var(--color-text)" }}
          >
            <p>
              Das Goldoni führt Silvio Brunetti — Italiener mit Leib und Seele,
              mit ganzem Herzen und voller Stolz. Diese Leidenschaft trägt das
              Haus: Er kennt seine Stammgäste mit Namen, hört zu und liest, was
              jemand gerade braucht — einen ruhigen Tisch, eine Empfehlung oder
              einfach ein offenes Ohr.
            </p>
            <p>
              Seine Gastfreundschaft kommt ohne Aufhebens aus. Niemand wird
              überredet, nichts wird verkauft — bei Silvio soll man einfach gut
              essen und sich wohlfühlen. Ein Abend, der von selbst leicht wird.
            </p>
          </div>
        </div>
      </section>

      {/* Ein Haus mit Geschichte — marinara editorial band */}
      <section
        className="px-6 py-20 sm:px-12 sm:py-24"
        style={{
          backgroundColor: "var(--color-bg-marinara)",
          color: "var(--color-on-marinara)",
        }}
      >
        <div className="mx-auto max-w-3xl">
          <p
            className="mb-3 text-xs uppercase tracking-[0.25em]"
            style={{ color: "var(--color-on-marinara-muted)" }}
          >
            Das Haus
          </p>
          <h2 className="mb-6 text-2xl sm:text-3xl">Ein Haus mit Geschichte</h2>
          <div className="space-y-4 text-base leading-relaxed sm:text-lg">
            <p>
              Das Goldoni hat ein außergewöhnliches Zuhause gefunden. Das
              Gebäude in der Reinsburgstraße 151 wurde 1905/06 vom Architekten
              F. Dienstbach als „Mietshaus mit Gastwirtschaft“ im Stil von
              Historismus und Jugendstil errichtet — von Anfang an für die
              Gastronomie bestimmt und heute denkmalgeschützt.
            </p>
            <p>
              Das markante dunkle Holz, die Vertäfelungen und der gemütliche
              Raumzuschnitt sind erhalten geblieben. Das Goldoni hat dieses Erbe
              bewahrt und mit italienischer Wärme verbunden. So sitzt man hier
              in Räumen, in denen im Stuttgarter Westen seit über 120 Jahren
              bewirtet wird.
            </p>
          </div>
          <p
            className="mt-6 text-sm"
            style={{ color: "var(--color-on-marinara-muted)" }}
          >
            Quelle:{" "}
            <a
              href="https://ags-s.de/wp-content/uploads/2022/02/Liste_Denkmaeler_Stuttgart-1.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:opacity-90"
            >
              Denkmalliste der Stadt Stuttgart
            </a>
          </p>
        </div>
      </section>

      {/* Küche, Wein & Empfehlungen */}
      <section className="px-6 py-16 sm:px-12 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2
            className="mb-6 text-2xl sm:text-3xl"
            style={{ color: "var(--color-heading-italian)" }}
          >
            Küche, Wein & Empfehlungen
          </h2>
          <div
            className="space-y-4 text-base leading-relaxed sm:text-lg"
            style={{ color: "var(--color-text)" }}
          >
            <p>
              Das Goldoni steht für gehobene italienische Küche zu angemessenen
              Preisen. Ihr Herzstück ist die <strong>Empfehlungskarte</strong>:
              Jede Woche stellt Silvio wechselnde Gerichte zusammen — was gerade
              saisonal und frisch eingekauft ist, ausgewählt von seiner Hand.
              Viele Gäste kommen eigens hierher, um Neues zu entdecken.
            </p>
            <p>
              Dazu eine eigens ausgewählte, kuratierte Weinbegleitung — Tropfen,
              die zur Küche und zur Empfehlung des Tages passen. Daneben stehen
              die Klassiker der Speisekarte und natürlich Pizza aus dem Ofen.
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/empfehlungen"
              className="inline-block rounded-md px-6 py-3 text-center text-base font-medium transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--color-accent)", color: "#FAFAFA" }}
            >
              Aktuelle Empfehlungen
            </Link>
            <Link
              href="/menu"
              className="inline-block rounded-md border-2 px-6 py-3 text-center text-base font-medium transition-colors"
              style={{
                borderColor: "var(--color-border-strong)",
                color: "var(--color-text)",
              }}
            >
              Zur Speisekarte
            </Link>
          </div>
        </div>
      </section>

      {/* Reservieren CTA — olive band, warm close */}
      <section
        className="px-6 py-20 sm:px-12 sm:py-24"
        style={{
          backgroundColor: "var(--color-bg-olive)",
          color: "var(--color-on-olive)",
        }}
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-2xl sm:text-3xl">Einen Tisch reservieren</h2>
          <p className="mx-auto mb-8 max-w-xl opacity-90">
            Wir freuen uns auf Ihren Besuch im Stuttgarter Westen. Ein Anruf
            genügt — oder schreiben Sie uns.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <a
              href={`tel:${SITE.phone}`}
              className="inline-block rounded-md px-6 py-3 text-base font-medium transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--color-accent)", color: "#FAFAFA" }}
            >
              Tisch reservieren · {SITE.phoneDisplay}
            </a>
            <Link
              href="/kontakt"
              className="inline-block rounded-md border-2 px-6 py-3 text-base font-medium transition-colors"
              style={{
                borderColor: "var(--color-on-olive-muted)",
                color: "var(--color-on-olive)",
              }}
            >
              Kontakt & Anfahrt
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
