"use client";

/**
 * ThemeToggle — stateless, DOM-driven (rauhut.com pattern).
 *
 * The active theme lives in <html data-theme="..."> (set by anti-flash
 * /public/theme-init.js before paint). We do NOT mirror it into React
 * state — that would be setState-in-effect and force a client re-render.
 *
 * Both icons are rendered always; globals.css hides the inactive one
 * via [data-theme] CSS selectors. Click toggles the attribute +
 * localStorage.
 *
 * Touch target: 44x44px minimum (Goldoni audience is 75% mobile).
 */
export function ThemeToggle() {
  const toggle = () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* no-op: storage may be disabled */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Theme wechseln (Hell / Dunkel)"
      title="Theme wechseln"
      className="inline-flex h-11 w-11 items-center justify-center rounded-md transition-colors"
      // Header is theme-fixed noir; icon uses noir-muted (warm cream-tan)
      // so it sits readable on espresso bg in both light + dark modes.
      style={{ color: "var(--color-noir-text-muted)" }}
    >
      {/* Sun — visible in DARK mode, hidden in light */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="theme-icon theme-icon-sun h-5 w-5"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      {/* Moon — visible in LIGHT mode, hidden in dark */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="theme-icon theme-icon-moon h-5 w-5"
        aria-hidden="true"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );
}
