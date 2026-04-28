/**
 * PageHero — full-width hero image for interior pages (Kontakt, Impressum, …).
 *
 * Deliberately slimmer than the landing hero: 30 vh on mobile, 38 vh on
 * desktop. No CTA overlay — just atmosphere. A subtle bottom-gradient keeps
 * the transition to the page content smooth.
 */

import Image from "next/image";

interface PageHeroProps {
  src: string;
  alt: string;
}

export function PageHero({ src, alt }: PageHeroProps) {
  return (
    <div className="relative h-[30vh] min-h-[180px] w-full sm:h-[38vh] sm:min-h-[240px]">
      <Image
        src={src}
        alt={alt}
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="object-cover"
      />
      {/* Soft bottom fade into page background */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, transparent 50%, var(--color-bg) 100%)",
        }}
      />
    </div>
  );
}
