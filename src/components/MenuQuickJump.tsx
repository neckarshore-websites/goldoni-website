"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { MenuCategory } from "@/lib/menu";

/**
 * Sticky horizontal pill-bar with auto-highlighted active category.
 *
 * Uses IntersectionObserver to detect which `<section id="...">` is in
 * view; the matching pill gets the accent background. Touch-friendly on
 * mobile (75% of Goldoni traffic).
 *
 * Layout: dual-render — mobile renders 3 pills per row, desktop renders
 * 7 per row. The two trees are toggled via `sm:hidden` / `hidden sm:block`
 * so the chunking is deterministic per breakpoint instead of fragile
 * width-based flex-wrap.
 *
 * Sticky offset: the pill bar sticks below the global <header>. Because
 * header height is responsive (mobile has a sub-nav row, desktop has just
 * the main row) a hardcoded `top` value either gaps or overlaps. We
 * measure header + pill-bar heights at runtime and write them to CSS
 * custom properties on :root so:
 *   - sticky `top` = --goldoni-header-h
 *   - scroll-margin-top of each section header (in MenuSection) =
 *     --goldoni-header-h + --goldoni-pills-h + 1rem breathing
 * which guarantees the category heading lands cleanly below the sticky
 * pill bar on click — independent of viewport width or row count.
 */
const ROW_DESKTOP = 7;
const ROW_MOBILE = 3;

function chunkRows<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

export function MenuQuickJump({ categories }: { categories: MenuCategory[] }) {
  const [activeId, setActiveId] = useState<string>(categories[0]?.id ?? "");
  const barRef = useRef<HTMLDivElement>(null);

  const rowsDesktop = useMemo(
    () => chunkRows(categories, ROW_DESKTOP),
    [categories],
  );
  const rowsMobile = useMemo(
    () => chunkRows(categories, ROW_MOBILE),
    [categories],
  );

  // IntersectionObserver — track which section is currently in view to
  // highlight its pill.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-15% 0px -70% 0px",
        threshold: 0,
      },
    );

    const elements = categories
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => el !== null);

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [categories]);

  // ResizeObserver — keep CSS vars in sync with actual header + pill-bar
  // heights so sticky-top and scroll-margin always align.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const headerEl = document.querySelector("header");
    const barEl = barRef.current;
    if (!headerEl || !barEl) return;

    const update = () => {
      const headerH = headerEl.getBoundingClientRect().height;
      const barH = barEl.getBoundingClientRect().height;
      const root = document.documentElement;
      root.style.setProperty("--goldoni-header-h", `${headerH}px`);
      root.style.setProperty("--goldoni-pills-h", `${barH}px`);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(headerEl);
    ro.observe(barEl);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  const renderPill = (cat: MenuCategory) => {
    const isActive = cat.id === activeId;
    return (
      <a
        key={cat.id}
        href={`#${cat.id}`}
        data-id={cat.id}
        aria-current={isActive ? "true" : undefined}
        className="whitespace-nowrap rounded-full border px-3 py-1 text-sm transition-colors"
        style={{
          borderColor: isActive
            ? "var(--color-accent)"
            : "var(--color-border-strong)",
          color: isActive ? "var(--color-bg)" : "var(--color-text)",
          backgroundColor: isActive ? "var(--color-accent)" : "transparent",
        }}
      >
        {cat.name}
      </a>
    );
  };

  return (
    <div
      ref={barRef}
      className="menu-quickjump sticky z-10 -mx-2 mb-10"
      style={{
        top: "var(--goldoni-header-h, 4.5rem)",
        backgroundColor: "color-mix(in oklab, var(--color-bg) 92%, transparent)",
        backdropFilter: "blur(8px)",
      }}
    >
      <nav className="px-2 py-3" aria-label="Kategorien">
        {/* Mobile — 3 per row */}
        <div className="flex flex-col gap-2 sm:hidden" aria-hidden={false}>
          {rowsMobile.map((row, idx) => (
            <div
              key={`m-${idx}`}
              className="flex flex-wrap justify-center gap-2"
            >
              {row.map(renderPill)}
            </div>
          ))}
        </div>
        {/* Desktop — 7 per row */}
        <div className="hidden flex-col gap-2 sm:flex" aria-hidden={false}>
          {rowsDesktop.map((row, idx) => (
            <div
              key={`d-${idx}`}
              className="flex flex-wrap justify-center gap-2"
            >
              {row.map(renderPill)}
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}
