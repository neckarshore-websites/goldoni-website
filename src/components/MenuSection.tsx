import type { Menu, MenuCategory, MenuItem } from "@/lib/menu";
import { LMIV_ALLERGENS, ZZULV_ADDITIVES, HOUSE_CODES } from "@/lib/codes";
import type { Code } from "@/lib/codes";
import { MenuQuickJump } from "@/components/MenuQuickJump";

const DIET_LABEL: Record<NonNullable<MenuItem["diet"]>[number], string> = {
  vegetarian: "veg",
  vegan: "vegan",
  spicy: "scharf",
};

function MenuItemRow({ item }: { item: MenuItem }) {
  return (
    <li
      className="flex flex-col gap-1 border-b py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
      style={{ borderColor: "var(--color-border)" }}
    >
      <div className="flex-1">
        <div className="flex flex-wrap items-baseline gap-2">
          <h3
            className="text-base font-medium"
            style={{
              color: "var(--color-text)",
              fontFamily: "var(--font-sans)",
            }}
          >
            {item.name}
          </h3>
          {item.volume ? (
            <span
              className="text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              {item.volume}
            </span>
          ) : null}
          {item.allergens && item.allergens.length > 0 ? (
            <span
              className="text-xs"
              style={{ color: "var(--color-text-subtle)" }}
            >
              ({item.allergens.join(", ")})
            </span>
          ) : null}
          {item.diet?.map((d) => (
            <span
              key={d}
              className="rounded-full px-2 py-0.5 text-xs"
              style={{
                backgroundColor: "var(--color-brand-cream)",
                color: "var(--color-brand-olive)",
              }}
            >
              {DIET_LABEL[d]}
            </span>
          ))}
        </div>
        {item.description ? (
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            {item.description}
          </p>
        ) : null}
      </div>
      <div
        className="shrink-0 font-medium tabular-nums"
        style={{ color: "var(--color-text)" }}
      >
        {item.price}&nbsp;&euro;
      </div>
    </li>
  );
}

function CategoryBlock({ category }: { category: MenuCategory }) {
  return (
    <section
      id={category.id}
      // scroll-margin = sticky-header-bottom + sticky-pill-bar-bottom + 1rem
      // breathing. Both heights are written to :root by MenuQuickJump's
      // ResizeObserver effect so this stays correct across viewport changes
      // (mobile sub-nav row, mobile 3-row pill stack, desktop 1-row, …).
      // SSR fallback: 8rem (matches the previous static value).
      style={{
        scrollMarginTop:
          "calc(var(--goldoni-header-h, 4.5rem) + var(--goldoni-pills-h, 3rem) + 1rem)",
      }}
    >
      <header className="mb-4">
        <h2
          className="text-3xl"
          style={{ color: "var(--color-heading-italian)" }}
        >
          {category.name}
        </h2>
        {category.subtitle ? (
          <p
            className="mt-1 text-sm uppercase tracking-[0.2em]"
            style={{ color: "var(--color-brand-olive)" }}
          >
            {category.subtitle}
          </p>
        ) : null}
        {category.description ? (
          <p className="mt-3" style={{ color: "var(--color-text-muted)" }}>
            {category.description}
          </p>
        ) : null}
      </header>
      <ul>
        {category.items.map((item) => (
          <MenuItemRow key={item.name} item={item} />
        ))}
      </ul>
    </section>
  );
}

function CodeLegend({ title, codes }: { title: string; codes: Code[] }) {
  return (
    <div>
      <h3
        className="mb-3 text-xs font-medium uppercase tracking-[0.2em]"
        style={{ color: "var(--color-brand-olive)" }}
      >
        {title}
      </h3>
      <dl
        className="grid grid-cols-[2.25rem_1fr] gap-x-3 gap-y-1.5 text-sm"
        style={{ color: "var(--color-text-muted)" }}
      >
        {codes.map((c) => (
          <div key={c.code} className="contents">
            <dt
              className="font-mono font-medium tabular-nums"
              style={{ color: "var(--color-text)" }}
            >
              {c.code}
            </dt>
            <dd>{c.name}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function MenuSection({ menu }: { menu: Menu }) {
  return (
    <div>
      {menu.intro ? (
        <p
          className="mb-12 text-lg leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          {menu.intro}
        </p>
      ) : null}

      <MenuQuickJump categories={menu.categories} />

      <div className="space-y-16">
        {menu.categories.map((cat) => (
          <CategoryBlock key={cat.id} category={cat} />
        ))}
      </div>

      {/* Structured legend — replaces the inline footnote prose */}
      <footer
        className="mt-16 border-t pt-8"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <CodeLegend title="Allergene (LMIV)" codes={LMIV_ALLERGENS} />
          <CodeLegend title="Zusatzstoffe (ZZulV)" codes={ZZULV_ADDITIVES} />
          <CodeLegend title="Hauseigene Codes" codes={HOUSE_CODES} />
        </div>

        {menu.footnote ? (
          <p
            className="mt-8 text-xs leading-relaxed"
            style={{ color: "var(--color-text-subtle)" }}
          >
            {menu.footnote}
          </p>
        ) : null}

        <p
          className="mt-3 text-xs"
          style={{ color: "var(--color-text-subtle)" }}
        >
          Stand: {menu.updated}
        </p>
      </footer>
    </div>
  );
}
