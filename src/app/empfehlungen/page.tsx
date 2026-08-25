import { MenuSection, MenuLegend } from "@/components/MenuSection";
import { WeinSection } from "@/components/WeinSection";
import { OrderCtaBand, OrderCtaHeadline } from "@/components/OrderCta";
import { PageHero } from "@/components/PageHero";
import { StructuredData } from "@/components/StructuredData";
import { SundayBanner } from "@/components/SundayBanner";
import {
  HolidayBanner,
  isSummerClosureWindow,
} from "@/components/HolidayBanner";
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
 * ISR: regenerate at most every 6h so the temporary SundayBanner can
 * auto-expire (its date check re-evaluates on each regeneration) without a
 * manual redeploy — same reason as the home page. Revert to fully static
 * once the banner is gone.
 */
export const revalidate = 21600;

export default function EmpfehlungenPage() {
  const geschlossen = isSummerClosureWindow();

  return (
    <main>
      <StructuredData
        data={breadcrumbJsonLd([
          { name: "Empfehlungen", path: "/empfehlungen" },
        ])}
      />
      <StructuredData data={menuJsonLd(menu, "/empfehlungen")} />
      {/*
        Genau EIN Streifen ueber dem Hero, und welcher, entscheidet die
        Schliessung.

        WAEHREND DER SCHLIESSUNG (ab 3. August) das Urlaubsbanner. Diese Seite
        braucht es dringender als die Startseite: sie zeigt "Diese Woche" und
        eine vollstaendige Karte mit Preisen. Ohne Hinweis liest ein Gast im
        August eine Wochenkarte fuer eine Kueche, die drei Wochen zu ist — das
        ist nicht nur eine verpasste Gelegenheit, das ist eine falsche Auskunft.

        VORHER das Sonntagsbanner, wie bisher. Bewusst NICHT schon in der
        Ankuendigungsphase (30. Juli bis 2. August) das Urlaubsbanner:
        Betreiber-Entscheidung 2026-07-30. Wer in dieser Woche die Karte liest,
        soll die Karte sehen, nicht die Absage. Die Ankuendigung steht in dieser
        Phase auf der Startseite, wo sie den Besuch anstossen kann, statt ihn
        auf der Speisekarte selbst zu bremsen.

        Die beiden schliessen sich exakt aneinander an, nicht ungefaehr:
        SundayBanner laeuft am 2026-08-03T00:00+02:00 ab, isSummerClosureWindow()
        beginnt an derselben Sekunde. Das Entweder-Oder ist deshalb heute schon
        redundant — es steht hier trotzdem, weil die beiden Daten in ZWEI
        Dateien von Hand gepflegt werden. Zoege jemand die Schliessung naechstes
        Jahr vor, ohne den Sonntags-Cutoff mitzuziehen, lade diese Seite sonst
        waehrend der Betriebsferien zum Sonntagsessen ein. Die Startseite ist
        gegen genau das bereits abgesichert; diese war es nicht.
      */}
      {geschlossen ? <HolidayBanner /> : <SundayBanner />}
      <PageHero
        src="/images/hero-empfehlungen-overhead-tafel.webp"
        alt="Gedeckter Tisch von oben: Pappardelle, Risotto ai funghi e tartufo, Burrata e prosciutto, Weingläser und Brot — wöchentliche Empfehlungen im Ristorante Goldoni"
      />
      <div className="px-6 pb-20 pt-12 sm:px-12 sm:pb-24">
        <div className="mx-auto max-w-3xl">
          {/* Kopfzeile — Überschrift und Gültigkeitsdatum links, Bestell-CTA
              rechts (nur Desktop). Das Datum bleibt beim Titel: wer bestellt,
              soll sehen, von wann die Karte ist. */}
          <div className="mb-10 flex items-start justify-between gap-8">
            <div>
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
                className="text-sm"
                style={{ color: "var(--color-brand-olive)" }}
              >
                Gültig ab {formatMenuDate(menu.updated)}*
              </p>
            </div>
            <OrderCtaHeadline />
          </div>
          <MenuSection
            menu={menu}
            hideLegend
            extraPills={[
              { id: "weine-weiss", name: "Weißweine" },
              { id: "weine-rot", name: "Rotweine" },
            ]}
            /* Ein Streifen, nicht zwei: die Empfehlungskarte hat vier
               Kategorien, keine zehn. Er steht nach Primi & Pizze, wo auf
               dieser Seite die Bestellabsicht am höchsten ist. */
            slots={[
              {
                afterId: "primi-pizze",
                node: (
                  <OrderCtaBand text="Diese Gerichte gibt es auch zum Mitnehmen oder nach Hause." />
                ),
              },
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
