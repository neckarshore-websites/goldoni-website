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

export type InquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

export const INQUIRY_INITIAL_STATE: InquiryState = { status: "idle" };
