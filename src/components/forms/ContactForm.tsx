"use client";

import { useActionState } from "react";
import { sendInquiry } from "@/app/actions/inquiry";
import { INQUIRY_INITIAL_STATE } from "@/app/actions/inquiry-state";
import { FormField, Honeypot } from "@/components/forms/FormField";

/**
 * Simple contact form for /kontakt — Name, E-Mail, optional Telefon,
 * Nachricht. Wraps the shared `sendInquiry` Server Action with
 * `type=kontakt`.
 */
export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    sendInquiry,
    INQUIRY_INITIAL_STATE,
  );

  if (state.status === "success") {
    return (
      <div
        className="rounded-lg border p-8 text-center"
        style={{
          borderColor: "var(--color-border-strong)",
          backgroundColor: "var(--color-brand-cream)",
        }}
      >
        <h3
          className="mb-2 text-2xl"
          style={{ color: "var(--color-heading-italian)" }}
        >
          Grazie!
        </h3>
        <p style={{ color: "var(--color-text)" }}>
          Wir haben Ihre Nachricht erhalten und melden uns zeitnah.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6">
      <input type="hidden" name="type" value="kontakt" />
      <Honeypot />

      <FormField
        name="name"
        label="Name"
        required
        autoComplete="name"
        defaultValue={state.values?.name}
        error={state.fieldErrors?.name}
      />
      <FormField
        name="email"
        type="email"
        label="E-Mail"
        required
        autoComplete="email"
        inputMode="email"
        defaultValue={state.values?.email}
        error={state.fieldErrors?.email}
      />
      <FormField
        name="phone"
        type="tel"
        label="Telefon (optional)"
        autoComplete="tel"
        inputMode="tel"
        defaultValue={state.values?.phone}
        error={state.fieldErrors?.phone}
      />
      <FormField
        as="textarea"
        name="message"
        label="Nachricht"
        required
        rows={5}
        defaultValue={state.values?.message}
        error={state.fieldErrors?.message}
      />

      {state.status === "error" && state.message ? (
        <p
          role="alert"
          className="text-sm"
          style={{ color: "var(--color-accent-hover)" }}
        >
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md px-6 py-3 text-base font-medium transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
        style={{
          backgroundColor: "var(--color-accent)",
          color: "#FAFAFA",
        }}
      >
        {pending ? "Wird gesendet …" : "Nachricht senden"}
      </button>
    </form>
  );
}
