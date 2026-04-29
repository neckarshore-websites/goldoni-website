import type { Faq } from "@/data/faqs";

/**
 * Renders a list of frequently-asked questions as accessible
 * <details>/<summary> disclosure widgets — no JavaScript required,
 * keyboard-operable out of the box.
 *
 * Visual: cream-on-cream block to sit calmly at the bottom of the
 * homepage. Eyebrow uses the olive brand token, headline matches
 * the other section headings on /, items separated by a hairline
 * border. The marker switches from "+" (closed) to "−" (open) via
 * the open attribute selector.
 */
export function FaqSection({ faqs }: { faqs: readonly Faq[] }) {
  return (
    <section
      className="px-6 py-20 sm:px-12 sm:py-24"
      style={{
        backgroundColor: "var(--color-bg-muted)",
        color: "var(--color-text)",
      }}
    >
      <div className="mx-auto max-w-3xl">
        <p
          className="mb-3 text-center text-xs uppercase tracking-[0.25em]"
          style={{ color: "var(--color-brand-olive)" }}
        >
          Gut zu wissen
        </p>
        <h2 className="mb-10 text-center text-3xl sm:text-4xl">
          Häufige Fragen
        </h2>
        <ul className="space-y-0">
          {faqs.map((faq, idx) => (
            <li
              key={faq.question}
              className={
                idx === 0
                  ? "border-t"
                  : ""
              }
              style={{
                borderTopColor: "var(--color-text-subtle)",
                borderBottom: "1px solid var(--color-text-subtle)",
                opacity: 1,
              }}
            >
              <details className="group">
                <summary
                  className="flex cursor-pointer items-center justify-between gap-4 py-5 text-base font-medium leading-snug sm:text-lg"
                  style={{ color: "var(--color-text)" }}
                >
                  <span>{faq.question}</span>
                  <span
                    aria-hidden
                    className="select-none text-xl leading-none transition-transform group-open:rotate-45"
                    style={{ color: "var(--color-brand-olive)" }}
                  >
                    +
                  </span>
                </summary>
                <p
                  className="pb-5 pr-8 text-base leading-relaxed sm:text-lg"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {faq.answer}
                </p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
