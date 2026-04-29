import Link from "next/link";
import { SITE } from "@/lib/site";
import { SpotifyLink } from "@/components/SpotifyLink";

/**
 * Footer — two stacked bands, theme-fixed (same in light + dark):
 *
 *   1. Noir top band — Adresse / Öffnungszeiten / Kontakt / Folgen
 *      Espresso bg, mozzarella text, parmigiano eyebrows.
 *
 *   2. Blanc legal row — Copyright + Impressum + Datenschutz
 *      Mozzarella bg, espresso text.
 *
 * Pairs with the Header (also noir) to give the site a consistent
 * editorial wrap regardless of which theme the visitor is in.
 */
export function Footer() {
  return (
    <footer>
      {/* === Noir top band ============================================ */}
      <div
        style={{
          backgroundColor: "var(--color-noir-bg)",
          color: "var(--color-noir-text)",
        }}
      >
        <div className="mx-auto max-w-6xl px-6 py-12 sm:px-12">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Address */}
            <div>
              <h3
                className="mb-3 text-xs font-medium uppercase tracking-[0.2em]"
                style={{ color: "var(--color-noir-eyebrow)" }}
              >
                Adresse
              </h3>
              <address
                className="not-italic"
                style={{ color: "var(--color-noir-text)" }}
              >
                {SITE.name}
                <br />
                {SITE.address.street}
                <br />
                {SITE.address.postalCode} {SITE.address.city}
              </address>
              <a
                href="https://maps.app.goo.gl/u3PAUvKHqcANve797"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm hover:underline"
                style={{ color: "var(--color-noir-text-muted)" }}
              >
                Route planen →
              </a>
            </div>

            {/* Hours */}
            <div>
              <h3
                className="mb-3 text-xs font-medium uppercase tracking-[0.2em]"
                style={{ color: "var(--color-noir-eyebrow)" }}
              >
                Öffnungszeiten
              </h3>
              <ul style={{ color: "var(--color-noir-text)" }}>
                {SITE.hours.map((row) => (
                  <li key={row.days}>
                    {row.days}{" "}
                    <span style={{ color: "var(--color-noir-text-muted)" }}>
                      · {row.time}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3
                className="mb-3 text-xs font-medium uppercase tracking-[0.2em]"
                style={{ color: "var(--color-noir-eyebrow)" }}
              >
                Kontakt
              </h3>
              <ul className="space-y-1">
                <li>
                  <a
                    href={`tel:${SITE.phone}`}
                    className="hover:underline"
                    style={{ color: "var(--color-noir-text)" }}
                  >
                    {SITE.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="hover:underline"
                    style={{ color: "var(--color-noir-text)" }}
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
                style={{ color: "var(--color-noir-eyebrow)" }}
              >
                Folgen &amp; Bestellen
              </h3>
              <ul className="space-y-1">
                {SITE.delivery.map((partner) => (
                  <li key={partner.name}>
                    <a
                      href={partner.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                      style={{ color: "var(--color-noir-text)" }}
                    >
                      Lieferung via {partner.name}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={SITE.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                    style={{ color: "var(--color-noir-text)" }}
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  {/* Hausplaylist — small Spotify mark + wordmark, sits
                      naturally with the other follow links. */}
                  <SpotifyLink variant="logo" className="hover:underline" />
                </li>
              </ul>

              {/* Internal — separated by hairline, muted styling */}
              <ul
                className="mt-4 space-y-1 border-t pt-4 text-sm"
                style={{ borderColor: "var(--color-noir-border)" }}
              >
                <li>
                  <Link
                    href="/style-guide"
                    className="hover:underline"
                    style={{ color: "var(--color-noir-text-muted)" }}
                  >
                    Style Guide{" "}
                    <span className="text-xs">(intern)</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/assets"
                    className="hover:underline"
                    style={{ color: "var(--color-noir-text-muted)" }}
                  >
                    Assets{" "}
                    <span className="text-xs">(intern)</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* === Blanc legal row ========================================== */}
      <div
        style={{
          backgroundColor: "var(--color-blanc-bg)",
          color: "var(--color-blanc-text-muted)",
          borderTop: "1px solid var(--color-blanc-border)",
        }}
      >
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 text-sm sm:flex-row sm:px-12">
          <p>
            &copy; {new Date().getFullYear()} {SITE.name}
          </p>
          <ul className="flex gap-6">
            <li>
              <Link
                href="/impressum"
                className="hover:underline"
                style={{ color: "var(--color-blanc-text-muted)" }}
              >
                Impressum
              </Link>
            </li>
            <li>
              <Link
                href="/datenschutz"
                className="hover:underline"
                style={{ color: "var(--color-blanc-text-muted)" }}
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
