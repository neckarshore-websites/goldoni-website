import type { Metadata } from "next";
import { PrototypeMenu } from "../_handy/PrototypeMenu";

export const metadata: Metadata = {
  title: "Handy-Prototyp A (intern)",
  description:
    "Interner Prototyp der Bestell-CTAs auf dem Handy — nicht Teil der oeffentlichen Website.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <PrototypeMenu variant="a" />;
}
