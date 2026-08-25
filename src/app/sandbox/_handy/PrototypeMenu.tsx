import Link from "next/link";
import { MenuSection } from "@/components/MenuSection";
import { OrderFab } from "@/components/OrderFab";
import { PageHero } from "@/components/PageHero";
import speisekarte from "@/data/speisekarte.json";
import { STOREFRONT_PARTNER } from "@/lib/site";
import type { Menu } from "@/lib/menu";

const menu = speisekarte as Menu;

/**
 * Handy-Prototyp der Bestell-CTAs — zwei Varianten, echte Speisekarte.
 *
 * Bewusst die VOLLE Karte mit allen zehn Kategorien und nicht ein Ausschnitt:
 * die Frage ist, wie sich der Knopf über eine lange Karte hinweg anfühlt.
 * Auf dem Handy trägt die Pillenleiste bei dieser Karte vier Zeilen — genau
 * das ist die Grösse, die beurteilt werden soll.
 *
 * Beide Varianten treiben die echten Komponenten, keine Nachbauten.
 */
export function PrototypeMenu({ variant }: { variant: "a" | "b" }) {
  const isA = variant === "a";

  return (
    <main>
      <div
        className="px-6 py-3 text-sm sm:px-12"
        style={{
          backgroundColor: "var(--color-bg-olive)",
          color: "var(--color-on-olive)",
        }}
      >
        <p className="mx-auto max-w-3xl">
          <strong className="font-medium">
            Prototyp {isA ? "A" : "B"} —{" "}
            {isA ? "Knopf in der Kategorieleiste" : "schwebender Knopf"}.
          </strong>{" "}
          Interne Vorschau, nicht die Live-Seite. Am besten am Telefon ansehen.{" "}
          <Link
            href={isA ? "/sandbox/handy-b" : "/sandbox/handy-a"}
            className="underline"
          >
            Zur Variante {isA ? "B" : "A"}
          </Link>{" "}
          ·{" "}
          <Link href="/sandbox" className="underline">
            Sandbox
          </Link>
        </p>
      </div>

      <PageHero
        src="/images/hero-menu-dishes.webp"
        alt="Auswahl italienischer Gerichte im Ristorante Goldoni"
      />
      <div className="px-6 pb-24 pt-12 sm:px-12">
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

          <MenuSection
            menu={menu}
            quickJumpOrderCta={
              isA
                ? { label: "Bestellen", href: STOREFRONT_PARTNER.url }
                : undefined
            }
          />
        </div>
      </div>

      {!isA && <OrderFab />}
    </main>
  );
}
