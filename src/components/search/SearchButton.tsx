"use client";
import { useSearch } from "./SearchProvider";

/**
 * Header search trigger. The header is theme-fixed noir, so the button uses
 * the noir tokens regardless of light/dark. The ⌘K hint is desktop-only.
 */
export function SearchButton() {
  const { setOpen } = useSearch();
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label="Suche öffnen"
      className="inline-flex items-center gap-2 rounded-md px-2.5 py-2 text-sm transition-colors"
      style={{
        color: "var(--color-noir-text)",
        border: "1px solid var(--color-noir-border)",
      }}
    >
      <svg
        aria-hidden
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <span
        className="hidden text-xs sm:inline"
        style={{ color: "var(--color-noir-eyebrow)" }}
      >
        ⌘K
      </span>
    </button>
  );
}
