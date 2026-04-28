import type { Metadata } from "next";
import { MenuSection } from "@/components/MenuSection";
import { WeinSection } from "@/components/WeinSection";
import empfehlungskarte from "@/data/empfehlungskarte.json";
import type { Menu } from "@/lib/menu";

const menu = empfehlungskarte as Menu;

export const metadata: Metadata = {
  title: "Empfehlungskarte — Ristorante Goldoni",
  description:
    "Saisonale Gerichte, Wochenangebote und Wein-Tipps aus der Kueche im Ristorante Goldoni in Stuttgart.",
};

export default function EmpfehlungenPage() {
  return (
    <main className="px-6 py-20 sm:px-12 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <p
          className="mb-3 text-xs uppercase tracking-[0.2em]"
          style={{ color: "var(--color-brand-olive)" }}
        >
          Diese Woche
        </p>
        <h1
          className="mb-10 text-4xl sm:text-5xl"
          style={{ color: "var(--color-text)" }}
        >
          {menu.title}
        </h1>
        <MenuSection menu={menu} />
        <WeinSection />
      </div>
    </main>
  );
}
