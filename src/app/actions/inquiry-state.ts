/**
 * Shared types and constants for the inquiry server action.
 *
 * This file is imported by both client components (ContactForm,
 * FeiernForm) and the server action (`inquiry.ts`). It must NOT carry
 * a `"use server"` directive — Next.js 15+ rejects "use server" files
 * that export anything other than async functions, and we need to
 * export the initial-state object + the discriminated-union types
 * from one place to keep the form/action contract in sync.
 *
 * The action itself stays in `inquiry.ts` and imports from here.
 */

export type InquiryType = "kontakt" | "feiern";

/**
 * The user-facing form fields whose values we echo back into the
 * form when the action returns with status "error". Without this,
 * a missing required field would clear the entire form on submit
 * — frustrating for users who filled in 6 of 7 fields correctly.
 */
export type InquiryFieldValues = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  occasion?: string;
  date?: string;
  guestCount?: string;
  preferredTime?: string;
};

export type InquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
  /**
   * Echoed-back form values. Only populated on "error" responses;
   * "success" wipes the form (panel replaces it) and "idle" has no
   * values yet. Forms read these via `defaultValue=...` so users
   * don't lose their input on validation.
   */
  values?: InquiryFieldValues;
};

export const INQUIRY_INITIAL_STATE: InquiryState = { status: "idle" };
