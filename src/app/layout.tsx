import type { Metadata } from "next";
import localFont from "next/font/local";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

const inter = localFont({
  src: "../fonts/Inter-Variable.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
});

const playfair = localFont({
  src: "../fonts/PlayfairDisplay-Variable.woff2",
  variable: "--font-playfair",
  display: "swap",
  weight: "400 900",
});

export const metadata: Metadata = {
  title: "Ristorante Goldoni — Bella Italia in Stuttgart",
  description:
    "Italienisch verliebte Kueche im Stuttgarter Westen. Frische Zutaten, mit Liebe gemacht. Reinsburgstrasse 151 · Mi-So 18:00-23:00.",
  metadataBase: new URL("https://ristorante-goldoni.de"),
  openGraph: {
    title: "Ristorante Goldoni — Bella Italia in Stuttgart",
    description:
      "Italienisch verliebte Kueche im Stuttgarter Westen. Frische Zutaten, mit Liebe gemacht.",
    url: "https://ristorante-goldoni.de",
    siteName: "Ristorante Goldoni",
    locale: "de_DE",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  twitter: {
    card: "summary_large_image",
    title: "Ristorante Goldoni — Bella Italia in Stuttgart",
    description:
      "Italienisch verliebte Kueche im Stuttgarter Westen. Frische Zutaten, mit Liebe gemacht.",
  },
  alternates: {
    canonical: "https://ristorante-goldoni.de/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${inter.variable} ${playfair.variable}`}
      data-theme="light"
      suppressHydrationWarning
    >
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
