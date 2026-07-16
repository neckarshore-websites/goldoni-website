"use client";

import { useState, type CSSProperties } from "react";
import { formatCount } from "@/lib/limits";

/**
 * CountedTextarea — textarea with a live character counter.
 *
 * Lives in its own client component because `FormField` is deliberately
 * server-rendered (it must stay usable from an RSC). Only the counting
 * needs state, so only the counting ships JS.
 *
 * NO `maxLength` ATTRIBUTE — ON PURPOSE.
 * A hard cap cannot be exceeded, so a "you are over the limit" warning
 * could never fire; and pasting 3000 chars into a `maxLength=2000`
 * textarea makes the browser silently discard 1000 of them. That is the
 * same silent-truncation bug we are fixing, moved from the server to
 * the browser. Instead the guest may type/paste freely, sees the count
 * go red, and the Server Action rejects with the value echoed back
 * intact. Nothing is ever dropped without the guest knowing.
 *
 * A11y (repo gates a11y hard @95):
 *  - The visual counter is `aria-hidden` — announcing "1841 / 2000" on
 *    every keystroke would flood a screen reader.
 *  - A separate `aria-live="polite"` region stays empty until the limit
 *    is actually exceeded, then announces once. Signal, not noise.
 */

export interface CountedTextareaProps {
  id: string;
  name: string;
  max: number;
  required?: boolean;
  defaultValue?: string;
  rows?: number;
  invalid?: boolean;
  /** ids of hint/error elements, space-separated. */
  describedBy?: string;
  style: CSSProperties;
}

export function CountedTextarea({
  id,
  name,
  max,
  required,
  defaultValue,
  rows,
  invalid,
  describedBy,
  style,
}: CountedTextareaProps) {
  const [len, setLen] = useState(() => (defaultValue ?? "").length);
  const over = len > max;

  const counterId = `${id}-count`;
  const warnId = `${id}-overflow`;

  // The overflow warning is authoritative for the field's invalid state
  // even before submit — that is the whole point: notice *before* sending.
  const describedByAll =
    [describedBy, over ? warnId : undefined].filter(Boolean).join(" ") ||
    undefined;

  return (
    <>
      <textarea
        id={id}
        name={name}
        required={required}
        defaultValue={defaultValue}
        rows={rows ?? 5}
        onChange={(e) => setLen(e.target.value.length)}
        aria-invalid={invalid || over ? true : undefined}
        aria-describedby={describedByAll}
        style={{
          ...style,
          resize: "vertical",
          ...(over
            ? { borderColor: "var(--color-accent-hover)", borderWidth: "2px" }
            : null),
        }}
      />

      <div className="flex items-baseline justify-between gap-3">
        {/* Visual counter — hidden from AT, mirrored by the live region below. */}
        <p
          id={counterId}
          aria-hidden
          className="text-xs tabular-nums"
          style={{
            color: over
              ? "var(--color-accent-hover)"
              : "var(--color-text-muted)",
            fontWeight: over ? 600 : 400,
            marginLeft: "auto",
          }}
        >
          {formatCount(len)} / {formatCount(max)}
        </p>
      </div>

      {/* Empty until the limit is exceeded → announces exactly once. */}
      <div aria-live="polite">
        {over ? (
          <p
            id={warnId}
            className="text-sm"
            style={{ color: "var(--color-accent-hover)" }}
          >
            {formatCount(len - max)} Zeichen zu viel. Bitte kürzen Sie den
            Text auf {formatCount(max)} Zeichen — wir schneiden nichts ab,
            deshalb können wir die Anfrage so nicht annehmen.
          </p>
        ) : null}
      </div>
    </>
  );
}
