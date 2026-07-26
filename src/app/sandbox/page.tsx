import type { Metadata } from "next";
import Image from "next/image";
import { SIGNATURES, signatureDocument } from "@/lib/email-signatures";
import { HolidayBanner } from "@/components/HolidayBanner";

/**
 * /sandbox — interne Arbeitsfläche.
 *
 * Nicht verlinkt, `noindex, nofollow`, zusätzlich in robots.ts disallowed.
 *
 * Ursprünglich für den A/B-Vergleich des Bestellbanners gebaut (Work Order
 * 2026-07-25 §4e). Diese Aufgabe ist erledigt — Variante A wurde am 2026-07-26
 * gewählt und ist live —, deshalb sind der Vergleich und die zugehörigen
 * Screenshots wieder entfernt. Was bleibt, sind Dinge zum Herunterladen und
 * Weitergeben, die auf der öffentlichen Website nichts zu suchen haben.
 */
export const metadata: Metadata = {
  title: "Sandbox (intern)",
  description: "Interne Arbeitsfläche — nicht Teil der öffentlichen Website.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/sandbox" },
};

export default function SandboxPage() {
  return (
    <main className="py-12" style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="mx-auto mb-12 max-w-6xl px-6 sm:px-12">
        <p
          className="max-w-2xl text-sm leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          Interne Seite, nicht verlinkt und für Suchmaschinen gesperrt. Hier
          liegen Dateien zum Herunterladen und Weitergeben.
        </p>
      </div>

      <section className="mb-20">
        <div className="mx-auto mb-4 max-w-6xl px-6 sm:px-12">
          <h2
            className="text-xl font-semibold"
            style={{ color: "var(--color-text)" }}
          >
            Urlaubsbanner
          </h2>
          <p
            className="mt-1 max-w-2xl text-sm leading-relaxed"
            style={{ color: "var(--color-text-muted)" }}
          >
            Auf der Startseite verbaut, aber terminiert: erscheint dort
            automatisch ab <strong>Montag, 3. August</strong> (Beginn der
            Schliessung, keine Lücke), blendet sich automatisch am{" "}
            <strong>Montag, 24. August</strong> wieder aus — vor der
            Wiedereröffnung am <strong>Mittwoch, 26. August</strong>, weil
            Montag und Dienstag ohnehin Standard-Ruhetage sind. In diesem
            Zeitfenster verschwinden Sonntags- und Bestellbanner ebenfalls von
            der Startseite — eine geschlossene Küche nimmt keine Bestellungen
            an. Hier auf /sandbox ist das Urlaubsbanner unabhängig davon immer
            zu sehen. Kein Foto geplant — der Azzurro-Farbverlauf bleibt.
          </p>
        </div>
        <HolidayBanner forcePreview />
      </section>

      <section className="mx-auto max-w-6xl px-6 sm:px-12">
        <h2
          className="text-xl font-semibold"
          style={{ color: "var(--color-text)" }}
        >
          QR-Code zum Ausdrucken
        </h2>
        <p
          className="mt-1 max-w-2xl text-sm leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          Führt auf die eigene Bestellseite — für Tischkarten, Flyer oder den
          Aufkleber an der Tür.{" "}
          <strong>Nicht den QR-Code aus Wolts Mail verwenden:</strong> der zeigt
          auf die englische Fassung. Dieser hier wird aus derselben Adresse
          erzeugt, die auch der Bestellknopf benutzt, und ein Test liest ihn vor
          jedem Merge wieder aus — ein gedruckter Code lässt sich nicht
          nachbessern.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-6">
          <a href="/images/storefront-qr.svg" target="_blank" rel="noopener">
            <Image
              src="/images/storefront-qr.png"
              alt="QR-Code, der auf die Bestellseite von Ristorante Goldoni führt."
              width={2000}
              height={2000}
              className="h-40 w-40 rounded-lg border bg-white p-2"
              style={{ borderColor: "var(--color-border)" }}
              loading="lazy"
            />
          </a>
          <ul
            className="space-y-1 text-sm"
            style={{ color: "var(--color-text)" }}
          >
            <li>
              <a
                className="underline"
                href="/images/storefront-qr.svg"
                target="_blank"
                rel="noopener"
              >
                SVG herunterladen
              </a>{" "}
              <span style={{ color: "var(--color-text-muted)" }}>
                — für die Druckerei, beliebig skalierbar
              </span>
            </li>
            <li>
              <a
                className="underline"
                href="/images/storefront-qr.png"
                target="_blank"
                rel="noopener"
              >
                PNG herunterladen
              </a>{" "}
              <span style={{ color: "var(--color-text-muted)" }}>
                — 2000 px, für Word, Canva und Ähnliches
              </span>
            </li>
          </ul>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-6 sm:px-12">
        <h2
          className="text-xl font-semibold"
          style={{ color: "var(--color-text)" }}
        >
          E-Mail-Signatur — zwei Vorschläge
        </h2>
        <p
          className="mt-1 max-w-2xl text-sm leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          Beide enthalten den Bestell-QR und ziehen Adresse, Telefon und
          Öffnungszeiten aus derselben Quelle wie die Website — eine Signatur
          wird tausendfach verschickt und lässt sich nicht zurückholen, sie darf
          keine abgeschriebene zweite Kopie sein.{" "}
          <strong>Die Funktionsbezeichnung fehlt mit Absicht:</strong>{" "}
          &bdquo;Inhaber&ldquo; und &bdquo;Mit&#8209;Eigentümer&ldquo; sind nicht
          dasselbe, und das ist eine Angabe, die ich nicht errate — sag mir die
          richtige, dann steht sie drin.
        </p>

        <div className="mt-8 space-y-10">
          {SIGNATURES.map((s) => (
            <div key={s.id}>
              <h3
                className="text-base font-semibold"
                style={{ color: "var(--color-text)" }}
              >
                {s.titel}
              </h3>
              <p
                className="mt-1 max-w-2xl text-sm"
                style={{ color: "var(--color-text-muted)" }}
              >
                {s.beschreibung}
              </p>
              {/*
                iframe statt Inline-Rendering: innerhalb der Seite wuerde die
                Signatur den CSS-Reset der Website erben und anders aussehen als
                im Postfach. Ein eigenes Dokument zeigt, was beim Empfaenger
                ankommt — und es ist exakt der String, den auch die Datei unter
                /signaturen enthaelt.
              */}
              <iframe
                title={`Vorschau ${s.titel}`}
                srcDoc={signatureDocument(s.html, s.titel)}
                sandbox=""
                loading="lazy"
                height={s.previewHeight}
                className="mt-4 w-full rounded-lg border"
                style={{ borderColor: "var(--color-border)" }}
              />
              <p className="mt-3 text-sm">
                <a
                  className="underline"
                  href={`/signaturen/goldoni-signatur-${s.id}.html`}
                  target="_blank"
                  rel="noopener"
                  style={{ color: "var(--color-accent)" }}
                >
                  Zum Einbauen öffnen
                </a>{" "}
                <span style={{ color: "var(--color-text-muted)" }}>
                  — dort alles markieren, kopieren und in den
                  Signatur-Einstellungen des Mailprogramms einfügen
                </span>
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
