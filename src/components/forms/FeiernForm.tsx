"use client";

import { useActionState } from "react";
import {
  sendInquiry,
  INQUIRY_INITIAL_STATE,
} from "@/app/actions/inquiry";
import { FormField, Honeypot } from "@/components/forms/FormField";

const OCCASIONS = [
  { value: "hochzeit", label: "Hochzeit" },
  { value: "geburtstag", label: "Geburtstag" },
  { value: "taufe", label: "Taufe / Kommunion" },
  { value: "firmenfeier", label: "Firmenfeier" },
  { value: "familienfest", label: "Familienfest" },
  { value: "sonstiges", label: "Sonstiges" },
];

/**
 * Feiern-Anfrage form for /feiern — adds occasion, date, guest count,
 * preferred-time, and notes on top of the contact-form base. Phone is
 * required here (high-touch booking; the kitchen needs to call back).
 *
 * Wraps the same `sendInquiry` Server Action with `type=feiern`; the
 * action validates the celebration-specific fields server-side.
 */
export function FeiernForm() {
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
          Ihre Feieranfrage ist bei uns eingegangen. Wir rufen Sie an,
          um die Details zu besprechen.
        </p>
      </div>
    );
  }

  // Tomorrow as min-date — owners typically need 1+ day lead time.
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().slice(0, 10);

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6">
      <input type="hidden" name="type" value="feiern" />
      <Honeypot />

      <FormField
        name="name"
        label="Name"
        required
        autoComplete="name"
        error={state.fieldErrors?.name}
      />
      <FormField
        name="email"
        type="email"
        label="E-Mail"
        required
        autoComplete="email"
        inputMode="email"
        error={state.fieldErrors?.email}
      />
      <FormField
        name="phone"
        type="tel"
        label="Telefon"
        required
        autoComplete="tel"
        inputMode="tel"
        hint="Wir rufen kurz zurueck, um Details zu klaeren."
        error={state.fieldErrors?.phone}
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField
          as="select"
          name="occasion"
          label="Anlass"
          required
          options={OCCASIONS}
          placeholder="Bitte auswaehlen"
          error={state.fieldErrors?.occasion}
        />
        <FormField
          name="guestCount"
          type="number"
          label="Gaesteanzahl"
          required
          inputMode="numeric"
          min={1}
          max={120}
          error={state.fieldErrors?.guestCount}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField
          name="date"
          type="date"
          label="Wunschdatum"
          required
          min={minDate}
          error={state.fieldErrors?.date}
        />
        <FormField
          name="preferredTime"
          label="Wunschzeit (optional)"
          hint='z.B. "ab 18:00" oder "Sonntag mittags"'
          error={state.fieldErrors?.preferredTime}
        />
      </div>

      <FormField
        as="textarea"
        name="message"
        label="Anmerkungen (optional)"
        rows={4}
        hint="Allergien, Menue-Vorlieben, Besonderheiten?"
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
        {pending ? "Wird gesendet …" : "Anfrage senden"}
      </button>
    </form>
  );
}
