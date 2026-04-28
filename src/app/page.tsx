import { SITE } from "@/lib/site";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section
        className="px-6 py-24 sm:px-12 sm:py-32 lg:py-40"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <div className="mx-auto max-w-4xl text-center">
          <p
            className="mb-4 text-sm uppercase tracking-[0.2em]"
            style={{ color: "var(--color-brand-olive)" }}
          >
            {SITE.tagline}
          </p>
          <h1
            className="mb-6 text-5xl leading-tight sm:text-6xl lg:text-7xl"
            style={{ color: "var(--color-text)" }}
          >
            Ristorante <span style={{ color: "var(--color-accent)" }}>Goldoni</span>
          </h1>
          <p
            className="mx-auto mb-10 max-w-2xl text-lg sm:text-xl"
            style={{ color: "var(--color-text-muted)" }}
          >
            {SITE.description}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/menu"
              className="rounded-md px-6 py-3 text-base font-medium transition-colors"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-bg)",
              }}
            >
              Unsere Karte
            </a>
            <a
              href={`tel:${SITE.phone}`}
              className="rounded-md border px-6 py-3 text-base font-medium transition-colors"
              style={{
                borderColor: "var(--color-border-strong)",
                color: "var(--color-text)",
              }}
            >
              Tisch reservieren · {SITE.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      {/* Hours + Address — quick info row */}
      <section
        className="border-y px-6 py-12 sm:px-12"
        style={{
          borderColor: "var(--color-border)",
          backgroundColor: "var(--color-bg-muted)",
        }}
      >
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 text-center sm:grid-cols-2">
          <div>
            <h2
              className="mb-3 text-lg font-medium uppercase tracking-wider"
              style={{ color: "var(--color-brand-olive)" }}
            >
              Oeffnungszeiten
            </h2>
            <ul className="space-y-1" style={{ color: "var(--color-text)" }}>
              {SITE.hours.map((row) => (
                <li key={row.days}>
                  <span className="font-medium">{row.days}</span>
                  <span style={{ color: "var(--color-text-muted)" }}> · {row.time}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2
              className="mb-3 text-lg font-medium uppercase tracking-wider"
              style={{ color: "var(--color-brand-olive)" }}
            >
              Adresse
            </h2>
            <p style={{ color: "var(--color-text)" }}>
              {SITE.address.street}
              <br />
              {SITE.address.postalCode} {SITE.address.city}
            </p>
          </div>
        </div>
      </section>

      {/* Footer placeholder */}
      <footer
        className="px-6 py-12 text-center text-sm sm:px-12"
        style={{ color: "var(--color-text-muted)" }}
      >
        <p>
          &copy; {new Date().getFullYear()} {SITE.name} ·{" "}
          <a href={`mailto:${SITE.email}`} className="underline">
            {SITE.email}
          </a>
        </p>
        <p className="mt-2 text-xs" style={{ color: "var(--color-text-subtle)" }}>
          Impressum &middot; Datenschutz folgen
        </p>
      </footer>
    </main>
  );
}
