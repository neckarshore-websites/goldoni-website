import { MenuSection, MenuLegend } from "@/components/MenuSection";
import { WeinSection } from "@/components/WeinSection";
import { PageHero } from "@/components/PageHero";
import { StructuredData } from "@/components/StructuredData";
import { SundayLunchBanner } from "@/components/SundayLunchBanner";
import empfehlungskarte from "@/data/empfehlungskarte.json";
import { breadcrumbJsonLd, menuJsonLd } from "@/lib/structured-data";
import { formatMenuDate, type Menu } from "@/lib/menu";
import { pageMetadata } from "@/lib/page-metadata";

const menu = empfehlungskarte as Menu;

export const metadata = pageMetadata({
  title: "Empfehlungskarte",
  description:
    "Saisonale Gerichte, Wochenangebote und Wein-Tipps aus der Küche im Ristorante Goldoni in Stuttgart.",
  path: "/empfehlungen",
});

/**
 * ISR: regenerate at most every 6h so the temporary SundayLunchBanner can
 * auto-expire (its date check re-evaluates on each regeneration) without a
 * manual redeploy — same reason as the home page. Revert to fully static
 * once the banner is gone.
 */
export const revalidate = 21600;

export default function EmpfehlungenPage() {
  return (
    <main>
      <StructuredData
        data={breadcrumbJsonLd([
          { name: "Empfehlungen", path: "/empfehlungen" },
        ])}
      />
      <StructuredData data={menuJsonLd(menu, "/empfehlungen")} />
      {/* Sunday-lunch announcement — same temporary strip as the homepage,
          shown above the hero. Shared component: auto-expires (31 Jul 2026)
          and can be toggled off in one place for both pages. */}
      <SundayLunchBanner />
      <PageHero
        src="/images/hero-empfehlungen-overhead-tafel.webp"
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
            className="mb-2 text-4xl sm:text-5xl"
            style={{ color: "var(--color-text)" }}
          >
            {menu.title}
          </h1>
          <p
            className="mb-10 text-sm"
            style={{ color: "var(--color-brand-olive)" }}
          >
            Gültig ab {formatMenuDate(menu.updated)}*
          </p>
          <MenuSection
            menu={menu}
            hideLegend
            extraPills={[
              { id: "weine-weiss", name: "Weißweine" },
              { id: "weine-rot", name: "Rotweine" },
            ]}
          />
          <WeinSection />
          <MenuLegend
            menu={menu}
            notice={
              <>
                * Manchmal kann sich das Update unserer Empfehlungskarte ein
                wenig verspäten — dann sehen Sie hier vielleicht noch die Karte
                der Vorwoche. Wir bitten um <em>un po&rsquo; di pazienza</em>{" "}
                oder fragen Sie einfach bei uns nach: Wir verraten Ihnen gern,
                was heute frisch aus der Küche kommt.
              </>
            }
          />
        </div>
      </div>
    </main>
  );
}
