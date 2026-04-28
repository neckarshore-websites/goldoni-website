import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollRestore } from "@/components/ScrollRestore";
import { StructuredData } from "@/components/StructuredData";
import { restaurantJsonLd } from "@/lib/structured-data";
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
  title: {
    default: "Ristorante Goldoni — Bella Italia in Stuttgart",
    template: "%s | Ristorante Goldoni",
  },
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
    images: [
      {
        url: "/images/hero-goldoni-velvet.webp",
        width: 1200,
        height: 630,
        alt: "Ristorante Goldoni — Schriftzug auf rotem Samt",
      },
    ],
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
    images: ["/images/hero-goldoni-velvet.webp"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning because the theme-init script mutates
    // data-theme before React hydrates; this is expected.
    <html
      lang="de"
      className={`${inter.variable} ${playfair.variable}`}
      data-theme="light"
      suppressHydrationWarning
    >
      <head>
        {/* Anti-flash: runs before first paint. Trusted static asset
            from /public — no user input, no XSS vector. */}
        <Script src="/theme-init.js" strategy="beforeInteractive" />
      </head>
      <body>
        {/* Restaurant + LocalBusiness JSON-LD — drives Google rich
            results for local search ("italienisches Restaurant
            Stuttgart"). Restaurant is a subtype of LocalBusiness, so
            one node satisfies both rich-result categories. */}
        <StructuredData data={restaurantJsonLd()} />
        <ScrollRestore />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
