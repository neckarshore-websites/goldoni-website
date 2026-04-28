import Image from "next/image";
import { SITE } from "@/lib/site";

/**
 * Brand-portal-licensed assets keyed by partner name.
 * - Wolt: cyan circle logo (logo only, we add the "Bestellen mit Wolt" label).
 * - Uber Eats: official German co-marketing composite ("Bestellen mit Uber Eats")
 *   which already carries the call-to-action — we render it as a self-labeled tile.
 */
const PARTNER_LOGOS: Record<
  string,
  { src: string; alt: string; selfLabeled: boolean } | null
> = {
  Wolt: {
    src: "/images/wolt-logo.png",
    alt: "Wolt",
    selfLabeled: false,
  },
  "Uber Eats": {
    src: "/images/uber-eats-logo.png",
    alt: "Bestellen mit Uber Eats",
    selfLabeled: true,
  },
};

/**
 * Top-of-homepage banner that points to delivery partners (Wolt, Uber Eats).
 *
 * Each partner renders as a square brand tile (96x96 mobile, 112x112 desktop).
 * Wolt's tile carries the cyan logo above a "Bestellen mit Wolt" label since
 * Wolt did not ship a co-branding composite. Uber Eats' tile renders the
 * official "Bestellen mit Uber Eats" green composite as-is.
 *
 * Mobile (75% of Goldoni traffic): tiles stack 2-up in a row — touch-friendly.
 * Desktop: tiles sit beside the headline.
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
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-4 sm:flex-row sm:gap-8 sm:px-12">
        <p
          className="flex-1 text-center text-sm sm:text-left sm:text-base"
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

        <div className="flex flex-shrink-0 gap-3">
          {SITE.delivery.map((partner) => {
            const logo = PARTNER_LOGOS[partner.name];
            if (!logo) return null;

            return (
              <a
                key={partner.name}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={partner.tagline}
                className="block overflow-hidden rounded-lg shadow-sm transition-transform hover:scale-[1.02] focus-visible:scale-[1.02]"
              >
                {logo.selfLabeled ? (
                  // Uber Eats — composite already says "Bestellen mit Uber Eats"
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={112}
                    height={112}
                    className="block h-24 w-24 sm:h-28 sm:w-28"
                  />
                ) : (
                  // Wolt — bare logo on cyan field, "Bestellen mit Wolt" label below
                  <div
                    className="flex h-24 w-24 flex-col items-center justify-center sm:h-28 sm:w-28"
                    style={{ backgroundColor: "#00C2E8" }}
                  >
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={96}
                      height={96}
                      className="block h-14 w-14 sm:h-16 sm:w-16"
                    />
                    {/* Dark-on-cyan label — Wolt's brand portal allows
                        both white and dark variants; dark passes WCAG
                        contrast (7.94:1 vs. 2.13:1 for white-on-cyan). */}
                    <span
                      className="mt-0.5 text-[9px] font-semibold uppercase tracking-wide sm:text-[10px]"
                      style={{ color: "var(--color-text)" }}
                    >
                      Bestellen mit
                    </span>
                  </div>
                )}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
