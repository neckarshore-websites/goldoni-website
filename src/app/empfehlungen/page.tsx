import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Empfehlungen — Ristorante Goldoni",
  description:
    "Aktuelle Empfehlungskarte: saisonale Gerichte, Wochenangebote und Wein-Tipps aus der Kueche.",
};

export default function EmpfehlungenPage() {
  return (
    <main className="px-6 py-20 sm:px-12 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <p
          className="mb-3 text-xs uppercase tracking-[0.2em]"
          style={{ color: "var(--color-brand-olive)" }}
        >
          Diese Woche
        </p>
        <h1
          className="mb-6 text-4xl sm:text-5xl"
          style={{ color: "var(--color-text)" }}
        >
          Aktuelle Empfehlungen
        </h1>
        <p
          className="mb-8 text-lg"
          style={{ color: "var(--color-text-muted)" }}
        >
          Was die Kueche diese Woche besonders empfiehlt &mdash; saisonal,
          frisch, und nicht jede Woche das Gleiche.
        </p>

        <div
          className="rounded-lg border p-8 sm:p-10"
          style={{
            borderColor: "var(--color-border)",
            backgroundColor: "var(--color-bg-muted)",
          }}
        >
          <p
            className="text-base"
            style={{ color: "var(--color-text-muted)" }}
          >
            Die aktuelle Empfehlungskarte folgt in Kuerze. Bis dahin: rufen
            Sie uns an &mdash; wir erzaehlen gerne, was heute auf den Tisch
            kommt.
          </p>
        </div>
      </div>
    </main>
  );
}
