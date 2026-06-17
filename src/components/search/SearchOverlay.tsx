"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type MiniSearch from "minisearch";
import { useSearch } from "./SearchProvider";
import type { SearchDoc, SearchType } from "@/lib/search/types";

type Hit = SearchDoc;

const TYPE_LABEL: Record<SearchType, string> = {
  page: "Seite",
  menu: "Speisekarte",
  empfehlung: "Empfehlung",
  wine: "Wein",
  faq: "FAQ",
};

/**
 * Mount point read from context. Builds the MiniSearch index lazily on first
 * open and keeps it across opens; renders the palette only while open so the
 * palette's query state resets via remount (no reset effect needed). Colours
 * come from the theme tokens (var(--color-*)) so it adapts to light/dark.
 */
export function SearchOverlay() {
  const { open, setOpen } = useSearch();
  const [mini, setMini] = useState<MiniSearch<SearchDoc> | null>(null);

  useEffect(() => {
    if (!open || mini) return;
    let cancelled = false;
    (async () => {
      const [{ default: MiniSearch }, res] = await Promise.all([
        import("minisearch"),
        fetch("/api/search-index"),
      ]);
      const docs: SearchDoc[] = await res.json();
      if (cancelled) return;
      const m = new MiniSearch<SearchDoc>({
        fields: ["title", "text"],
        storeFields: ["title", "type", "category", "url"],
        searchOptions: { prefix: true, fuzzy: 0.2, boost: { title: 2 } },
      });
      m.addAll(docs);
      setMini(m);
    })();
    return () => {
      cancelled = true;
    };
  }, [open, mini]);

  if (!open) return null;
  return <SearchPalette mini={mini} onClose={() => setOpen(false)} />;
}

function SearchPalette({
  mini,
  onClose,
}: {
  mini: MiniSearch<SearchDoc> | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo<Hit[]>(
    () => (q && mini ? (mini.search(q) as unknown as Hit[]).slice(0, 20) : []),
    [q, mini]
  );

  function go(hit: Hit) {
    onClose();
    const [path, hash] = hit.url.split("#");
    // Same-page hash: assigning location.hash fires a native `hashchange`
    // (router.push uses pushState, which does not) — so the browser scrolls
    // to the id and FaqHashOpener reveals the targeted <details>. Cross-page
    // links (and plain pages) go through the router as usual.
    if (hash && path === window.location.pathname) {
      window.location.assign(`#${hash}`);
    } else {
      router.push(hit.url);
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active]);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Suche"
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 p-4 pt-[12vh]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl shadow-2xl"
        style={{
          backgroundColor: "var(--color-bg)",
          color: "var(--color-text)",
          border: "1px solid var(--color-border)",
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <input
          ref={inputRef}
          type="search"
          role="combobox"
          aria-expanded="true"
          aria-controls="search-results"
          aria-label="Speisekarte, FAQ und Seiten durchsuchen"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
          }}
          placeholder="Gerichte, Wein, Fragen, Seiten …"
          className="w-full px-5 py-4 text-base outline-none placeholder:opacity-60"
          style={{
            backgroundColor: "transparent",
            color: "var(--color-text)",
            borderBottom: "1px solid var(--color-border)",
          }}
        />
        <ul id="search-results" role="listbox" className="max-h-[55vh] overflow-y-auto">
          {!q && (
            <li className="px-5 py-6 text-sm" style={{ color: "var(--color-text-muted)" }}>
              Tippe, um Speisekarte, Empfehlungen, Weine, FAQ &amp; Seiten zu durchsuchen.
            </li>
          )}
          {q && results.length === 0 && mini && (
            <li className="px-5 py-6 text-sm" style={{ color: "var(--color-text-muted)" }}>
              Nichts gefunden. Rufen Sie uns gern an oder schreiben Sie uns über die Kontaktseite.
            </li>
          )}
          {results.map((hit, i) => (
            <li key={hit.id} role="option" aria-selected={i === active}>
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={() => go(hit)}
                className="flex w-full flex-col items-start gap-0.5 px-5 py-3 text-left"
                style={{
                  backgroundColor:
                    i === active
                      ? "color-mix(in oklab, var(--color-accent) 12%, transparent)"
                      : "transparent",
                }}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="rounded-sm px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                    style={{
                      backgroundColor: "color-mix(in oklab, var(--color-text) 9%, transparent)",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    {TYPE_LABEL[hit.type]}
                  </span>
                  <span className="font-medium" style={{ color: "var(--color-text)" }}>
                    {hit.title}
                  </span>
                </span>
                <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                  {hit.category}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
