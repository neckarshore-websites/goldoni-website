import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Assets — Ristorante Goldoni (intern)",
  robots: { index: false, follow: false },
};

interface AssetEntry {
  id: string;
  context: string;
  target: string;
  filename?: string;
  prompt: string;
}

const ASSETS: AssetEntry[] = [
  // ── Hero-Images ──────────────────────────────────────────────────────────
  {
    id: "hero-menu",
    context: "Speisekarte — Hero",
    target: "public/images/hero-menu-dishes.png",
    filename: "hero-menu-dishes.png",
    prompt:
      "Real food photography, natural colors, no warm filter. Overhead flat-lay of Italian fine dining dishes on a dark wooden table: carpaccio, fresh pasta with mushrooms and parmesan, burrata with tomatoes and pesto, bread bowl, olive oil dips, red and white wine glasses, linen napkins, silver cutlery. Even soft diffused light, accurate colors. Aspect ratio 16:9.",
  },
  {
    id: "hero-empfehlungen",
    context: "Empfehlungskarte — Hero (aktiv)",
    target: "public/images/hero-empfehlungen-overhead-tafel.png",
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
    target: "public/images/hero-menu-classic.webp",
    prompt:
      "A wide-format cinematic scene of a classic Italian restaurant table setting. A worn leather-bound menu resting on a crisp white tablecloth, a single lit candle in a wine bottle, two empty wine glasses catching the warm light. Rustic wooden chairs slightly visible in the background, soft bokeh of a dimly lit dining room. Warm amber and deep espresso tones, no bright colors. The atmosphere is intimate and timeless — a traditional Italian trattoria that has been open for decades. No text visible on the menu. No people. Shot from a slight overhead angle. Style: analog film, editorial, warm and moody. Aspect ratio 16:9.",
  },

  // ── Feiern ───────────────────────────────────────────────────────────────
  {
    id: "feiern-service",
    context: "Feiern — Hero Variante 1 (Service-Moment)",
    target: "public/images/feiern-service-fine-dining-tafel.png",
    prompt:
      "Real food photography, no filters. A hand placing an elegantly plated Italian main course — white fish or meat with a dark reduction sauce and fresh microgreens — onto a large white round plate, at a long dark wooden restaurant table. Crystal wine glasses with white wine in the foreground, slightly out of focus. Bread basket, silverware and multiple place settings visible in the background. Cool to neutral ambient restaurant lighting, no orange or amber tones. Shallow depth of field, sharp on the plate. Documentary restaurant photography style, shot at table level. Aspect ratio 16:9.",
  },
  {
    id: "feiern-table",
    context: "Feiern — Hero Variante 2 (Volle Tafel)",
    target: "public/images/feiern-private-dinner-gesellschaft.png",
    prompt:
      "Real food photography, no post-processing filters. A long Italian restaurant table set for a private dinner celebration. Multiple large white ceramic plates with Italian dishes, crystal wine glasses with white and red wine, dark wooden table, linen napkins, silverware. Guests' hands and forearms slightly visible at the edges, faces out of frame. Cool natural indoor restaurant lighting, realistic colors. Shallow depth of field — centerplate sharp, background softly blurred. Wide shot showing the full table. Aspect ratio 16:9.",
  },

  // ── Fine Dining ──────────────────────────────────────────────────────────
  {
    id: "fine-dining-1",
    context: "Fine Dining — Amuse-bouche",
    target: "public/images/fine-dining-amuse-bouche-schieferplatte.png",
    prompt:
      "Real food photography, natural colors, no warm filter. A single small fine dining amuse-bouche on a dark slate plate — a precise bite-sized Italian appetizer with microgreens and drops of reduction sauce. Shot from directly above, extreme close-up. White marble surface, a silver spoon beside the plate. Soft diffused daylight from the left. Neutral to cool tones. No people, no clutter. Aspect ratio 16:9.",
  },
  {
    id: "fine-dining-2",
    context: "Fine Dining — Pasta Tartufo",
    target: "public/images/fine-dining-pasta-tartufo-teller.png",
    prompt:
      "Real restaurant food photography. A perfect plate of fresh handmade pasta — tagliatelle with truffle shavings — on a wide white ceramic plate, shot from a 45-degree angle at table height. Crystal water glass and a small bread roll visible out of focus. Dark wooden table, white linen napkin folded to the left. Soft indoor ambient light, neutral colors, no orange tones. Shallow depth of field. Aspect ratio 16:9.",
  },
  {
    id: "fine-dining-3",
    context: "Fine Dining — Dessert Panna Cotta",
    target: "public/images/panna-cotta-beerensosse-dessert.png",
    prompt:
      "Real food photography, no filters. A fine Italian dessert — panna cotta with berry coulis and a sprig of mint — on a white plate, shot from slightly above. Long dining table with soft bokeh candlelight and empty wine glasses in the background, completely out of focus. Neutral evening restaurant light, cool shadows, clean whites. Aspect ratio 16:9.",
  },
  {
    id: "fine-dining-4",
    context: "Fine Dining — Tisch Overhead",
    target: "public/images/fine-dining-overhead.webp",
    prompt:
      "Overhead flat-lay food photography. A full Italian fine dining table set for two — starter plate, pasta bowl, wine glasses with red and white wine, bread, olive oil in a small ceramic dish, linen napkins, silver cutlery — all on a dark walnut table. Even soft studio lighting, no shadows, natural accurate colors. Editorial style, no people. Aspect ratio 16:9.",
  },

  // ── Gerichte ─────────────────────────────────────────────────────────────
  {
    id: "lasagne",
    context: "Gericht — Lasagne al Forno",
    target: "public/images/lasagne-al-forno-hausgemacht.png",
    prompt:
      "Real food photography, natural colors, no warm filter. A single generous portion of classic Italian lasagne al forno, freshly cut, served on a wide white ceramic plate — visible layers of pasta, meat ragù and béchamel, golden-brown cheese crust on top. Shot from a 45-degree angle at table height. Dark wooden table, a small sprig of fresh basil beside the plate. Soft diffused indoor light, neutral tones, slight steam rising. Shallow depth of field, sharp on the lasagne. Aspect ratio 16:9.",
  },
  {
    id: "pizza-salami",
    context: "Gericht — Pizza Salami, Rucola, Parmesan",
    target: "public/images/pizza-salami-rucola-parmesan.png",
    prompt:
      "Real food photography, natural colors, no warm filter. A freshly baked Neapolitan-style pizza on a dark wooden board — thin crispy crust with leopard char spots, topped with spicy Italian salami curling at the edges, a generous handful of fresh rucola piled in the center, and large thin shavings of aged Parmesan on top. Shot from slightly above, full pizza visible. Neutral accurate colors, soft diffused light from the left. No people, no props. Aspect ratio 16:9.",
  },
  {
    id: "pizza-patate",
    context: "Gericht — Pizza Patate, Prosciutto, Scamorza",
    target: "public/images/pizza-patate-prosciutto-scamorza.png",
    prompt:
      "Real food photography, natural colors, no warm filter. A freshly baked Neapolitan-style pizza on a dark wooden board — thin crispy crust with leopard char spots, topped with thinly sliced roasted rosemary potatoes, generous pieces of melted scamorza cheese pulling slightly, and slices of Italian prosciutto cotto. Fresh rosemary sprigs scattered on top. Shot from slightly above at a gentle angle, full pizza visible. Soft diffused light from the left, neutral accurate colors, no orange tones. No people, no extra props. Aspect ratio 16:9.",
  },
  {
    id: "tagliata",
    context: "Gericht — Tagliata di filetto «Simmentaler» alla toscana",
    target: "public/images/tagliata-rinderfilet-rucola-grana-padano.png",
    prompt:
      "Real food photography, natural colors, no warm filter. A classic Italian tagliata: thinly sliced medium-rare Simmentaler beef fillet, fanned out slightly, served on a bed of fresh rucola leaves on a large white ceramic plate. Generous shavings of aged Grana Padano scattered over the meat and salad. The beef has visible lava stone grill marks and a deep brown crust with a pink interior. A small side dish — roasted potatoes or seasonal vegetables — placed neatly beside the plate. Shot from a 45-degree angle at table height. Soft diffused indoor restaurant light, neutral to slightly warm on the meat only, cool white plate. Shallow depth of field, sharp focus on the sliced beef. No people. Aspect ratio 16:9.",
  },

  // ── Getränke ─────────────────────────────────────────────────────────────
  {
    id: "caffe",
    context: "Getränke — Caffè (Espresso, Cappuccino, Espressino, Corretto)",
    target: "public/images/caffe-espresso-cappuccino-italianisch.png",
    prompt:
      "Real food photography, natural colors, no warm filter. A tasteful flat-lay arrangement of four Italian coffee drinks on a dark wooden café table: a classic espresso in a small white ceramic cup with a rich golden crema, a cappuccino with latte art in a wider white cup, an espressino with a small layer of frothed milk, and an espresso corretto with a tiny glass of grappa beside it. Each cup on a matching white saucer with a small spoon. Shot from directly above, evenly spaced, soft diffused natural daylight. Neutral accurate colors — deep brown espresso, white foam, white porcelain. No people, no text, no labels, no prices. Clean composition. Aspect ratio 16:9.",
  },
  {
    id: "aperitivi",
    context: "Getränke — Aperitivi (Prosecco, Aperol, Campari, Kir Royal, Negroni)",
    target: "public/images/aperitivi-prosecco-aperol-campari-negroni.png",
    prompt:
      "Real food photography, natural colors, no warm filter. A stylish flat-lay of classic Italian aperitivo drinks on a dark marble or wooden bar surface: a Prosecco flute with fine bubbles, an Aperol Spritz in a round wine glass with an orange slice, a deep red Campari over ice in a short glass, a Kir Royal in a champagne flute with a hint of dark berry color, and a Negroni in a lowball glass with an orange peel twist. Each glass clean and elegant, no garnish clutter. Shot from directly above or slight 30-degree angle, evenly composed. Soft diffused bar lighting, rich accurate colors — amber, deep red, pale gold, blush pink. No people, no text, no prices, no labels. Aspect ratio 16:9.",
  },
  {
    id: "digestivi",
    context: "Getränke — Digestivi (Averna, Ramazzotti, Cynar, Amaro, Sambuca, Fernet)",
    target: "public/images/drinks-digestivi.png",
    prompt:
      "Real food photography, natural colors, no warm filter. A close-up arrangement of classic Italian digestivi on a dark wooden bar surface: small short glasses (4 cl pour) of deep amber Averna, dark brown Ramazzotti, earthy green-brown Cynar, golden Amaro del Capo, crystal-clear Sambuca with a coffee bean resting on top, and a dark Fernet in a small glass. Each glass a slightly different shade — from near-black to deep amber to clear. Shot from a low 30-degree angle, glasses grouped naturally, soft warm bar backlight creating depth through the liquid colors. No people, no text, no labels, no prices. Aspect ratio 16:9.",
  },
  {
    id: "analcolici",
    context: "Getränke — Analcolici (Softdrinks, San Pellegrino, Aqua Panna)",
    target: "public/images/analcolici-softdrinks-wasser-saft.png",
    prompt:
      "Real food photography, natural colors, no warm filter. A clean flat-lay of classic Italian non-alcoholic drinks on a light marble or white stone surface: a tall glass of Coca-Cola with ice and condensation, a bright orange Fanta in a glass, a green Sprite over ice, a small glass of fresh orange juice, a bottle of San Pellegrino sparkling water with a filled glass beside it, and a bottle of Acqua Panna still water. Each drink clearly distinct by color — deep brown, bright orange, pale yellow, golden juice. Shot from directly above, evenly spaced, soft natural daylight. No people, no text, no labels, no prices. Aspect ratio 16:9.",
  },

  // ── Desserts ─────────────────────────────────────────────────────────────
  {
    id: "dolci",
    context: "Desserts — Dolci (Panna Cotta, Tiramisù, Tartufo, Cassata, Sorbetto, Formaggio)",
    target: "public/images/dish-dolci.webp",
    prompt:
      "Real food photography, natural colors, no warm filter. An elegant flat-lay of classic Italian desserts on a dark wooden restaurant table: a smooth panna cotta with a drizzle of berry coulis, a generous portion of tiramisù dusted with cocoa powder in a small dish, a dark chocolate tartufo and a white tartufo side by side, a slice of Cassata Siciliana with visible candied fruit, a whole lemon filled with lemon sorbet, and a small wooden board with a selection of Italian cheeses and a few grapes. Each dessert on its own white plate or small dish, evenly spaced. Shot from a slight overhead angle, soft diffused natural light, neutral accurate colors. No people, no text, no prices. Aspect ratio 16:9.",
  },
];

const GROUPS = [
  { label: "Hero-Images", ids: ["hero-menu", "hero-empfehlungen", "hero-empfehlungen-alt", "hero-menu-classic"] },
  { label: "Feiern", ids: ["feiern-service", "feiern-table"] },
  { label: "Fine Dining", ids: ["fine-dining-1", "fine-dining-2", "fine-dining-3", "fine-dining-4"] },
  { label: "Gerichte", ids: ["lasagne", "pizza-salami", "pizza-patate", "tagliata"] },
  { label: "Getränke", ids: ["caffe", "aperitivi", "digestivi", "analcolici"] },
  { label: "Desserts", ids: ["dolci"] },
];

export default function AssetsPage() {
  const byId = Object.fromEntries(ASSETS.map((a) => [a.id, a]));

  return (
    <main className="px-6 py-20 sm:px-12 sm:py-24">
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
        <p
          className="mb-12 text-base"
          style={{ color: "var(--color-text-muted)" }}
        >
          Alle KI-Bild-Prompts. Generiertes Bild hochladen unter{" "}
          <code
            className="rounded px-1.5 py-0.5 text-sm"
            style={{
              backgroundColor: "var(--color-bg-muted)",
              color: "var(--color-text)",
            }}
          >
            public/images/
          </code>{" "}
          mit dem angegebenen Dateinamen.
        </p>

        {GROUPS.map((group) => (
          <section key={group.label} className="mb-14">
            <h2
              className="mb-6 border-b pb-2 text-xs font-medium uppercase tracking-[0.2em]"
              style={{
                color: "var(--color-brand-olive)",
                borderColor: "var(--color-border)",
              }}
            >
              {group.label}
            </h2>
            <div className="flex flex-col gap-6">
              {group.ids.map((id) => {
                const asset = byId[id];
                if (!asset) return null;
                return (
                  <div
                    key={id}
                    className="rounded-lg border p-5"
                    style={{
                      borderColor: "var(--color-border)",
                      backgroundColor: "var(--color-bg-muted)",
                    }}
                  >
                    <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                      <p
                        className="font-medium"
                        style={{ color: "var(--color-text)" }}
                      >
                        {asset.context}
                      </p>
                      <code
                        className="rounded px-1.5 py-0.5 text-xs"
                        style={{
                          backgroundColor: "var(--color-bg)",
                          color: "var(--color-text-muted)",
                          border: "1px solid var(--color-border-strong)",
                        }}
                      >
                        {asset.target}
                      </code>
                    </div>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {asset.prompt}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
