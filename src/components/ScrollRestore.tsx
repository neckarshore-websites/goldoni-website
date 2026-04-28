"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Defensive scroll-to-top on every pathname change.
 *
 * Next App Router *should* already scroll to (0, 0) on cross-route
 * <Link> navigation, but in practice we observed: after using the
 * MenuQuickJump pill click handler (which does a smooth scrollTo on
 * `/menu`) and then clicking a nav link such as "Feiern", the new
 * page rendered with the previous scroll position partially preserved
 * — landing somewhere mid-page rather than at the top.
 *
 * This component listens for pathname changes and forces an instant
 * scroll-to-top after each navigation. Cheap, idempotent, and works
 * regardless of whether the underlying Next behavior already fired.
 */
export function ScrollRestore() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    // `behavior: "instant"` bypasses any CSS smooth-scroll setting
    // (we currently don't have one, but the cast keeps it explicit).
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant" as ScrollBehavior,
    });
  }, [pathname]);

  return null;
}
