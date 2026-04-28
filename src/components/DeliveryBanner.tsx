import Image from "next/image";
import { SITE } from "@/lib/site";

/**
 * Map of partner-name → logo asset path. Empty string falls back to
 * text-only button. Uber Eats asset is pending — owner will ship a
 * brand-portal-licensed file.
 */
const PARTNER_LOGOS: Record<string, { src: string; alt: string } | null> = {
  Wolt: { src: "/images/wolt-logo.png", alt: "Wolt" },
  "Uber Eats": null, // TODO: ship Uber Eats brand asset
};

/**
 * Top-of-homepage banner that points to delivery partners (Wolt, Uber Eats).
 *
 * Sits as the first section above the hero. Mobile-first (75% of Goldoni
 * traffic): on small screens, message and CTAs stack vertically with full
 * width tap-targets; on >=sm everything fits in a single line.
 */
export function DeliveryBanner() {
  return (
    <section
      className="border-b"
      style={{
        backgroundColor: "var(--color-brand-cream)",
        borderColor: "var(--color-border)",
      }}
      aria-label="Lieferservice"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 py-3 text-center sm:flex-row sm:gap-6 sm:px-12 sm:text-left">
        <p
          className="flex-1 text-sm sm:text-base"
          style={{ color: "var(--color-text)" }}
        >
          <span
            className="mr-2"
            aria-hidden
            style={{ color: "var(--color-accent)" }}
          >
            &#9679;
          </span>
          <strong className="font-medium">Auch nach Hause:</strong>{" "}
          Bestellen Sie unsere Karte direkt aus der Küche &mdash; geliefert
          von unseren Partnern.
        </p>
        <div className="flex flex-shrink-0 flex-wrap justify-center gap-2 sm:gap-3">
          {SITE.delivery.map((partner) => {
            const logo = PARTNER_LOGOS[partner.name];
            return (
              <a
                key={partner.name}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-1.5 text-sm font-medium shadow-sm transition-opacity hover:opacity-90"
                style={{
                  color: "var(--color-text)",
                  border: "1px solid var(--color-border-strong)",
                }}
                aria-label={partner.tagline}
              >
                {logo ? (
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={28}
                    height={28}
                    className="h-7 w-7 shrink-0"
                  />
                ) : (
                  <span
                    aria-hidden
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: "var(--color-accent)" }}
                  />
                )}
                <span>{partner.name}</span>
                <span aria-hidden style={{ color: "var(--color-accent)" }}>
                  &rarr;
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
