"use client";

/**
 * AssetCard — thumbnail + modal lightbox for the /assets internal page.
 *
 * Desktop (≥ 768 px): click thumbnail → modal overlay, ESC / click outside to close.
 * Mobile (< 768 px): click thumbnail → opens image in new browser tab.
 *                    A full-screen overlay on a small viewport is unusable.
 *
 * The card layout itself is responsive:
 *   Mobile   — thumbnail full-width above the text block.
 *   Desktop  — thumbnail fixed 160 × 90 on the left, text on the right.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

export interface AssetEntry {
  id: string;
  context: string;
  target: string;
  filename?: string;
  /** AI-Prompt — for KI-generated images (Midjourney/DALL-E). */
  prompt?: string;
  /** Free-form note — for real photos that have no AI prompt. */
  note?: string;
}

/** "public/images/foo.png" → "/images/foo.png" */
function toImageUrl(target: string): string {
  return target.replace(/^public/, "");
}

export function AssetCard({ asset }: { asset: AssetEntry }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const imageUrl = toImageUrl(asset.target);
  const closeRef = useRef<HTMLButtonElement>(null);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  const handleThumbClick = useCallback(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      window.open(imageUrl, "_blank", "noopener,noreferrer");
    } else {
      openModal();
    }
  }, [imageUrl, openModal]);

  // ESC key to close
  useEffect(() => {
    if (!modalOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [modalOpen, closeModal]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
      // Move focus to close button for keyboard users
      closeRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  return (
    <>
      {/* ── Card ─────────────────────────────────────────────────────────── */}
      <div
        className="rounded-lg border overflow-hidden"
        style={{
          borderColor: "var(--color-border)",
          backgroundColor: "var(--color-bg-muted)",
        }}
      >
        {/* Thumbnail */}
        {!imgError ? (
          <button
            onClick={handleThumbClick}
            className="block w-full cursor-zoom-in overflow-hidden"
            title={`Vorschau öffnen: ${asset.context}`}
            aria-label={`Bild öffnen: ${asset.context}`}
          >
            <Image
              src={imageUrl}
              alt={asset.context}
              width={640}
              height={360}
              className="w-full aspect-video object-cover transition-opacity hover:opacity-80"
              onError={() => setImgError(true)}
              unoptimized
            />
          </button>
        ) : (
          /* Placeholder when image file doesn't exist yet */
          <div
            className="w-full aspect-video flex items-center justify-center text-sm"
            style={{
              backgroundColor: "var(--color-bg)",
              color: "var(--color-text-muted)",
            }}
          >
            <span>Noch kein Bild — Datei hochladen unter{" "}<code>{asset.target}</code></span>
          </div>
        )}

        {/* Content */}
        <div className="p-5">
          <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
            <p
              className="font-medium"
              style={{ color: "var(--color-text)" }}
            >
              {asset.context}
            </p>
            <code
              className="rounded px-1.5 py-0.5 text-xs"
              style={{
                backgroundColor: "var(--color-bg)",
                color: "var(--color-text-muted)",
                border: "1px solid var(--color-border-strong)",
              }}
            >
              {asset.target}
            </code>
          </div>
          {asset.prompt && (
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--color-text-muted)" }}
            >
              {asset.prompt}
            </p>
          )}
          {asset.note && (
            <p
              className="text-sm italic leading-relaxed"
              style={{ color: "var(--color-text-muted)" }}
            >
              {asset.note}
            </p>
          )}
        </div>
      </div>

      {/* ── Modal (desktop lightbox) ──────────────────────────────────────── */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={asset.context}
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ backgroundColor: "rgba(0,0,0,0.88)" }}
          onClick={closeModal}
        >
          {/* Prevent clicks inside the image from closing the modal */}
          <div
            className="relative flex flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              ref={closeRef}
              onClick={closeModal}
              className="absolute -top-3 -right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors"
              style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                color: "#fff",
              }}
              aria-label="Schließen (ESC)"
            >
              ✕
            </button>

            {/* Full-size image — plain <img> tag for an internal tool (no CDN needed) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={asset.context}
              className="max-h-[82vh] max-w-[88vw] w-auto h-auto rounded-lg shadow-2xl object-contain"
            />

            {/* Caption */}
            <p className="text-sm text-white/60">{asset.context}</p>
          </div>
        </div>
      )}
    </>
  );
}
