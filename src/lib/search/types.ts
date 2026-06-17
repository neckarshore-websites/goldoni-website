export type SearchType = "page" | "menu" | "empfehlung" | "wine" | "faq";

export type SearchDoc = {
  /** Stable unique id, e.g. `page:/menu` | `menu:antipasti:insalata-mista` | `faq:<slug>`. */
  id: string;
  type: SearchType;
  /** Dish / wine / question / page title. */
  title: string;
  /** Searchable plaintext body (description, answer, producer/region, …). */
  text: string;
  /** Human-readable group label shown under the title, e.g. "Antipasti", "FAQ". */
  category: string;
  /** Target URL — page, deep-linked menu category, or FAQ hash. */
  url: string;
};
