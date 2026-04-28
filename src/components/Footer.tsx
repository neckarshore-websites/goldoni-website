import Link from "next/link";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer
      className="border-t"
      style={{
        borderColor: "var(--color-border)",
        backgroundColor: "var(--color-bg-muted)",
      }}
    >
      <div className="mx-auto max-w-6xl px-6 py-12 sm:px-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Address */}
          <div>
            <h3
              className="mb-3 text-xs font-medium uppercase tracking-[0.2em]"
              style={{ color: "var(--color-brand-olive)" }}
            >
              Adresse
            </h3>
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

          {/* Hours */}
          <div>
            <h3
              className="mb-3 text-xs font-medium uppercase tracking-[0.2em]"
              style={{ color: "var(--color-brand-olive)" }}
            >
              Oeffnungszeiten
            </h3>
            <ul style={{ color: "var(--color-text)" }}>
              {SITE.hours.map((row) => (
                <li key={row.days}>
                  {row.days} <span style={{ color: "var(--color-text-muted)" }}>· {row.time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3
              className="mb-3 text-xs font-medium uppercase tracking-[0.2em]"
              style={{ color: "var(--color-brand-olive)" }}
            >
              Kontakt
            </h3>
            <ul className="space-y-1">
              <li>
                <a
                  href={`tel:${SITE.phone}`}
                  className="hover:underline"
                  style={{ color: "var(--color-text)" }}
                >
                  {SITE.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="hover:underline"
                  style={{ color: "var(--color-text)" }}
                >
                  {SITE.email}
                </a>
              </li>
            </ul>
          </div>

          {/* External / Social */}
          <div>
            <h3
              className="mb-3 text-xs font-medium uppercase tracking-[0.2em]"
              style={{ color: "var(--color-brand-olive)" }}
            >
              Folgen &amp; Bestellen
            </h3>
            <ul className="space-y-1">
              <li>
                <a
                  href={SITE.social.wolt}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                  style={{ color: "var(--color-text)" }}
                >
                  Lieferung via Wolt
                </a>
              </li>
              <li>
                <a
                  href={SITE.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                  style={{ color: "var(--color-text)" }}
                >
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal row */}
        <div
          className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 text-sm sm:flex-row"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text-muted)",
          }}
        >
          <p>
            &copy; {new Date().getFullYear()} {SITE.name}
          </p>
          <ul className="flex gap-6">
            <li>
              <Link
                href="/impressum"
                className="hover:underline"
                style={{ color: "var(--color-text-muted)" }}
              >
                Impressum
              </Link>
            </li>
            <li>
              <Link
                href="/datenschutz"
                className="hover:underline"
                style={{ color: "var(--color-text-muted)" }}
              >
                Datenschutz
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
