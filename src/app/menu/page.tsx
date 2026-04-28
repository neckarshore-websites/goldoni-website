import type { Metadata } from "next";
import { MenuSection } from "@/components/MenuSection";
import speisekarte from "@/data/speisekarte.json";
import type { Menu } from "@/lib/menu";

const menu = speisekarte as Menu;

export const metadata: Metadata = {
  title: "Speisekarte — Ristorante Goldoni",
  description:
    "Antipasti, Pasta, Pizze, Hauptgerichte und Dolci im Ristorante Goldoni in Stuttgart. Italienisch verliebte Kueche, frische Zutaten.",
};

export default function MenuPage() {
  return (
    <main className="px-6 py-20 sm:px-12 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <p
          className="mb-3 text-xs uppercase tracking-[0.2em]"
          style={{ color: "var(--color-brand-olive)" }}
        >
          Unsere Karte
        </p>
        <h1
          className="mb-10 text-4xl sm:text-5xl"
          style={{ color: "var(--color-text)" }}
        >
          {menu.title}
        </h1>
        <MenuSection menu={menu} />
      </div>
    </main>
  );
}
