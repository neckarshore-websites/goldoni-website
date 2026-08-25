import Link from "next/link";
import { MenuSection } from "@/components/MenuSection";
import { OrderCtaHeadline } from "@/components/OrderCta";
import { OrderFab } from "@/components/OrderFab";
import { PageHero } from "@/components/PageHero";
import speisekarte from "@/data/speisekarte.json";
import { STOREFRONT_PARTNER } from "@/lib/site";
import type { Menu } from "@/lib/menu";

const menu = speisekarte as Menu;

const VARIANT_LABEL = {
  a: "Knopf in der Kategorieleiste (Handy)",
  b: "schwebender Knopf (Handy)",
  c: "schwebender Knopf statt Streifen (Desktop)",
} as const;

const VARIANT_PATH = {
  a: "/sandbox/handy-a",
  b: "/sandbox/handy-b",
  c: "/sandbox/desktop-c",
} as const;

const OTHER_VARIANTS = {
  a: ["b", "c"],
  b: ["a", "c"],
  c: ["a", "b"],
} as const;

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
export function PrototypeMenu({ variant }: { variant: "a" | "b" | "c" }) {
  const isA = variant === "a";
  const isC = variant === "c";

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
            Prototyp {variant.toUpperCase()} — {VARIANT_LABEL[variant]}.
          </strong>{" "}
          Interne Vorschau, nicht die Live-Seite.{" "}
          {isC
            ? "Am Bildschirm ansehen — diese Variante meint den Desktop."
            : "Am besten am Telefon ansehen."}{" "}
          {OTHER_VARIANTS[variant].map((v) => (
            <span key={v}>
              <Link href={VARIANT_PATH[v]} className="underline">
                Zur Variante {v.toUpperCase()}
              </Link>{" "}
              ·{" "}
            </span>
          ))}
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
          <div className="mb-6 flex items-start justify-between gap-8">
            <h1
              className="text-4xl sm:text-5xl"
              style={{ color: "var(--color-text)" }}
            >
              Speisekarten
            </h1>
            {isC && <OrderCtaHeadline />}
          </div>

          {/* Variante C spiegelt die Live-Seite MINUS der beiden Streifen:
              Knopf bei der Ankunft, schwebender Knopf fuer den Rest. Deshalb
              steht hier bewusst keine `slots`-Angabe. */}
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

      {variant === "b" && <OrderFab visibility="mobile" />}
      {isC && <OrderFab visibility="desktop" />}
    </main>
  );
}
