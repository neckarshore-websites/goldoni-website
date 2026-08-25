import type { CSSProperties, ReactNode } from "react";

/**
 * Druck-Motive als HTML statt als PDF-Export.
 *
 * WARUM SO: bis 2026-08-25 entstand jedes Motiv als HTML-Vorlage, wurde zu
 * PDF gerendert, daraus ein JPG geschnitten und das JPG auf die Seite gelegt.
 * Drei Schritte zwischen Quelle und Anzeige, jeder mit eigener Gelegenheit zu
 * veralten. Betreiber-Entscheidung: der Umweg entfaellt. Was auf der Seite
 * steht, IST das Motiv. Druckdaten werden weiterhin erzeugt — als Ausgabe,
 * nicht als Zwischenschritt.
 *
 * MASSSYSTEM: jedes Motiv setzt `--mm` als echten Millimeter seines
 * DATENFORMATS (container-type: inline-size, --mm = 100/breite cqw). Jede
 * Groesse unten ist damit als Millimeter lesbar und skaliert mit der
 * Anzeigebreite, ohne dass sich Verhaeltnisse verschieben. Wer hier eine
 * Zahl aendert, aendert Millimeter auf Papier.
 */

const C = {
  espresso: "#1A1612",
  mozzarella: "#FAFAFA",
  parmigiano: "#FEF1A5",
  olive: "#746B03",
  tan: "#C9BD8A",
} as const;

const SERIF = "var(--font-playfair), Georgia, serif";

function Sheet({
  wmm,
  hmm,
  background,
  children,
}: {
  wmm: number;
  hmm: number;
  background: string;
  children: ReactNode;
}) {
  const style: CSSProperties = {
    position: "relative",
    width: "100%",
    aspectRatio: `${wmm} / ${hmm}`,
    containerType: "inline-size",
    ["--mm" as string]: `${(100 / wmm).toFixed(5)}cqw`,
    background,
    overflow: "hidden",
  };
  return <div style={style}>{children}</div>;
}

/**
 * Derselbe QR-Code wie auf allen anderen Drucksachen — erzeugt aus
 * STOREFRONT_PARTNER.url und beim Erzeugen wieder eingelesen. Liegt als SVG
 * unter public, damit die Seite ihn nicht dupliziert.
 */
function Qr({ sizeMm, padMm }: { sizeMm: number; padMm: number }) {
  return (
    <div
      style={{
        width: `calc(${sizeMm} * var(--mm))`,
        padding: `calc(${padMm} * var(--mm))`,
        background: "#fff",
        borderRadius: "calc(.6 * var(--mm))",
        flexShrink: 0,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- SVG ohne feste
          Pixelmasse; next/image brauchte width/height und wuerde es rastern. */}
      <img
        src="/assets/print/qr-storefront.svg"
        alt=""
        style={{ display: "block", width: "100%", height: "auto" }}
      />
    </div>
  );
}

/* ── Briefumschlag DIN lang quer, Datenformat 230 × 120 mm ───────────── */

export function BriefumschlagArtwork() {
  return (
    <Sheet wmm={230} hmm={120} background={C.olive}>
      <div style={{ position: "absolute", inset: "calc(13 * var(--mm))" }}>
        <div style={{ position: "absolute", left: 0, top: 0 }}>
          <p
            style={{
              margin: 0,
              fontWeight: 600,
              fontSize: "calc(2.6 * var(--mm))",
              letterSpacing: ".3em",
              textTransform: "uppercase",
              color: C.parmigiano,
            }}
          >
            Ristorante
          </p>
          <p
            style={{
              margin: 0,
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: "calc(11 * var(--mm))",
              lineHeight: 1,
              color: C.mozzarella,
            }}
          >
            Goldoni
          </p>
          <hr
            style={{
              height: "calc(.25 * var(--mm))",
              border: 0,
              width: "calc(30 * var(--mm))",
              margin: "calc(3 * var(--mm)) 0 calc(2.5 * var(--mm))",
              background: C.parmigiano,
              opacity: 0.6,
            }}
          />
          <p
            style={{
              margin: 0,
              fontSize: "calc(3 * var(--mm))",
              lineHeight: 1.45,
              color: C.mozzarella,
            }}
          >
            +49 (711) 659 98 89 · ristorante-goldoni.de
          </p>
        </div>

        {/* Absenderzeile ueber dem Fenster — bei Fensterumschlaegen die
            postalisch vorgesehene Stelle. */}
        <p
          style={{
            position: "absolute",
            left: "calc(12 * var(--mm))",
            bottom: "calc(57 * var(--mm))",
            margin: 0,
            fontSize: "calc(2.5 * var(--mm))",
            color: C.parmigiano,
          }}
        >
          Ristorante Goldoni · Reinsburgstraße 151 · 70197 Stuttgart
        </p>

        {/* Fenster 90 × 45 mm und Briefmarkenfeld: beide bleiben UNBEDRUCKT.
            Hier gestrichelt dargestellt, damit sichtbar ist, warum die
            Gestaltung dort aufhoert. In den Druckdaten steht dort nichts. */}
        <Zone
          label="Fenster"
          style={{
            left: "calc(12 * var(--mm))",
            bottom: "calc(7 * var(--mm))",
            width: "calc(90 * var(--mm))",
            height: "calc(45 * var(--mm))",
            borderStyle: "dashed",
          }}
        />
        <Zone
          label="Marke"
          style={{
            right: 0,
            top: 0,
            width: "calc(45 * var(--mm))",
            height: "calc(28 * var(--mm))",
            borderStyle: "dotted",
          }}
        />
      </div>
    </Sheet>
  );
}

function Zone({ label, style }: { label: string; style: CSSProperties }) {
  return (
    <div
      style={{
        position: "absolute",
        border: "calc(.3 * var(--mm)) solid rgba(250,250,250,.5)",
        borderRadius: "calc(1 * var(--mm))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      <span
        style={{
          fontSize: "calc(3 * var(--mm))",
          letterSpacing: ".12em",
          textTransform: "uppercase",
          color: "rgba(250,250,250,.6)",
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ── Pizzakarton, Deckelfläche 262 × 260 mm ──────────────────────────── */

export function PizzakartonArtwork() {
  return (
    <Sheet wmm={262} hmm={260} background={C.espresso}>
      <div
        style={{
          position: "absolute",
          inset: "calc(22 * var(--mm))",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              margin: 0,
              fontWeight: 600,
              fontSize: "calc(5 * var(--mm))",
              letterSpacing: ".34em",
              textTransform: "uppercase",
              color: C.parmigiano,
            }}
          >
            Ristorante
          </p>
          <p
            style={{
              margin: "calc(4 * var(--mm)) 0 0",
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: "calc(46 * var(--mm))",
              lineHeight: 0.95,
              letterSpacing: "-.015em",
              color: C.mozzarella,
            }}
          >
            Goldoni
          </p>
          <p
            style={{
              margin: "calc(8 * var(--mm)) 0 0",
              fontSize: "calc(7.6 * var(--mm))",
              lineHeight: 1.35,
              color: C.tan,
            }}
          >
            Italienisch verliebte Küche im Stuttgarter Westen.
          </p>
        </div>

        {/* Der einzige Block, der etwas verlangt — und er verlangt es in dem
            Moment, in dem der Gast die Schachtel oeffnet. */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "calc(14 * var(--mm))",
            background: C.olive,
            padding: "calc(12 * var(--mm))",
            borderRadius: "calc(2 * var(--mm))",
          }}
        >
          <div style={{ flex: "1 1 auto" }}>
            <p
              style={{
                margin: 0,
                fontFamily: SERIF,
                fontWeight: 600,
                fontSize: "calc(15 * var(--mm))",
                lineHeight: 1.05,
                color: C.mozzarella,
              }}
            >
              Nächstes Mal
              <br />
              direkt bei uns.
            </p>
            <p
              style={{
                margin: "calc(5 * var(--mm)) 0 0",
                fontSize: "calc(7 * var(--mm))",
                color: C.mozzarella,
              }}
            >
              Abholen oder liefern lassen.
            </p>
          </div>
          <Qr sizeMm={66} padMm={4} />
        </div>
      </div>
    </Sheet>
  );
}
