import type { Metadata } from "next";
import Link from "next/link";
import { MenuSection } from "@/components/MenuSection";
import { PageHero } from "@/components/PageHero";
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
    <main>
      <PageHero
        src="/images/hero-menu-dishes.png"
        alt="Auswahl italienischer Gerichte im Ristorante Goldoni — Carpaccio, Pasta und Burrata von oben"
      />
      <div className="px-6 pb-20 pt-12 sm:px-12 sm:pb-24">
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
            backgroundColor: "#A69B00",
            borderColor: "#8A8100",
          }}
        >
          <div>
            <p
              className="mb-1 text-xs font-medium uppercase tracking-[0.2em]"
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              Diese Woche
            </p>
            <p
              className="font-medium"
              style={{ color: "#FAFAFA" }}
            >
              Aktuelle Empfehlungskarte ansehen
            </p>
            <p
              className="mt-1 text-sm"
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              Saisonale Gerichte aus der Küche &mdash; wechselt wöchentlich.
            </p>
          </div>
          <span
            aria-hidden
            className="text-2xl"
            style={{ color: "#FAFAFA" }}
          >
            &rarr;
          </span>
        </Link>

        <MenuSection menu={menu} />
      </div>
      </div>
    </main>
  );
}
