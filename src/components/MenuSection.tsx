import type { Menu, MenuCategory, MenuItem } from "@/lib/menu";

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
    <section id={category.id} className="scroll-mt-24">
      <header className="mb-4">
        <h2 className="text-3xl" style={{ color: "var(--color-text)" }}>
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

      {/* Category quick-jump */}
      <nav
        className="sticky top-[6rem] z-10 mb-10 -mx-2 flex gap-2 overflow-x-auto px-2 py-3"
        style={{ backgroundColor: "var(--color-bg)" }}
        aria-label="Kategorien"
      >
        {menu.categories.map((cat) => (
          <a
            key={cat.id}
            href={`#${cat.id}`}
            className="whitespace-nowrap rounded-full border px-3 py-1 text-sm transition-colors"
            style={{
              borderColor: "var(--color-border-strong)",
              color: "var(--color-text)",
            }}
          >
            {cat.name}
          </a>
        ))}
      </nav>

      <div className="space-y-16">
        {menu.categories.map((cat) => (
          <CategoryBlock key={cat.id} category={cat} />
        ))}
      </div>

      {menu.footnote ? (
        <footer
          className="mt-16 border-t pt-6 text-xs leading-relaxed"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text-subtle)",
          }}
        >
          {menu.footnote}
        </footer>
      ) : null}

      <p className="mt-6 text-xs" style={{ color: "var(--color-text-subtle)" }}>
        Stand: {menu.updated}
      </p>
    </div>
  );
}
