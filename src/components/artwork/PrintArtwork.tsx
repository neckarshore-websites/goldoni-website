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

/**
 * Vorderseite: waagerecht geteilt. Oben Espresso mit der Wortmarke, unten
 * Olive mit dem Fenster.
 *
 * WARUM DIE TEILUNG GENAU DORT LIEGT: die Kante sitzt knapp ueber dem
 * Fenster. Damit steht die Anschrift des Empfaengers — die im Fenster
 * erscheint — vollstaendig im olivgruenen Feld und wird nicht von einer
 * Farbkante durchschnitten. Eine Teilung in der geometrischen Mitte saehe
 * ausgewogener aus und liefe genau durch das Fenster.
 *
 * DIE ABSENDERADRESSE STEHT NICHT MEHR HIER, sondern auf der Rueckseite
 * (Betreiber-Entscheidung 2026-08-25). Das macht die Vorderseite ruhig und
 * verlangt im Gegenzug ein beidseitig bedrucktes Produkt.
 */
export function BriefumschlagArtwork() {
  return (
    <Sheet wmm={230} hmm={120} background={C.espresso}>
      {/* Unteres Feld. 62 mm hoch: Fenster (45 mm) plus Abstand darueber
          und darunter, gemessen im Datenformat. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "calc(62 * var(--mm))",
          background: C.olive,
        }}
      />
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
              fontSize: "calc(13 * var(--mm))",
              lineHeight: 1,
              color: C.mozzarella,
            }}
          >
            Goldoni
          </p>
          <p
            style={{
              margin: "calc(3 * var(--mm)) 0 0",
              fontSize: "calc(3 * var(--mm))",
              lineHeight: 1.45,
              color: C.tan,
            }}
          >
            Italienisch verliebte Küche im Stuttgarter Westen.
          </p>
        </div>

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

/**
 * Rueckseite: der persoenliche Teil.
 *
 * BETREIBER-ENTSCHEIDUNG 2026-08-27, nach fuenf massgetreu gezeichneten
 * Vorschlaegen: gewaehlt wurde "Die Handschrift". Gedruckt wird ein Gruss und
 * eine Linie; der Rest der Flaeche bleibt frei, damit von Hand hineingeschrieben
 * werden kann. Der Ruecken wird in dem Moment gesehen, in dem jemand den Brief
 * aufreisst und ihn in der Hand haelt — dieselbe Logik wie beim Pizzakartondeckel.
 *
 * ZWEI ABWEICHUNGEN VOM ENTWURF, BEIDE ABSICHT:
 *
 * 1. "Platz fuer zwei Zeilen von Hand" wird NICHT gedruckt. Im Entwurf stand die
 *    Zeile als blasse Beschriftung in der Flaeche — das war eine Anmerkung fuer
 *    uns, keine Gestaltung. Gedruckt waere sie eine Anweisung an den Empfaenger
 *    und damit das Gegenteil von persoenlich.
 *
 * 2. Der Inhalt sitzt in der SENKRECHTEN MITTE, nicht unter einer Klappe.
 *    Grund: wo die Klappe dieses Umschlags genau liegt, ist NICHT GEMESSEN — die
 *    Vorlage der Druckerei zeigt nur die Vorderseite. Statt eine unbekannte Lage
 *    zu raten, ist die Gestaltung so gesetzt, dass sie stimmt, egal ob die Klappe
 *    oben oder unten verklebt: ein Band von 38 mm bleibt an BEIDEN Kanten frei
 *    (Inhalt von 38 bis 72 mm auf 110 mm Hoehe). Eine ungemessene Groesse
 *    entscheidet damit nichts mehr.
 *
 * Farben gemessen, nicht geschaetzt — Kontrast gegen #FAFAFA:
 *   Gruss + Linie  Olive    #746B03   5,2
 *   Absenderzeile  Espresso #1A1612  17,2
 */
export function BriefumschlagBackArtwork() {
  return (
    <Sheet wmm={230} hmm={120} background={C.mozzarella}>
      {/* Inhaltsband: 38 bis 72 mm der 110 mm Endformat-Hoehe, plus 5 mm
          Beschnitt oben — bleibt an beiden Kanten 38 mm frei. */}
      <div
        style={{
          position: "absolute",
          left: "calc(28 * var(--mm))",
          right: "calc(28 * var(--mm))",
          top: "calc(43 * var(--mm))",
          height: "calc(34 * var(--mm))",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: SERIF,
            fontWeight: 600,
            fontSize: "calc(9 * var(--mm))",
            lineHeight: 1,
            color: C.olive,
          }}
        >
          Grazie.
        </p>

        {/* Die Linie ist eine Einladung, kein Formularfeld — deshalb eine
            durchgezogene Haarlinie und keine gestrichelte Schreibzeile. */}
        <div
          style={{
            marginTop: "calc(5 * var(--mm))",
            width: "calc(46 * var(--mm))",
            height: "calc(.35 * var(--mm))",
            background: C.olive,
          }}
        />

        <p
          style={{
            margin: "calc(11 * var(--mm)) 0 0",
            fontSize: "calc(3.1 * var(--mm))",
            lineHeight: 1.5,
            color: C.espresso,
          }}
        >
          <strong style={{ fontWeight: 600, color: C.olive }}>
            Ristorante Goldoni
          </strong>
          {" · "}Reinsburgstraße 151 · 70197 Stuttgart
          {" · "}+49 (711) 659 98 89
        </p>
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

/* ── Pizzakarton, Deckelfläche 322 × 327 mm ──────────────────────────── */

/**
 * Der Deckel, waagerecht in zwei Felder geteilt (Betreiber-Entscheidung
 * 2026-08-25). Zwei Aufteilungen stehen zur Wahl:
 *
 *   "espresso-oben" — Wortmarke auf Espresso, Bestellweg auf Olive.
 *   "olive-oben"    — umgekehrt.
 *
 * BEIDE SIND GEBAUT, WEIL DAS AM BILDSCHIRM ZU ENTSCHEIDEN IST UND NICHT
 * IM KOPF. Was fuer "espresso-oben" spricht: die Wortmarke steht dann auf
 * demselben Grund wie auf Postkarte und Bierdeckel, und der Karton wird
 * meist von oben und leicht schraeg gesehen — das dunkle Feld ist dort, wo
 * der Blick zuerst hinfaellt. Was dagegen spricht: der Bestellweg, also der
 * einzige Teil mit einer Aufgabe, sitzt dann unten.
 *
 * Die Teilung liegt bei 52 Prozent, nicht bei 50: das obere Feld traegt
 * mehr Inhalt und wirkt sonst gedrueckt. Eine exakte Haelfte sieht auf
 * Papier kleiner aus als sie ist.
 */
/*
 * GROESSENWECHSEL 26 -> 32 cm, Betreiber-Entscheidung 2026-08-26.
 *
 * Der Deckel ist von 262 x 260 mm auf 322 x 327 mm gewachsen. Alle
 * mm-Angaben in diesem Motiv sind mit dem Faktor 322/262 = 1,229
 * mitgewachsen, damit die am 25.08. abgenommene Komposition erhalten
 * bleibt: --mm ist echte Millimeter der Bogenbreite, also haette ein
 * blosses Aendern von wmm den Satz auf einer 23 Prozent groesseren
 * Flaeche stehen lassen — optisch eine ANDERE Gestaltung als die
 * abgenommene, mit mehr Rand. Die Teilung 52/48 ist prozentual und
 * traegt sich selbst.
 *
 * DIE DECKELHOEHE 327 IST ABGELEITET, NICHT GEMESSEN: das Datenblatt
 * nennt die sechs waagerechten Baender 38,5 | 327 | 38 | 44,5 | 323 | 37
 * (Summe 808 = Endformat), und DECKEL liegt in der Zeichnung ueber
 * RUECKSEITE, also im ersten grossen Band. Dass der Deckel (327) etwas
 * groesser ist als der Boden (323), passt zur Bauart — der Deckel
 * schliesst ueber den Boden. Fuer die Vorschau ist der Unterschied 1,2
 * Prozent. FUER DIE DRUCKDATEN NICHT AUS DIESER ZAHL ARBEITEN, sondern
 * das Motiv auf der Stanzvorlage ueberlagern; das ist ohnehin ein
 * offener Punkt der Seite.
 */
export function PizzakartonArtwork({
  variant = "espresso-oben",
}: {
  variant?: "espresso-oben" | "olive-oben";
} = {}) {
  const oben = variant === "espresso-oben" ? C.espresso : C.olive;
  const unten = variant === "espresso-oben" ? C.olive : C.espresso;

  return (
    <Sheet wmm={322} hmm={327} background={oben}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "48%",
          background: unten,
        }}
      />

      {/* Oberes Feld — die Marke. */}
      <div
        style={{
          position: "absolute",
          left: "calc(27 * var(--mm))",
          right: "calc(27 * var(--mm))",
          top: 0,
          height: "52%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <p
          style={{
            margin: 0,
            fontWeight: 600,
            fontSize: "calc(6.1 * var(--mm))",
            letterSpacing: ".34em",
            textTransform: "uppercase",
            color: C.parmigiano,
          }}
        >
          Ristorante
        </p>
        <p
          style={{
            margin: "calc(4.9 * var(--mm)) 0 0",
            fontFamily: SERIF,
            fontWeight: 600,
            fontSize: "calc(61.5 * var(--mm))",
            lineHeight: 0.95,
            letterSpacing: "-.015em",
            color: C.mozzarella,
          }}
        >
          Goldoni
        </p>
        <p
          style={{
            margin: "calc(8.6 * var(--mm)) 0 0",
            fontSize: "calc(9.1 * var(--mm))",
            lineHeight: 1.35,
            color: variant === "espresso-oben" ? C.tan : C.parmigiano,
          }}
        >
          Italienisch verliebte Küche im Stuttgarter Westen.
        </p>
      </div>

      {/* Unteres Feld — der Bestellweg. Er arbeitet in dem Moment, in dem
          der Gast die Schachtel oeffnet und die Haende am Karton hat. */}
      <div
        style={{
          position: "absolute",
          left: "calc(27 * var(--mm))",
          right: "calc(27 * var(--mm))",
          bottom: 0,
          height: "48%",
          display: "flex",
          alignItems: "center",
          gap: "calc(19.7 * var(--mm))",
        }}
      >
        <div style={{ flex: "1 1 auto" }}>
          <p
            style={{
              margin: 0,
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: "calc(20.9 * var(--mm))",
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
              margin: "calc(6.1 * var(--mm)) 0 0",
              fontSize: "calc(9.1 * var(--mm))",
              color: variant === "espresso-oben" ? C.mozzarella : C.tan,
            }}
          >
            Abholen oder liefern lassen.
          </p>
        </div>
        <Qr sizeMm={86} padMm={4.9} />
      </div>
    </Sheet>
  );
}
