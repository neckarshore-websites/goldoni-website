/**
 * StructuredData — renders a Schema.org JSON-LD <script> tag.
 *
 * JSON-LD is the format Google requires for structured data. The
 * canonical (and only) way to inject a script body in JSX is via
 * dangerouslySetInnerHTML — this is the documented Next.js pattern
 * (https://nextjs.org/docs/app/guides/json-ld).
 *
 * Safe here because:
 *  1. Payload comes from a typed builder (restaurantJsonLd) that only
 *     reads `src/lib/site.ts` — no user input flows in.
 *  2. The closing-script escape below neutralizes the only realistic
 *     JSON-LD escape vector (a stray "</script>" in a string field).
 *
 * If this component ever consumes user-generated data, sanitize first.
 */

type Json = Record<string, unknown> | Record<string, unknown>[];

export function StructuredData({ data }: { data: Json }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
