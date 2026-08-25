import type { Metadata } from "next";
import Image from "next/image";
import { SIGNATURES, signatureDocument } from "@/lib/email-signatures";
import { HolidayBanner } from "@/components/HolidayBanner";

/**
 * /sandbox — interne Werkzeug- und Dokumentationsseite. DAUERHAFT, nicht
 * temporär — Betreiber-Entscheidung 2026-07-26.
 *
 * Nicht verlinkt, `noindex, nofollow`, zusätzlich in robots.ts disallowed.
 *
 * WICHTIG FÜR SPÄTER: diese Seite ist NICHT automatisch der Aufräum-Ort für
 * jede abgeschlossene Aufgabe. Ursprünglich war sie das — der A/B-Vergleich
 * des Bestellbanners (Work Order 2026-07-25 §4e) wurde nach der Entscheidung
 * für Variante A samt Screenshots wieder entfernt, weil er seinen einen Zweck
 * erfüllt hatte und nichts mehr zu tun hatte. Der Betreiber hat das umgekehrt:
 * die verbleibenden Bausteine bleiben ABSICHTLICH stehen, auch nachdem ihre
 * jeweilige Aufgabe erledigt ist —
 *   - die E-Mail-Signaturen: sollen langfristig hier dokumentiert bleiben,
 *     nicht nur bis zur Wahl einer Variante;
 *   - das Urlaubsbanner: wird wahrscheinlich nächstes Jahr wieder gebraucht —
 *     KEIN automatisch wiederkehrendes Banner, sondern eine Vorlage zum
 *     Kopieren; die Daten in HolidayBanner.tsx sind für 2026 hartkodiert und
 *     müssen vor der nächsten Wiederverwendung aktualisiert werden.
 * Nur der QR-Code-Baustein war schon immer als Dauereinrichtung gedacht.
 * Vor dem Entfernen von irgendetwas hier: nachfragen, nicht annehmen.
 */
export const metadata: Metadata = {
  title: "Sandbox (intern)",
  description:
    "Interne Werkzeug- und Dokumentationsseite — nicht Teil der öffentlichen Website.",
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
          Interne Werkzeugseite, nicht verlinkt und für Suchmaschinen
          gesperrt. Dauerhaft gedacht, nicht als Zwischenlager für erledigte
          Aufgaben — hier liegen Dinge zum Herunterladen, Weitergeben und
          Wiederverwenden.
        </p>
      </div>

      {/* Handy-Prototyp Bestell-CTA — A/B, 2026-08-25. Zwei eigene Seiten
          statt zweier Bloecke hier: beide Varianten kleben am Bildschirmrand
          und wuerden sich auf einer gemeinsamen Seite gegenseitig stoeren.
          Nach der Entscheidung NICHT stillschweigend entfernen — siehe
          Docblock oben, der Betreiber entscheidet, was hier bleibt. */}
      <section className="mb-20">
        <div className="mx-auto max-w-6xl px-6 sm:px-12">
          <h2
            className="text-xl font-semibold"
            style={{ color: "var(--color-text)" }}
          >
            Handy-Prototyp: Bestellknopf auf der Speisekarte
          </h2>
          <p
            className="mt-1 max-w-2xl text-sm leading-relaxed"
            style={{ color: "var(--color-text-muted)" }}
          >
            Zwei Varianten zum Vergleich am Telefon. Die Desktop-Fassung ist
            seit dem 25. August live; fuer das Handy steht die Entscheidung
            noch aus. Beide Prototypen zeigen die volle Speisekarte, damit das
            Blaettern echt ist.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="/sandbox/handy-a"
              className="rounded-lg border px-4 py-2 text-sm"
              style={{
                borderColor: "var(--color-border-strong)",
                color: "var(--color-text)",
              }}
            >
              Variante A &mdash; Knopf in der Kategorieleiste
            </a>
            <a
              href="/sandbox/handy-b"
              className="rounded-lg border px-4 py-2 text-sm"
              style={{
                borderColor: "var(--color-border-strong)",
                color: "var(--color-text)",
              }}
            >
              Variante B &mdash; schwebender Knopf
            </a>
            <a
              href="/sandbox/desktop-c"
              className="rounded-lg border px-4 py-2 text-sm"
              style={{
                borderColor: "var(--color-border-strong)",
                color: "var(--color-text)",
              }}
            >
              Variante C &mdash; Desktop: schwebender Knopf statt Streifen
            </a>
          </div>
        </div>
      </section>

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
