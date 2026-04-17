# Ristorante Goldoni — Website Redesign Briefing

Snapshot taken 2026-04-17 as groundwork for a dedicated Goldoni session. No build decisions made yet — all scope-questions below need clarification before any code is written.

---

## 1. Kontext

- **Verhältnis:** Barter-Deal zwischen User (German Rauhut) und einem Freund, der Mit-Eigentümer des Restaurants ist.
- **Vergütung:** Keine Bezahlung. Der User bekommt seit 1+ Jahr Pizza / Essen im Restaurant ohne zu bezahlen — im Gegenzug pflegt er die Webseite.
- **Implikation:** Kein Deadline-Druck, aber auch kein Budget für Bezahl-Tools (Sanity Pro, Mailchimp, etc.). Ziel: nachhaltig, low-maintenance, selbst-pflegbar.
- **Langfristiger Owner:** Linus baut und pflegt die Site. Der Freund ist Content-Lieferant, aber kein Admin.

---

## 2. Aktuelle Site

- **URL:** [ristorante-goldoni.de](https://ristorante-goldoni.de)
- **Tech:** WordPress auf PHP 8.2 (via `x-powered-by`-Header identifiziert)
- **Pages (aktuell):**
  - Start (Home)
  - Menü
  - Kontakt
  - Feiern & Events (Private Veranstaltungen)
  - Impressum
  - Datenschutzerklärung
- **Languages:** Deutsch primär; Englisch nur über Wolt-Integration

---

## 3. Restaurant-Fakten

| Feld | Wert |
|---|---|
| Name | Ristorante Goldoni |
| Tagline | "Bella Italia" / "Italienisch verliebte Küche" |
| Adresse | Reinsburgstrasse 151, 70197 Stuttgart |
| Telefon | +49 (711) 659 98 89 |
| Email | info@goldoni-online.de |
| Öffnungszeiten | Mi-So 18:00 - 23:00 · Mo + Di geschlossen |
| Facebook | [Ristorante-Goldoni-152510754787757](https://www.facebook.com/Ristorante-Goldoni-152510754787757/) |
| Delivery | Wolt |

---

## 4. Content-Snapshot (aktuell)

### Navigation

`Start | Menü | Kontakt | Feiern & Events | Impressum | Datenschutz`

### Hero

Image carousel, "Willkommen" messaging, Innenraum-Fotos.

### Philosophie-Sektion

Zitiert Plutarchs "Tischgespräche": Der Mensch teilt nicht nur Leben und Heim, sondern auch Brot und Speisen — Fokus auf Gemeinschaft beim Essen. Klassischer Trattoria-Tonfall.

### Menü-Kategorien

Keine konkreten Gerichte / Preise auf der aktuellen Site — nur vier Kategorien als Marketing-Text:

- Frische Zutaten
- Mit Liebe gemacht
- Echt Italienisch
- Genuss für alle Sinne

**→ Für den Relaunch brauchen wir echte Menü-Daten vom Freund.**

### Special Features (aktuell)

- Private Event-Hosting (Taufen, Kommunionen, Hochzeiten, Geburtstage)
- Sonntag vormittags verfügbar für Sonderveranstaltungen
- Valentinstag-Sondermenüs (2026)
- Weinkeller-Empfehlungen
- Wolt-Integration für Delivery

---

## 5. Scope-Fragen (offen, zu klären in dedizierter Session)

| # | Frage | Optionen |
|---|-------|----------|
| 5a | Komplett-Relaunch vs. Landing-only | Alle 6 Pages neu vs. nur Landing bauen, Rest lassen bis später |
| 5b | Menü-Handling | Strukturierte Seite mit Kategorien/Items/Preisen (pflegeintensiv) vs. PDF-Download (einfach, aber nicht SEO-tauglich) |
| 5c | CMS für Owner | Decap CMS (kostenlos, git-basiert, einfach) vs. Sanity Free Tier vs. "Linus pflegt, Freund mailt Updates" |
| 5d | Reservierung | Formular auf der Site vs. externes Tool (OpenTable/Resmio/Quandoo) vs. nur Telefon + Mail |
| 5e | Events-Seite | Eigene Page mit Event-Kalender vs. als Abschnitt in Landing integriert vs. nur Telefon-Hinweis |
| 5f | Domain/DNS-Hoheit | Wer kontrolliert Domain + DNS? Hosting-Kündigung WordPress wann? Email bleibt bei aktuellem Provider? |

---

## 6. Tech-Vorschlag (zu bestätigen)

**Stack (default):**

| Layer | Wahl | Begründung |
|---|---|---|
| Framework | Next.js 16 | Matched an rauhut.com und neckarshore.ai — Linus kennt's |
| CSS | Tailwind CSS | Matched |
| Hosting | Vercel | Matched — Git-Push deployt automatisch |
| Fonts | Self-hosted via `next/font/google` | DSGVO-konform, kein Google-CDN-Fetch |
| CMS v1 | Keines (Markdown-Files im Repo) oder Decap | Decap erst wenn Freund selbst pflegen will |
| Analytics | Keines v1 | Cookie-Banner-Pflicht vermeiden |
| Lighthouse-Target | 95+ desktop + mobile | Nicht-verhandelbar |

---

## 7. Design-Richtung (zu validieren)

**Vorschlag (Linus):** Gastro-Modern, warm, "Bella Italia ohne Kitsch".

**Gegenprüfung zu anderen aktuellen Projekten:**

| Projekt | Ästhetik | Palette |
|---|---|---|
| rauhut.com | Minimal Material, sachlich | Schwarz/Weiß + Pastell `#8DA5C4` |
| neckarshore.ai | Premium, warm | Bordeaux-Ton |
| **goldoni (Vorschlag)** | **Warm, einladend, hand-gemacht** | **Warme Erdtöne: Terrakotta, Creme, tiefes Olivgrün** |

**Typo-Kandidaten (noch offen):**

- Headline: Playfair Display, DM Serif, Cormorant — serif mit italienischem Flair
- Body: Source Serif / Lora (serif) oder Inter (sans) — warm vs. neutral

**No-Gos:**

- Stockfoto-Pizza auf schwarzem Hintergrund (Dutzende Pizzerien machen genau das)
- Rot-Grün-Weiße-Flagge als Design-Element (klischee)
- Carousel-Slider auf Landing (Performance + Usability)
- Parallax oder Jank-Animationen
