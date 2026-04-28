import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kontakt &amp; Reservierung — Ristorante Goldoni",
  description:
    "Tisch reservieren oder Frage stellen. Telefon, E-Mail oder Anfahrt &mdash; alle Wege zum Ristorante Goldoni in Stuttgart.",
};

export default function KontaktPage() {
  return (
    <main className="px-6 py-20 sm:px-12 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <p
          className="mb-3 text-xs uppercase tracking-[0.2em]"
          style={{ color: "var(--color-brand-olive)" }}
        >
          Kontakt &amp; Reservierung
        </p>
        <h1
          className="mb-6 text-4xl sm:text-5xl"
          style={{ color: "var(--color-text)" }}
        >
          So erreichen Sie uns
        </h1>
        <p
          className="mb-10 text-lg leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          Am schnellsten geht es per Telefon. Fuer alles andere &mdash;
          Anfragen zu Feiern, Sonderwuenschen, Allergien &mdash; freuen wir
          uns ueber eine E-Mail.
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Phone */}
          <a
            href={`tel:${SITE.phone}`}
            className="rounded-lg border p-6 transition-colors hover:opacity-90"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-bg-muted)",
            }}
          >
            <h2
              className="mb-2 text-xs font-medium uppercase tracking-[0.2em]"
              style={{ color: "var(--color-brand-olive)" }}
            >
              Telefon
            </h2>
            <p className="text-xl" style={{ color: "var(--color-text)" }}>
              {SITE.phoneDisplay}
            </p>
            <p
              className="mt-2 text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              Fuer Reservierungen am gleichen Tag
            </p>
          </a>

          {/* Email */}
          <a
            href={`mailto:${SITE.email}`}
            className="rounded-lg border p-6 transition-colors hover:opacity-90"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-bg-muted)",
            }}
          >
            <h2
              className="mb-2 text-xs font-medium uppercase tracking-[0.2em]"
              style={{ color: "var(--color-brand-olive)" }}
            >
              E-Mail
            </h2>
            <p className="text-xl" style={{ color: "var(--color-text)" }}>
              {SITE.email}
            </p>
            <p
              className="mt-2 text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              Fuer Feiern, Sonderwuensche, alles ohne Eile
            </p>
          </a>
        </div>

        {/* Address + Hours */}
        <div
          className="mt-10 grid grid-cols-1 gap-8 rounded-lg border p-8 sm:grid-cols-2"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-bg)",
          }}
        >
          <div>
            <h2
              className="mb-3 text-xs font-medium uppercase tracking-[0.2em]"
              style={{ color: "var(--color-brand-olive)" }}
            >
              Adresse
            </h2>
            <address
              className="not-italic"
              style={{ color: "var(--color-text)" }}
            >
              {SITE.name}
              <br />
              {SITE.address.street}
              <br />
              {SITE.address.postalCode} {SITE.address.city}
            </address>
          </div>
          <div>
            <h2
              className="mb-3 text-xs font-medium uppercase tracking-[0.2em]"
              style={{ color: "var(--color-brand-olive)" }}
            >
              Oeffnungszeiten
            </h2>
            <ul style={{ color: "var(--color-text)" }}>
              {SITE.hours.map((row) => (
                <li key={row.days}>
                  {row.days}{" "}
                  <span style={{ color: "var(--color-text-muted)" }}>
                    &middot; {row.time}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Reservation form placeholder */}
        <div
          className="mt-10 rounded-lg border-2 border-dashed p-8 text-center"
          style={{ borderColor: "var(--color-border)" }}
        >
          <p
            className="text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            Reservierungsformular folgt &mdash; bis dahin Anrufen oder Mail.
          </p>
        </div>
      </div>
    </main>
  );
}
