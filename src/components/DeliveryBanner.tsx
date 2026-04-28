import { SITE } from "@/lib/site";

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
          Bestellen Sie unsere Karte direkt aus der Kueche &mdash; geliefert
          von unseren Partnern.
        </p>
        <div className="flex flex-shrink-0 flex-wrap justify-center gap-2 sm:gap-3">
          {SITE.delivery.map((partner) => (
            <a
              key={partner.name}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-bg)",
              }}
              aria-label={partner.tagline}
            >
              {partner.name} &rarr;
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
