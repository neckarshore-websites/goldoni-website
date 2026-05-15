import Link from "next/link";
import { MenuSection } from "@/components/MenuSection";
import { HausweinSection } from "@/components/HausweinSection";
import { PageHero } from "@/components/PageHero";
import { StructuredData } from "@/components/StructuredData";
import speisekarte from "@/data/speisekarte.json";
import { breadcrumbJsonLd, menuJsonLd } from "@/lib/structured-data";
import type { Menu } from "@/lib/menu";
import { pageMetadata } from "@/lib/page-metadata";

const menu = speisekarte as Menu;

export const metadata = pageMetadata({
  title: "Speisekarte",
  description:
    "Antipasti, Pasta, Pizze, Hauptgerichte und Dolci im Ristorante Goldoni in Stuttgart. Italienisch verliebte Küche, frische Zutaten.",
  path: "/menu",
});

export default function MenuPage() {
  return (
    <main>
      <StructuredData
        data={breadcrumbJsonLd([{ name: "Speisekarte", path: "/menu" }])}
      />
      <StructuredData data={menuJsonLd(menu, "/menu")} />
      <PageHero
        src="/images/hero-menu-dishes.webp"
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

        {/* Empfehlungs-Banner — leitet auf die wechselnde Empfehlungskarte.
            Tokens (--color-bg-olive + --color-on-olive*) ensure WCAG AA
            contrast in both light and dark themes; previous hardcoded
            #A69B00 was the dark-mode olive used in light-mode bg, which
            failed the 4.5 contrast ratio against #FAFAFA. */}
        <Link
          href="/empfehlungen"
          className="mb-12 flex items-center justify-between gap-4 rounded-lg p-5 transition-opacity hover:opacity-90"
          style={{
            backgroundColor: "var(--color-bg-olive)",
            color: "var(--color-on-olive)",
          }}
        >
          <div>
            <p
              className="mb-1 text-xs font-medium uppercase tracking-[0.2em]"
              style={{ color: "var(--color-on-olive-muted)" }}
            >
              Diese Woche
            </p>
            <p className="font-medium">
              Aktuelle Empfehlungskarte ansehen
            </p>
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--color-on-olive-muted)" }}
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

        <MenuSection
          menu={menu}
          extraPills={[
            { id: "hauswein", name: "Hausweine", insertAfter: "benvenuti" },
          ]}
          slots={[{ afterId: "benvenuti", node: <HausweinSection /> }]}
        />
      </div>
      </div>
    </main>
  );
}
