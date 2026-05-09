"use client";

/**
 * SaalGalerie — public-facing image gallery with lightbox.
 *
 * First lightbox/modal on a public page (so far only `/assets` (intern)
 * had one via `AssetCard`). Pattern is intentionally similar:
 *   - Desktop  → modal overlay, ESC to close, click outside closes
 *   - Mobile   → modal overlay too (Hochkant fills phone screen well)
 *   - Keyboard → ESC = close, ← / → = prev / next
 *
 * Layout: 2-column grid on sm+, single-column on mobile (matches
 * `/assets` density). Cards are responsive, lazy-loaded; only the
 * full-size image inside the modal loads on demand.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

export interface GalleryImage {
  src: string;
  alt: string;
  /** Width of the source image — required for next/image. */
  width: number;
  /** Height of the source image — required for next/image. */
  height: number;
  /** Optional short caption shown below the thumb and inside the modal. */
  caption?: string;
}

interface SaalGalerieProps {
  images: GalleryImage[];
}

export function SaalGalerie({ images }: SaalGalerieProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const closeModal = useCallback(() => setOpenIndex(null), []);
  const prevImage = useCallback(
    () =>
      setOpenIndex((i) =>
        i === null ? null : (i - 1 + images.length) % images.length
      ),
    [images.length]
  );
  const nextImage = useCallback(
    () =>
      setOpenIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length]
  );

  // Keyboard navigation while modal is open
  useEffect(() => {
    if (openIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      else if (e.key === "ArrowLeft") prevImage();
      else if (e.key === "ArrowRight") nextImage();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [openIndex, closeModal, prevImage, nextImage]);

  // Lock body scroll while modal is open + move focus to close button
  useEffect(() => {
    if (openIndex !== null) {
      document.body.style.overflow = "hidden";
      closeRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [openIndex]);

  const openImage = images[openIndex ?? -1];

  return (
    <>
      {/* ── Grid ────────────────────────────────────────────────────────── */}
      <ul
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6"
        // Decorative list — captions carry semantics, not list role
        role="list"
      >
        {images.map((img, i) => (
          <li key={img.src}>
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              className="group block w-full cursor-zoom-in overflow-hidden rounded-lg"
              style={{ backgroundColor: "var(--color-bg-muted)" }}
              aria-label={`Bild öffnen: ${img.alt}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                sizes="(min-width: 640px) 50vw, 100vw"
                className="block h-auto w-full object-cover transition-opacity duration-200 group-hover:opacity-90"
              />
              {img.caption && (
                <span
                  className="block px-4 py-3 text-sm"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {img.caption}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      {/* ── Lightbox ────────────────────────────────────────────────────── */}
      {openIndex !== null && openImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={openImage.alt}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          style={{ backgroundColor: "rgba(0,0,0,0.92)" }}
          onClick={closeModal}
        >
          {/* Stop propagation so clicks inside the image don't close */}
          <div
            className="relative flex max-h-full max-w-full flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close (top-right, always visible) */}
            <button
              ref={closeRef}
              onClick={closeModal}
              className="absolute -top-3 -right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full text-base font-bold transition-colors"
              style={{
                backgroundColor: "rgba(255,255,255,0.18)",
                color: "#fff",
              }}
              aria-label="Schließen (ESC)"
            >
              ✕
            </button>

            {/* Prev */}
            {images.length > 1 && (
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-lg font-bold transition-colors sm:flex"
                style={{
                  backgroundColor: "rgba(255,255,255,0.18)",
                  color: "#fff",
                }}
                aria-label="Vorheriges Bild (Pfeil links)"
              >
                ‹
              </button>
            )}

            {/* Full-size image — Next/Image with intrinsic ratio */}
            <Image
              src={openImage.src}
              alt={openImage.alt}
              width={openImage.width}
              height={openImage.height}
              sizes="92vw"
              className="max-h-[82vh] w-auto rounded-lg object-contain shadow-2xl"
              priority
            />

            {/* Next */}
            {images.length > 1 && (
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-lg font-bold transition-colors sm:flex"
                style={{
                  backgroundColor: "rgba(255,255,255,0.18)",
                  color: "#fff",
                }}
                aria-label="Nächstes Bild (Pfeil rechts)"
              >
                ›
              </button>
            )}

            {/* Caption */}
            {openImage.caption && (
              <p className="px-2 text-center text-sm text-white/70">
                {openImage.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
