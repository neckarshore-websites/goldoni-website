import { NextResponse, type NextRequest } from "next/server";
import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

/**
 * Token-gated SMTP diagnostics endpoint.
 *
 *   GET /api/smtp-verify?token=<SMTP_VERIFY_TOKEN>
 *     → runs `transporter.verify()` and returns JSON with a config snapshot
 *       (host, port, masked user/from/to, password length, leading/trailing
 *       whitespace flags) plus the exact server response. Use to debug
 *       535 EAUTH and similar failures without sending real mail.
 *
 *   GET /api/smtp-verify?token=<...>&action=send
 *     → also sends a real test email to INQUIRY_EMAIL_TO. Use sparingly.
 *
 * Token mismatch / missing token / unset SMTP_VERIFY_TOKEN env all return
 * 404 to avoid endpoint enumeration. The token must be set in Vercel
 * environment variables (Production scope) and rotated after debugging
 * is complete.
 *
 * Why this exists: a 535 EAUTH from a customer form-submit is a
 * customer-visible outage. This endpoint is the smoke-test we wished we
 * had run before yesterday's deploy — it lets us verify SMTP credentials
 * are correct without exposing the form to real users. See backlog L50
 * for the original ask.
 */

export const runtime = "nodejs"; // nodemailer is not edge-compatible
export const dynamic = "force-dynamic"; // never cache; never prerender

interface DiagResult {
  ok: boolean;
  config: {
    host: string | null;
    port: number | null;
    secure: boolean | null;
    userPreview: string | null;
    userLength: number | null;
    passLength: number | null;
    passHasLeadingWhitespace: boolean | null;
    passHasTrailingWhitespace: boolean | null;
    fromPreview: string | null;
    toPreview: string | null;
  };
  verify?: {
    ok: boolean;
    code?: string;
    response?: string;
    responseCode?: number;
    message?: string;
  };
  send?: {
    ok: boolean;
    info?: {
      messageId?: string;
      accepted?: string[];
      rejected?: string[];
      response?: string;
    };
    code?: string;
    response?: string;
    responseCode?: number;
    message?: string;
  };
}

function preview(value: string | null): string | null {
  if (!value) return null;
  if (value.length <= 6) return `[len ${value.length}]`;
  return `${value.slice(0, 3)}…${value.slice(-3)} [len ${value.length}]`;
}

function notFound(): NextResponse {
  return new NextResponse("Not Found", { status: 404 });
}

interface SmtpAddressLike {
  address?: string;
}

function addressToString(addr: string | SmtpAddressLike): string {
  if (typeof addr === "string") return addr;
  return addr.address ?? "";
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const expected = process.env.SMTP_VERIFY_TOKEN;
  const provided = request.nextUrl.searchParams.get("token");
  if (!expected || !provided || expected !== provided) return notFound();

  const wantSend = request.nextUrl.searchParams.get("action") === "send";

  const host = process.env.SMTP_HOST ?? null;
  const portRaw = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER ?? null;
  const pass = process.env.SMTP_PASS ?? null;
  const from = process.env.SMTP_FROM ?? null;
  const to = process.env.INQUIRY_EMAIL_TO ?? null;
  const portParsed = portRaw ? Number(portRaw) : NaN;
  const portValid =
    Number.isFinite(portParsed) && portParsed > 0 && portParsed <= 65535;

  const result: DiagResult = {
    ok: false,
    config: {
      host,
      port: portValid ? portParsed : null,
      secure: portValid ? portParsed === 465 : null,
      userPreview: preview(user),
      userLength: user?.length ?? null,
      passLength: pass?.length ?? null,
      passHasLeadingWhitespace: pass !== null ? pass !== pass.trimStart() : null,
      passHasTrailingWhitespace: pass !== null ? pass !== pass.trimEnd() : null,
      fromPreview: preview(from),
      toPreview: preview(to),
    },
  };

  if (!host || !portValid || !user || !pass || !from || !to) {
    return NextResponse.json(result);
  }

  const transportOptions: SMTPTransport.Options = {
    host,
    port: portParsed,
    secure: portParsed === 465,
    auth: { user, pass },
  };
  const transporter = nodemailer.createTransport(transportOptions);

  // ----- Verify -----------------------------------------------------
  try {
    await transporter.verify();
    result.verify = { ok: true };
  } catch (err) {
    const e = err as Error & {
      code?: string;
      response?: string;
      responseCode?: number;
    };
    result.verify = {
      ok: false,
      code: e.code,
      response: e.response,
      responseCode: e.responseCode,
      message: e.message,
    };
  }

  // ----- Optional send ---------------------------------------------
  if (wantSend) {
    try {
      const info = await transporter.sendMail({
        from,
        to,
        subject: "Goldoni SMTP Smoke Test",
        text:
          "Diagnostic message from /api/smtp-verify. If you see this in the " +
          "kontakt@ inbox, outbound SMTP works. Reply not required.",
      });
      const accepted = (info.accepted ?? []).map(addressToString);
      const rejected = (info.rejected ?? []).map(addressToString);
      result.send = {
        ok: rejected.length === 0,
        info: {
          messageId: info.messageId,
          accepted,
          rejected,
          response: info.response,
        },
      };
    } catch (err) {
      const e = err as Error & {
        code?: string;
        response?: string;
        responseCode?: number;
      };
      result.send = {
        ok: false,
        code: e.code,
        response: e.response,
        responseCode: e.responseCode,
        message: e.message,
      };
    }
  }

  result.ok =
    (result.verify?.ok ?? false) && (!wantSend || (result.send?.ok ?? false));
  return NextResponse.json(result);
}
