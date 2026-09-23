/**
 * One price format for every menu on the site: "30,00 €".
 *
 * Founder decision 2026-09-23: euro sign on the RIGHT, separated by a
 * non-breaking space, always two decimals ("16,00 €", never "16,–" or
 * "€ 16,–"). Until then dishes and wines disagreed: dishes were stored as
 * "16.00" and formatted here-ish, wines were stored as ready-made display
 * strings copied from the owner's card ("30,–") with the sign in front.
 *
 * Data stores prices as decimal strings with a dot ("30.00") — stable to
 * sort, compare and emit into schema.org; this function is the only place
 * that turns them into what a guest reads. tests/delivery/preise.test.ts
 * rejects any stored price that is not in that shape.
 */
export const PRICE_PATTERN = /^\d+\.\d{2}$/;

const NBSP = " ";

export function formatPrice(price: string): string {
  if (!PRICE_PATTERN.test(price)) {
    throw new Error(`formatPrice: "${price}" is not a decimal string like "30.00"`);
  }
  return `${price.replace(".", ",")}${NBSP}€`;
}
