/**
 * FormField — shared label + input/textarea/select primitive.
 *
 * Server-rendered (no "use client") so it can sit inside both client
 * forms and any future RSC. Visual style follows the Tavola palette:
 * mozzarella inputs on cream surfaces, espresso text, salmon focus
 * ring, marinara error text.
 */

import type { ReactNode } from "react";

type CommonProps = {
  name: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  defaultValue?: string;
};

type InputProps = CommonProps & {
  as?: "input";
  type?: string;
  autoComplete?: string;
  inputMode?:
    | "text"
    | "email"
    | "tel"
    | "numeric"
    | "decimal"
    | "search"
    | "url";
  min?: number | string;
  max?: number | string;
  pattern?: string;
};

type TextareaProps = CommonProps & {
  as: "textarea";
  rows?: number;
};

type SelectProps = CommonProps & {
  as: "select";
  options: { value: string; label: string }[];
  placeholder?: string;
};

export type FormFieldProps = InputProps | TextareaProps | SelectProps;

const baseControlStyle = {
  width: "100%",
  borderRadius: "0.375rem",
  border: "1px solid var(--color-border-strong)",
  backgroundColor: "var(--color-bg)",
  color: "var(--color-text)",
  fontFamily: "var(--font-sans)",
  fontSize: "1rem",
  lineHeight: "1.5",
  padding: "0.625rem 0.75rem",
} as const;

// Chevron SVG encoded as data URI (espresso #1A1612 on cream).
// appearance:none strips the browser-default select widget so the height
// and padding match plain <input> elements exactly.
const CHEVRON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='%231A1612' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4 6l4 4 4-4'/%3E%3C/svg%3E";

const selectControlStyle = {
  ...baseControlStyle,
  // Remove native widget so height is driven by padding alone (same as input).
  appearance: "none" as const,
  WebkitAppearance: "none" as const,
  // Room for the custom chevron on the right.
  paddingRight: "2.25rem",
  backgroundImage: `url("${CHEVRON}")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 0.625rem center",
  backgroundSize: "1.125rem 1.125rem",
  cursor: "pointer",
};

export function FormField(props: FormFieldProps) {
  const id = `field-${props.name}`;
  const errId = props.error ? `${id}-err` : undefined;
  const hintId = props.hint ? `${id}-hint` : undefined;
  const describedBy = [errId, hintId].filter(Boolean).join(" ") || undefined;

  let control: ReactNode;
  if (props.as === "textarea") {
    control = (
      <textarea
        id={id}
        name={props.name}
        required={props.required}
        defaultValue={props.defaultValue}
        rows={props.rows ?? 5}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={describedBy}
        style={{ ...baseControlStyle, resize: "vertical" }}
      />
    );
  } else if (props.as === "select") {
    // `key` forces React to re-mount the <select> whenever the
    // defaultValue changes — without it the select keeps its
    // initial empty selection across `useActionState` re-renders,
    // so an error round-trip would lose the user's choice. <input>
    // and <textarea> don't need this; React tracks their value via
    // the underlying DOM state on re-render.
    control = (
      <select
        key={`${props.name}-${props.defaultValue ?? ""}`}
        id={id}
        name={props.name}
        required={props.required}
        defaultValue={props.defaultValue ?? ""}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={describedBy}
        style={selectControlStyle}
      >
        {props.placeholder ? (
          <option value="" disabled>
            {props.placeholder}
          </option>
        ) : null}
        {props.options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  } else {
    control = (
      <input
        id={id}
        name={props.name}
        type={props.type ?? "text"}
        required={props.required}
        defaultValue={props.defaultValue}
        autoComplete={props.autoComplete}
        inputMode={props.inputMode}
        min={props.min}
        max={props.max}
        pattern={props.pattern}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={describedBy}
        style={baseControlStyle}
      />
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium"
        style={{ color: "var(--color-text)" }}
      >
        {props.label}
        {props.required ? (
          <span
            aria-hidden
            className="ml-0.5"
            style={{ color: "var(--color-accent-hover)" }}
          >
            *
          </span>
        ) : null}
      </label>
      {control}
      {props.hint ? (
        <p
          id={hintId}
          className="text-xs"
          style={{ color: "var(--color-text-muted)" }}
        >
          {props.hint}
        </p>
      ) : null}
      {props.error ? (
        <p
          id={errId}
          role="alert"
          className="text-sm"
          style={{ color: "var(--color-accent-hover)" }}
        >
          {props.error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Honeypot — invisible to humans, irresistible to dumb bots.
 * Render once per form; the server action drops submissions where this
 * field is non-empty.
 */
export function Honeypot() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left: "-9999px",
        width: 1,
        height: 1,
        overflow: "hidden",
      }}
    >
      <label htmlFor="field-website">Website (bitte leer lassen)</label>
      <input
        id="field-website"
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}
