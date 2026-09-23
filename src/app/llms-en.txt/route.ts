import { buildLlmsTxt } from "@/lib/llms";

// Static at build time — regenerates with every deploy, i.e. with every card swap.
export const dynamic = "force-static";

export function GET(): Response {
  return new Response(buildLlmsTxt("en"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
