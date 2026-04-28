"use client";

import { useEffect, useState } from "react";
import type { MenuCategory } from "@/lib/menu";

/**
 * Sticky horizontal pill-bar with auto-highlighted active category.
 *
 * Uses IntersectionObserver to detect which `<section id="...">` is in
 * view; the matching pill gets the accent background. Touch-friendly on
 * mobile (75% of Goldoni traffic). Hidden scrollbar — fade-edge gradients
 * hint that more pills exist off-screen.
 */
export function MenuQuickJump({ categories }: { categories: MenuCategory[] }) {
  const [activeId, setActiveId] = useState<string>(categories[0]?.id ?? "");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top of the viewport that is intersecting.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        // Trigger when the section's top is in the upper third of the viewport.
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

  return (
    <div
      className="menu-quickjump sticky top-[5.5rem] z-10 -mx-2 mb-10 md:top-[4.5rem]"
      style={{
        backgroundColor: "color-mix(in oklab, var(--color-bg) 92%, transparent)",
        backdropFilter: "blur(8px)",
      }}
    >
      <nav
        className="flex flex-wrap gap-2 px-2 py-3"
        aria-label="Kategorien"
      >
        {categories.map((cat) => {
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
                backgroundColor: isActive
                  ? "var(--color-accent)"
                  : "transparent",
              }}
            >
              {cat.name}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
