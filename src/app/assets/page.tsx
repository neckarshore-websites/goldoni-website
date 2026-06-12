import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { AssetCard } from "@/components/AssetCard";
import type { AssetEntry } from "@/components/AssetCard";

/**
 * Does the asset's target file exist on disk? Evaluated at build time (this is
 * a server component). A spec'd-but-not-yet-generated asset returns false, so
 * AssetCard renders the placeholder instead of an <img src> that would 404 —
 * keeping the internal /assets page off the cross-site link-crawler's report.
 */
function targetExists(target: string): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), target));
  } catch {
    return false;
  }
}

export const metadata: Metadata = {
  title: "Assets — Ristorante Goldoni (intern)",
  robots: { index: false, follow: false },
};

// AI-Generator (Midjourney/DALL-E) liefert PNG. Hero-Bilder MÜSSEN
// für Lighthouse-LCP zu WebP konvertiert werden, bevor sie comitted
// werden:
//
//   cwebp -q 85 -m 6 input.png -o output.webp
//
// Hintergrund: 16:9-Hero im Original-PNG ist 2.4-2.5 MB. Next.js
// optimiert zwar zur Laufzeit, aber Cold-Cache-Conversion frisst
// LCP-Budget auf Mobile. WebP-Source bringt Mobile-Performance
// von 94 → 96+ (Lighthouse-Audit 2026-04-30).
const ASSETS: AssetEntry[] = [
  // ── Hero-Images ──────────────────────────────────────────────────────────
  {
    id: "hero-menu",
    context: "Speisekarte — Hero",
    target: "public/images/hero-menu-dishes.webp",
    filename: "hero-menu-dishes.webp",
    prompt:
      "Real food photography, natural colors, no warm filter. Overhead flat-lay of Italian fine dining dishes on a dark wooden table: carpaccio, fresh pasta with mushrooms and parmesan, burrata with tomatoes and pesto, bread bowl, olive oil dips, red and white wine glasses, linen napkins, silver cutlery. Even soft diffused light, accurate colors. Aspect ratio 16:9.",
  },
  {
    id: "hero-empfehlungen",
    context: "Empfehlungskarte — Hero (aktiv)",
    target: "public/images/hero-empfehlungen-overhead-tafel.webp",
    prompt:
      "Real food photography, natural colors. Overhead flat-lay of a full Italian restaurant table: Pappardelle al ragù, Risotto ai funghi e tartufo, Burrata e prosciutto crudo, olive oil, sea salt, white wine glass, two red wine glasses, water glasses, linen napkins, silver cutlery, bread with grissini on a wooden board. Dark walnut table, soft diffused natural light. Editorial, no people. Aspect ratio 16:9.",
  },
  {
    id: "hero-empfehlungen-alt",
    context: "Empfehlungskarte — Hero (Alternative, ungenutzt)",
    target: "public/images/empfehlungen-tagliatelle-tartufo-kerze.png",
    prompt:
      "A wide-format cinematic food photography scene for an Italian restaurant weekly specials menu. A rustic wooden table with a single elegantly plated seasonal pasta dish — perhaps pappardelle with wild mushrooms and truffle — on a simple white ceramic plate. Soft candlelight from the left, a glass of deep red wine slightly out of focus in the background, linen napkin folded beside the plate. Warm espresso and amber tones, shallow depth of field, muted highlights. No text, no people. Style: editorial Italian trattoria, moody and intimate, shot on film. Aspect ratio 16:9.",
  },
  {
    id: "hero-menu-classic",
    context: "Speisekarte — Hero (Alternative)",
    target: "public/images/hero-menu-classic.png",
    prompt:
      "Real restaurant photography, natural colors, no warm filter. A close-up of a worn leather-bound menu lying closed on a dark wooden table. Beside it: a single unlit white pillar candle, two empty crystal wine glasses. Background: soft out-of-focus restaurant interior. Neutral to cool tones. No text on the menu cover. No people. Shot from a 30-degree angle. Aspect ratio 16:9.",
  },

  // ── Feiern — Echte Fotos (aktiv auf /feiern) ────────────────────────────
  // Hochkant-Originals + ein 16:9-Crop für den Hero. Authentische Saal-
  // Eindrücke ersetzen die KI-generierten Fallback-Versionen weiter unten.
  {
    id: "feiern-real-hero",
    context: "Feiern — Hero (16:9 Crop von F1, aktiv)",
    target: "public/images/hero-feiern-saal.webp",
    note:
      "Echtes Foto. 16:9-Crop (1053×592) aus F1 — zeigt rote Decke, Bogenfenster und Tafel-Mitte mit Tischdeko. Wenn ein anderer Crop gewünscht ist: cwebp -crop x y w h auf das Original im Downloads/Feste/-Ordner.",
  },
  {
    id: "feiern-real-1",
    context: "Feiern — Saal mit Bogenfenstern (Galerie)",
    target: "public/images/feiern-saal-bogenfenster-tafel.webp",
    note:
      "Echtes Foto, hochkant 1053×1258. Lange Tafel mit goldenen Stuhlhussen, weißen Lilien und gelben Rosen — helles Tageslicht durch die Bogenfenster.",
  },
  {
    id: "feiern-real-2",
    context: "Feiern — Kandelaber-Detail (Galerie)",
    target: "public/images/feiern-kandelaber-rosen-lilien.webp",
    note:
      "Echtes Foto, hochkant 1136×1534. Goldener Kandelaber mit weißen Kerzen, weißen Lilien, gelben Rosen und Efeu — Tischdeko-Close-up.",
  },
  {
    id: "feiern-real-3",
    context: "Feiern — Tafel von oben (Galerie)",
    target: "public/images/feiern-tafel-aus-naehe.webp",
    note:
      "Echtes Foto, hochkant 1163×1255. Eingedeckte Festtafel — weiße Teller, Kristallgläser, Stuhlhussen mit goldenem Band, Tischdeko aus Kandelabern und Blumen.",
  },
  {
    id: "feiern-real-4",
    context: "Feiern — Saal mit historischen Bannern (Galerie)",
    target: "public/images/feiern-saal-historische-banner.webp",
    note:
      "Echtes Foto, hochkant 1172×1471. Saal mit historischen Wandbannern (Ludwig Köller von Leinroden, 1872), Spiegel, Holzvertäfelung und Doppel-Tafel.",
  },

  // ── Feiern — KI-Bilder (Fallback, ungenutzt) ────────────────────────────
  // Bleiben als Fallback-Bibliothek, falls kurzfristig generische
  // Stimmungsbilder gebraucht werden. Authentische Fotos oben sind
  // immer die erste Wahl — KI-Versionen werden nach und nach abgelöst.
  {
    id: "feiern-service",
    context: "Feiern — KI-Fallback (Service-Moment, ungenutzt)",
    target: "public/images/feiern-service-fine-dining-tafel.png",
    prompt:
      "Real food photography, no filters. A hand placing an elegantly plated Italian main course onto a large white round plate, at a long dark wooden restaurant table. Crystal wine glasses with white wine in the foreground. Cool to neutral ambient restaurant lighting, no orange tones. Shallow depth of field. Aspect ratio 16:9.",
  },
  {
    id: "feiern-table",
    context: "Feiern — KI-Fallback (Volle Tafel, ungenutzt)",
    target: "public/images/feiern-private-dinner-gesellschaft.png",
    prompt:
      "Real food photography, no post-processing filters. A long Italian restaurant table set for a private dinner celebration. Multiple white ceramic plates with Italian dishes, crystal wine glasses, dark wooden table, linen napkins, silverware. Guests' hands slightly visible at edges, faces out of frame. Wide shot, shallow depth of field. Aspect ratio 16:9.",
  },
  {
    id: "feiern-essen-old",
    context: "Feiern — KI-Hero alt (vor Saal-Foto-Update, ungenutzt)",
    target: "public/images/hero-feiern-essen.webp",
    note:
      "War bis Mai 2026 der aktive Hero auf /feiern. Ersetzt durch echtes Saal-Foto (hero-feiern-saal.webp). Bleibt als Fallback im Repo.",
  },

  // ── Fine Dining ──────────────────────────────────────────────────────────
  {
    id: "fine-dining-1",
    context: "Fine Dining — Amuse-bouche",
    target: "public/images/fine-dining-amuse-bouche-schieferplatte.png",
    prompt:
      "Real food photography, natural colors, no warm filter. A single small fine dining amuse-bouche on a dark slate plate — a precise bite-sized Italian appetizer with microgreens and drops of reduction sauce. Shot from directly above, extreme close-up. White marble surface. Soft diffused daylight. Aspect ratio 16:9.",
  },
  {
    id: "fine-dining-2",
    context: "Fine Dining — Pasta Tartufo",
    target: "public/images/fine-dining-pasta-tartufo-teller.png",
    prompt:
      "Real restaurant food photography. A perfect plate of fresh handmade pasta — tagliatelle with truffle shavings — on a wide white ceramic plate, shot from a 45-degree angle. Crystal water glass and bread roll visible out of focus. Dark wooden table, white linen napkin. Soft indoor ambient light. Aspect ratio 16:9.",
  },
  {
    id: "fine-dining-3",
    context: "Fine Dining — Dessert Panna Cotta",
    target: "public/images/panna-cotta-beerensosse-dessert.png",
    prompt:
      "Real food photography, no filters. A fine Italian dessert — panna cotta with berry coulis and a sprig of mint — on a white plate, shot from slightly above. Soft bokeh candlelight in the background. Neutral evening restaurant light. Aspect ratio 16:9.",
  },
  {
    id: "fine-dining-4",
    context: "Fine Dining — Tisch Overhead",
    target: "public/images/fine-dining-overhead.png",
    prompt:
      "Real food photography, natural colors, no warm filter. Overhead flat-lay of a fine Italian dining table set for two on a dark walnut surface. Carpaccio on the left, tagliatelle al ragù on the right. Olive oil dish, pepper mill, sea salt, white and red wine glasses. Soft diffused studio light. True whites. No people. Aspect ratio 16:9.",
  },

  // ── Gerichte ─────────────────────────────────────────────────────────────
  {
    id: "lasagne",
    context: "Gericht — Lasagne al Forno",
    target: "public/images/lasagne-al-forno-hausgemacht.png",
    prompt:
      "Real food photography, natural colors. A portion of classic Italian lasagne al forno on a white ceramic plate — visible layers of pasta, meat ragù and béchamel, golden-brown cheese crust on top. 45-degree angle. Soft diffused indoor light, slight steam rising. Aspect ratio 16:9.",
  },
  {
    id: "pizza-salami",
    context: "Gericht — Pizza Salami, Rucola, Parmesan",
    target: "public/images/pizza-salami-rucola-parmesan.png",
    prompt:
      "Real food photography, natural colors. A freshly baked Neapolitan-style pizza on a dark wooden board — thin crispy crust with leopard char spots, topped with spicy Italian salami, fresh rucola piled in the center, and large thin shavings of aged Parmesan. Shot from slightly above. Aspect ratio 16:9.",
  },
  {
    id: "pizza-patate",
    context: "Gericht — Pizza Patate, Prosciutto, Scamorza",
    target: "public/images/pizza-patate-prosciutto-scamorza.png",
    prompt:
      "Real food photography, natural colors. A freshly baked Neapolitan-style pizza on a dark wooden board — thin crispy crust, thinly sliced roasted rosemary potatoes, melted scamorza cheese, and slices of prosciutto cotto. Fresh rosemary sprigs on top. Shot from slightly above. Aspect ratio 16:9.",
  },
  {
    id: "tagliata",
    context: "Gericht — Tagliata di filetto «Simmentaler» alla toscana",
    target: "public/images/tagliata-rinderfilet-rucola-grana-padano.png",
    prompt:
      "Real food photography, natural colors. A classic Italian tagliata: thinly sliced medium-rare Simmentaler beef fillet on fresh rucola on a large white plate. Generous shavings of aged Grana Padano. Deep brown crust with pink interior, lava stone grill marks. 45-degree angle, shallow depth of field. Aspect ratio 16:9.",
  },

  // ── Getränke ─────────────────────────────────────────────────────────────
  {
    id: "caffe",
    context: "Getränke — Caffè (Espresso, Cappuccino, Espressino, Corretto)",
    target: "public/images/caffe-espresso-cappuccino-italianisch.png",
    prompt:
      "Real food photography, natural colors, no warm filter. A flat-lay of four Italian coffee drinks on a dark wooden café table: espresso, cappuccino with latte art, espressino, and espresso corretto with a tiny glass of grappa. Each cup on a white saucer with a spoon. Shot from directly above, soft diffused daylight. Aspect ratio 16:9.",
  },
  {
    id: "aperitivi",
    context: "Getränke — Aperitivi (Prosecco, Aperol, Campari, Kir Royal, Negroni)",
    target: "public/images/aperitivi-prosecco-aperol-campari-negroni.png",
    prompt:
      "Real food photography, natural colors. A flat-lay of classic Italian aperitivo drinks: Prosecco flute, Aperol Spritz with orange slice, deep red Campari over ice, Kir Royal, Negroni with orange peel twist. Shot from directly above or 30-degree angle. Rich accurate colors. No people, no text. Aspect ratio 16:9.",
  },
  {
    id: "digestivi",
    context: "Getränke — Digestivi (Averna, Ramazzotti, Cynar, Amaro, Sambuca, Fernet)",
    target: "public/images/drinks-digestivi.png",
    prompt:
      "Real food photography, natural colors. A close-up arrangement of classic Italian digestivi on a dark wooden bar: Averna, Ramazzotti, Cynar, Amaro del Capo, Sambuca with a coffee bean, Fernet. Shot from a low 30-degree angle with soft bar backlight through the liquid. No people, no text. Aspect ratio 16:9.",
  },
  {
    id: "analcolici",
    context: "Getränke — Analcolici (Softdrinks, San Pellegrino, Aqua Panna)",
    target: "public/images/analcolici-softdrinks-wasser-saft.png",
    prompt:
      "Real food photography, natural colors. A flat-lay of classic Italian non-alcoholic drinks on light marble: Coca-Cola with ice, Fanta, Sprite over ice, fresh orange juice, San Pellegrino sparkling water, Acqua Panna still water. Shot from directly above, soft natural daylight. No people, no text. Aspect ratio 16:9.",
  },

  // ── Desserts ─────────────────────────────────────────────────────────────
  {
    id: "dolci",
    context: "Desserts — Dolci (Panna Cotta, Tiramisù, Tartufo, Cassata, Sorbetto, Formaggio)",
    target: "public/images/dish-dolci.png",
    prompt:
      "Real food photography, natural colors. An elegant flat-lay of classic Italian desserts on a dark wooden restaurant table: panna cotta with berry coulis, tiramisù dusted with cocoa powder, dark and white tartufo, Cassata Siciliana, lemon sorbet in a lemon shell, and a small board with Italian cheeses and grapes. Each dessert on its own white plate. Soft diffused natural light. Aspect ratio 16:9.",
  },
];

const GROUPS = [
  { label: "Hero-Images", ids: ["hero-menu", "hero-empfehlungen", "hero-empfehlungen-alt", "hero-menu-classic"] },
  {
    label: "Feiern — Echte Fotos",
    ids: ["feiern-real-hero", "feiern-real-1", "feiern-real-2", "feiern-real-3", "feiern-real-4"],
  },
  {
    label: "Feiern — KI-Fallback (ungenutzt)",
    ids: ["feiern-service", "feiern-table", "feiern-essen-old"],
  },
  { label: "Fine Dining", ids: ["fine-dining-1", "fine-dining-2", "fine-dining-3", "fine-dining-4"] },
  { label: "Gerichte", ids: ["lasagne", "pizza-salami", "pizza-patate", "tagliata"] },
  { label: "Getränke", ids: ["caffe", "aperitivi", "digestivi", "analcolici"] },
  { label: "Desserts", ids: ["dolci"] },
];

export default function AssetsPage() {
  const byId = Object.fromEntries(ASSETS.map((a) => [a.id, a]));

  return (
    <main
      className="min-h-screen px-6 py-20 sm:px-12 sm:py-24"
      style={{ backgroundColor: "var(--color-blanc-bg)" }}
    >
      <div className="mx-auto max-w-4xl">
        <p
          className="mb-3 text-xs uppercase tracking-[0.2em]"
          style={{ color: "var(--color-brand-olive)" }}
        >
          Intern
        </p>
        <h1
          className="mb-3 text-4xl sm:text-5xl"
          style={{ color: "var(--color-text)" }}
        >
          Assets
        </h1>
        <p className="mb-12 text-base" style={{ color: "var(--color-text-muted)" }}>
          Alle KI-Bild-Prompts. Generiertes Bild hochladen unter{" "}
          <code
            className="rounded px-1.5 py-0.5 text-sm"
            style={{ backgroundColor: "var(--color-bg-muted)", color: "var(--color-text)" }}
          >
            public/images/
          </code>{" "}
          mit dem angegebenen Dateinamen.
          Desktop: Thumbnail anklicken → Vollbild-Vorschau.
          Mobil: Thumbnail öffnet Bild in neuem Tab.
        </p>

        {GROUPS.map((group) => (
          <section key={group.label} className="mb-16">
            {/* Large section heading */}
            <h2
              className="mb-6 border-b pb-3 text-2xl sm:text-3xl font-display"
              style={{
                color: "var(--color-text)",
                borderColor: "var(--color-border)",
              }}
            >
              {group.label}
            </h2>

            {/* 2-column grid on sm+, single column on mobile */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {group.ids.map((id) => {
                const asset = byId[id];
                if (!asset) return null;
                return (
                  <AssetCard key={id} asset={asset} exists={targetExists(asset.target)} />
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
