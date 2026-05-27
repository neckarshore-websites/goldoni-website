"use client";

/**
 * HeroSlideshow — crossfades between three brand photos every 15 seconds.
 *
 * Only the LCP slide (slide 0) is in the initial DOM. Slides 1 + 2 mount
 * after a short post-paint delay so they don't compete with slide 0 for
 * mobile bandwidth — that competition was a measurable drag on Mobile-LCP
 * (Lighthouse-Audit 2026-04-30 zeigte LCP 2.7s → ~2.0s nach Defer-Fix).
 * The 1.2 s mount delay is comfortably inside the 15 s crossfade-cycle,
 * so by the time slide 1 is shown for the first time, the image has long
 * since downloaded silently in the background.
 *
 * Slide order:
 *   0 — Velvet wall sign (original hero, brand-defining)
 *   1 — Golden angel figurine with Goldoni card
 *   2 — Restaurant interior, warm evening light
 *
 * Note on Lighthouse-CI vs reality (2026-05-27):
 * GH-Actions shared-CPU runners score this component's Mobile-4G LCP
 * ~1.5 s slower than an M-series Mac with cpuSlowdownMultiplier=4 against
 * the same prod URL (CI 4.2 s vs local 2.7 s, Performance 78 vs 96). The
 * delta is runner-environment, not regression. See
 * docs/perf/lcp-mobile-4g-investigation.md for the full datapoint table.
 * The Mobile-4G hard-gate threshold in scripts/lighthouse.mjs was relaxed
 * 90 -> 75 on the same day to absorb this CI noise without chasing
 * phantom regressions on every PR. 75 sits 3pp below the empirical CI
 * mean of 78 and still catches a real ~12-point regression.
 */

import { useEffect, useState } from "react";
import Image from "next/image";

const SLIDES = [
  {
    src: "/images/hero-goldoni-velvet.webp",
    alt: "Ristorante Goldoni — Wandschild im Innenraum, gold auf rotem Samt",
    // Slight downward shift so both the GOLDONI lettering (top) and the
    // fireplace mantel (bottom) fit inside the taller hero container.
    objectPosition: "center 40%",
  },
  {
    src: "/images/hero-goldoni-angel.webp",
    alt: "Goldoni Visitenkarte vor goldener Engelsfigur auf einem Tisch",
    // Shift crop ~150 px upward so the angel's head + wings are centred
    // rather than the arm/card being clipped at the bottom edge.
    objectPosition: "center 80%",
  },
  {
    src: "/images/hero-goldoni-interior.webp",
    alt: "Ristorante Goldoni Innenraum — gedeckte Tische im warmen Abendlicht",
    // Default center crop works well for the interior shot.
  },
] satisfies Array<{ src: string; alt: string; objectPosition?: string }>;

const INTERVAL_MS = 15_000;
const FADE_MS = 2_000;
// Wait ~1.2 s after mount before injecting slides 1 + 2 into the DOM.
// Long enough for slide-0 LCP image + fonts to win the bandwidth race
// on simulated Slow 4G, comfortably less than the 15 s rotation interval.
const EXTRA_SLIDES_MOUNT_DELAY_MS = 1_200;

export function HeroSlideshow() {
  const [active, setActive] = useState(0);
  const [extrasMounted, setExtrasMounted] = useState(false);

  useEffect(() => {
    const mountTimer = setTimeout(
      () => setExtrasMounted(true),
      EXTRA_SLIDES_MOUNT_DELAY_MS,
    );
    return () => clearTimeout(mountTimer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0">
      {SLIDES.map((slide, i) => {
        // Slide 0 is always rendered (LCP candidate). Slides 1 + 2 wait
        // until extrasMounted flips, so they don't compete for first paint.
        if (i > 0 && !extrasMounted) return null;

        return (
          <div
            key={slide.src}
            aria-hidden={i !== active}
            className="absolute inset-0"
            style={{
              opacity: i === active ? 1 : 0,
              transition: `opacity ${FADE_MS}ms ease-in-out`,
              // Keep the fading-out slide above the waiting one so the
              // dissolve reads as a fade-to rather than a fade-over.
              zIndex: i === active ? 1 : 0,
            }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              // Slide 0 is the LCP — must be priority + high fetch.
              // Slides 1 + 2 enter the DOM 1.2 s later: by then the LCP
              // race is over, so default eager-load + low fetchpriority is
              // fine and they finish well before the 15 s crossfade.
              priority={i === 0}
              fetchPriority={i === 0 ? "high" : "low"}
              sizes="100vw"
              className="object-cover"
              style={slide.objectPosition ? { objectPosition: slide.objectPosition } : undefined}
            />
          </div>
        );
      })}
    </div>
  );
}
