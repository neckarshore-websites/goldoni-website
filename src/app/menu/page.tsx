import type { Metadata } from "next";
import Link from "next/link";
import { MenuSection } from "@/components/MenuSection";
import speisekarte from "@/data/speisekarte.json";
import type { Menu } from "@/lib/menu";

const menu = speisekarte as Menu;

export const metadata: Metadata = {
  title: "Speisekarte — Ristorante Goldoni",
  description:
    "Antipasti, Pasta, Pizze, Hauptgerichte und Dolci im Ristorante Goldoni in Stuttgart. Italienisch verliebte Küche, frische Zutaten.",
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
          className="mb-6 text-4xl sm:text-5xl"
          style={{ color: "var(--color-text)" }}
        >
          Speisekarten
        </h1>

        {/* Empfehlungs-Banner — leitet auf die wechselnde Empfehlungskarte */}
        <Link
          href="/empfehlungen"
          className="mb-12 flex items-center justify-between gap-4 rounded-lg border p-5 transition-opacity hover:opacity-90"
          style={{
            backgroundColor: "var(--color-brand-cream)",
            borderColor: "var(--color-brand-olive)",
          }}
        >
          <div>
            <p
              className="mb-1 text-xs font-medium uppercase tracking-[0.2em]"
              style={{ color: "var(--color-brand-olive)" }}
            >
              Diese Woche
            </p>
            <p
              className="font-medium"
              style={{ color: "var(--color-text)" }}
            >
              Aktuelle Empfehlungskarte ansehen
            </p>
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--color-text-muted)" }}
            >
              Saisonale Gerichte aus der Küche &mdash; wechselt regelmäßig.
            </p>
          </div>
          <span
            aria-hidden
            className="text-2xl"
            style={{ color: "var(--color-accent)" }}
          >
            &rarr;
          </span>
        </Link>

        <MenuSection menu={menu} />
      </div>
    </main>
  );
}
