import type { Metadata } from "next";
import { PrototypeMenu } from "../_handy/PrototypeMenu";

export const metadata: Metadata = {
  title: "Desktop-Prototyp C (intern)",
  description:
    "Interner Prototyp: schwebender Bestellknopf statt Streifen am Desktop — nicht Teil der oeffentlichen Website.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PrototypeMenu variant="c" />;
}
