import type { Metadata } from "next";
import { MenuSection, MenuLegend } from "@/components/MenuSection";
import { WeinSection } from "@/components/WeinSection";
import { PageHero } from "@/components/PageHero";
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
    <main>
      <PageHero
        src="/images/hero-empfehlungen-overhead-tafel.png"
        alt="Gedeckter Tisch von oben: Pappardelle, Risotto ai funghi e tartufo, Burrata e prosciutto, Weingläser und Brot — wöchentliche Empfehlungen im Ristorante Goldoni"
      />
      <div className="px-6 pb-20 pt-12 sm:px-12 sm:pb-24">
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
          <MenuSection
            menu={menu}
            hideLegend
            extraPills={[
              { id: "weinempfehlungen", name: "Weinempfehlungen" },
              { id: "weine-weiss", name: "Weiß" },
              { id: "weine-rot", name: "Rot" },
            ]}
          />
          <WeinSection />
          <MenuLegend menu={menu} />
        </div>
      </div>
    </main>
  );
}
