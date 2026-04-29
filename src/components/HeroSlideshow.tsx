"use client";

/**
 * HeroSlideshow — crossfades between three brand photos every 15 seconds.
 *
 * All three images are in the DOM at once as absolute layers; only the
 * active slide is opacity-1. The 2 s CSS transition gives a slow, cinematic
 * dissolve that suits the Goldoni ambience.
 *
 * Slide order:
 *   0 — Velvet wall sign (original hero, brand-defining)
 *   1 — Golden angel figurine with Goldoni card
 *   2 — Restaurant interior, warm evening light
 */

import { useEffect, useState } from "react";
import Image from "next/image";

const SLIDES = [
  {
    src: "/images/hero-goldoni-velvet.webp",
    alt: "Ristorante Goldoni — Wandschild im Innenraum, gold auf rotem Samt",
    // Default center crop works well for the velvet sign.
  },
  {
    src: "/images/hero-goldoni-angel.webp",
    alt: "Goldoni Visitenkarte vor goldener Engelsfigur auf einem Tisch",
    // Shift crop ~150 px upward so the angel's head + wings are centred
    // rather than the arm/card being clipped at the bottom edge.
    objectPosition: "center 20%",
  },
  {
    src: "/images/hero-goldoni-interior.webp",
    alt: "Ristorante Goldoni Innenraum — gedeckte Tische im warmen Abendlicht",
    // Default center crop works well for the interior shot.
  },
] satisfies Array<{ src: string; alt: string; objectPosition?: string }>;

const INTERVAL_MS = 15_000;
const FADE_MS = 2_000;

export function HeroSlideshow() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0">
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          aria-hidden={i !== active}
          className="absolute inset-0"
          style={{
            opacity: i === active ? 1 : 0,
            transition: `opacity ${FADE_MS}ms ease-in-out`,
            // Keep the fading-out slide above the waiting one so the dissolve
            // reads as a fade-to rather than a fade-over.
            zIndex: i === active ? 1 : 0,
          }}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            // First slide is LCP — must be priority. Others load eagerly so
            // the crossfade doesn't flash an empty frame on first cycle.
            priority={i === 0}
            fetchPriority={i === 0 ? "high" : "low"}
            loading={i === 0 ? "eager" : "eager"}
            sizes="100vw"
            className="object-cover"
            style={slide.objectPosition ? { objectPosition: slide.objectPosition } : undefined}
          />
        </div>
      ))}
    </div>
  );
}
