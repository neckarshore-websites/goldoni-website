"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { MenuCategory } from "@/lib/menu";

/**
 * Sticky horizontal pill-bar with auto-highlighted active category.
 *
 * Layout: dual-render — mobile renders 3 pills per row, desktop renders
 * 7 per row. The two trees are toggled via `sm:hidden` / `hidden sm:flex`
 * so the chunking is deterministic per breakpoint.
 *
 * Sticky offset: the pill bar sticks below the global <header>. Header
 * height is responsive (mobile has a sub-nav row), and the pill bar's
 * own height varies with row count (Speisekarte 4 mobile rows ≈ 200px,
 * Empfehlungskarte 2 ≈ 100px). We measure both at runtime and write
 * them to CSS custom properties on :root.
 *
 * Click navigation: a JS click handler reads the live measured offsets
 * at click time and uses window.scrollTo to land the heading exactly
 * below the sticky bar. This bypasses CSS `scroll-margin-top`, which
 * had a race condition with the ResizeObserver — on the first click
 * after page load the var hadn't been measured yet, the SSR fallback
 * was too small for tall pill bars, and the page scrolled past the
 * target heading (Antipasti → user sees Primi Piatti).
 *
 * Active highlight: scroll-listener (rAF-throttled) finds the
 * most-recently-scrolled-past section based on `top - stickyBottom`.
 * Replaced the previous IntersectionObserver because its rootMargin
 * `"-15% 0px -70% 0px"` evaluated to a band that — on Speisekarte
 * mobile — sat entirely *behind* the sticky pill bar, so no section
 * ever registered as intersecting. Now the active state is derived
 * from real geometry, every scroll frame.
 *
 * extraPills: optional additional pills appended after menu categories.
 * Used on /empfehlungen to add Weiß / Rot wine-section anchors without
 * coupling WeinSection into the menu data model.
 */
const ROW_DESKTOP = 7;
const ROW_MOBILE = 3;
const BREATHING_PX = 16;

export interface ExtraPill {
  id: string;
  name: string;
  /**
   * Optional anchor: insert this pill directly after the named category
   * in the pill bar. Mirrors MenuSection's `slots[]` mechanism so pill
   * order matches the rendered page order. Omit to append at the end
   * (legacy behavior, kept for backwards-compat with /empfehlungen).
   */
  insertAfter?: string;
}

function chunkRows<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

export function MenuQuickJump({
  categories,
  extraPills = [],
}: {
  categories: MenuCategory[];
  extraPills?: ExtraPill[];
}) {
  // Unified pill list — categories interleaved with positional extraPills,
  // then trailing extraPills (no `insertAfter`) appended at the end.
  const allPills = useMemo<ExtraPill[]>(() => {
    const positional = extraPills.filter((p) => p.insertAfter);
    const trailing = extraPills.filter((p) => !p.insertAfter);
    const result: ExtraPill[] = [];
    for (const cat of categories) {
      result.push({ id: cat.id, name: cat.name });
      for (const ep of positional) {
        if (ep.insertAfter === cat.id) result.push(ep);
      }
    }
    result.push(...trailing);
    return result;
  }, [categories, extraPills]);

  const [activeId, setActiveId] = useState<string>(allPills[0]?.id ?? "");
  const barRef = useRef<HTMLDivElement>(null);

  const rowsDesktop = useMemo(
    () => chunkRows(allPills, ROW_DESKTOP),
    [allPills],
  );
  const rowsMobile = useMemo(
    () => chunkRows(allPills, ROW_MOBILE),
    [allPills],
  );

  // Returns the y-coordinate (in viewport space) just below the
  // header + sticky pill bar. Anything ABOVE this is obscured.
  const getStickyBottom = (): number => {
    const headerEl = document.querySelector("header");
    const barEl = barRef.current;
    if (!headerEl || !barEl) return 0;
    const headerBottom = headerEl.getBoundingClientRect().bottom;
    const barH = barEl.getBoundingClientRect().height;
    return headerBottom + barH;
  };

  // Active-highlight: rAF-throttled scroll listener. Walks all pills in
  // order; the LAST one whose top is at-or-above the sticky bottom is
  // the section currently sitting at the top of the visible content area.
  useEffect(() => {
    if (typeof window === "undefined") return;
    let raf = 0;

    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const stickyBottom = getStickyBottom();
        let active = allPills[0]?.id ?? "";
        for (const pill of allPills) {
          const el = document.getElementById(pill.id);
          if (!el) continue;
          const top = el.getBoundingClientRect().top;
          // Section's top has crossed under (or is right below) the sticky bar.
          if (top - stickyBottom <= BREATHING_PX + 16) {
            active = pill.id;
          } else {
            break;
          }
        }
        setActiveId(active);
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [allPills]);

  // ResizeObserver — keep --goldoni-header-h / --goldoni-pills-h vars
  // in sync with reality. Used by the sticky `top` and as a
  // scroll-margin fallback (in case JS click handler ever fails).
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

  // JS click handler — guarantees correct landing position by reading
  // live measured offsets at click time. Bypasses CSS scroll-margin to
  // avoid the SSR-fallback-vs-measured race.
  const onPillClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    // Respect modifier-key clicks (open in new tab etc.) and the
    // not-yet-mounted edge case.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const stickyBottom = getStickyBottom();
    const targetY =
      el.getBoundingClientRect().top + window.scrollY - stickyBottom -
      BREATHING_PX;
    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: "smooth",
    });
    // Intentionally NOT updating window.location.hash via replaceState —
    // doing so left the URL as `/menu#birra` and confused Next App Router's
    // cross-page scroll restoration on the next nav-link click (clicking
    // "Feiern" landed scroll-position somewhere mid-page instead of 0).
    // The pill highlight + smooth scroll already give the user enough
    // feedback; persistent deep-linking to a section is not a current
    // requirement.
    setActiveId(id);
  };

  const renderPill = (pill: ExtraPill) => {
    const isActive = pill.id === activeId;
    return (
      <a
        key={pill.id}
        href={`#${pill.id}`}
        data-id={pill.id}
        aria-current={isActive ? "true" : undefined}
        onClick={(e) => onPillClick(e, pill.id)}
        className="whitespace-nowrap rounded-full border px-3 py-1 text-sm transition-colors"
        style={{
          borderColor: isActive
            ? "var(--color-accent)"
            : "var(--color-border-strong)",
          color: isActive ? "var(--color-bg)" : "var(--color-text)",
          backgroundColor: isActive ? "var(--color-accent)" : "transparent",
        }}
      >
        {pill.name}
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
        <div className="flex flex-col gap-2 sm:hidden">
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
        <div className="hidden flex-col gap-2 sm:flex">
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
