import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { formatPrice, PRICE_PATTERN } from "../../src/lib/price";

/**
 * One price format everywhere: "30,00 €" (Founder decision 2026-09-23).
 * Before, dishes read "16,00 €" and wines "€ 30,–", because the wine data
 * held ready-made display strings. This binds the DATA to one shape and
 * the components to one formatter.
 */

let checks = 0;
function check(name: string, fn: () => void): void {
  fn();
  checks++;
  console.log(`ok - ${name}`);
}

const data = (f: string) => JSON.parse(readFileSync(join(process.cwd(), "src/data", f), "utf8"));
const prices: { where: string; value: string }[] = [];
const collect = (node: unknown, where: string) => {
  if (Array.isArray(node)) return node.forEach((n) => collect(n, where));
  if (!node || typeof node !== "object") return;
  for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
    if (/^price/i.test(k) && typeof v === "string") prices.push({ where: `${where}.${k}`, value: v });
    else collect(v, where);
  }
};
for (const f of ["speisekarte.json", "empfehlungskarte.json", "weinempfehlungen.json"]) collect(data(f), f);

check("enough prices read (data format unchanged)", () => {
  assert.ok(prices.length > 80, `only ${prices.length} prices found`);
});
check('every stored price is a decimal string like "30.00"', () => {
  const bad = prices.filter((p) => !PRICE_PATTERN.test(p.value)).map((p) => `${p.where}: ${p.value}`);
  assert.deepEqual(bad, []);
});
check('formatPrice: comma, two decimals, euro sign right after a no-break space', () => {
  assert.equal(formatPrice("30.00"), "30,00 €");
  assert.equal(formatPrice("8.50"), "8,50 €");
  assert.equal(formatPrice("110.00"), "110,00 €");
});
check('formatPrice refuses display strings ("30,–", "16", "€ 8,50")', () => {
  for (const v of ["30,–", "16", "€ 8,50", "8,50", "8.5"]) assert.throws(() => formatPrice(v), /is not a decimal string/, v);
});
check("no component places the euro sign itself", () => {
  const dir = join(process.cwd(), "src/components");
  const offenders = readdirSync(dir)
    .filter((f) => f.endsWith(".tsx"))
    .filter((f) => /€&thinsp;|&euro;|\{"\s*"\}€/.test(readFileSync(join(dir, f), "utf8")));
  assert.deepEqual(offenders, []);
});

console.log(`\n${checks} checks passed`);
console.log(`${checks} passed, 0 failed`);
