import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollRestore } from "@/components/ScrollRestore";
import { StructuredData } from "@/components/StructuredData";
import { restaurantJsonLd } from "@/lib/structured-data";
import "./globals.css";

// Subset Variable fonts — wght axis range narrowed to weights actually
// used in the codebase (400/500/600/700 for Inter; static 600 for Playfair).
// opsz axis on Inter pinned to default 14 (we don't use optical sizing).
// Saves ~51 KiB per pageload (109 -> 58 KiB combined). Glyph coverage
// unchanged (~230 glyphs each, full Latin + German umlauts + Italian
// accents + €). See `scripts/subset-fonts.py` for the subsetting recipe;
// re-run only when source fonts change.
const inter = localFont({
  src: "../fonts/Inter-Variable-subset.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "400 700",
});

const playfair = localFont({
  src: "../fonts/PlayfairDisplay-Subset.woff2",
  variable: "--font-playfair",
  display: "swap",
  weight: "600",
});

export const metadata: Metadata = {
  title: {
    default: "Ristorante Goldoni — Bella Italia in Stuttgart",
    template: "%s — Ristorante Goldoni",
  },
  description:
    "Italienisch verliebte Kueche im Stuttgarter Westen. Frische Zutaten, mit Liebe gemacht. Reinsburgstrasse 151 · Mi-So 18:00-23:00.",
  metadataBase: new URL("https://ristorante-goldoni.de"),
  openGraph: {
    title: "Ristorante Goldoni — Bella Italia in Stuttgart",
    description:
      "Italienisch verliebte Kueche im Stuttgarter Westen. Frische Zutaten, mit Liebe gemacht.",
    // Relative URL — Next resolves it against `metadataBase` so the
    // domain isn't duplicated in code. Per-page metadata can override
    // this with its own canonical-shaped relative URL.
    url: "/",
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
  // Google Search Console URL-prefix-property verification.
  // Renders as <meta name="google-site-verification" content="..."/> in <head>.
  // This is verification metadata only — no script, no cookie, no visitor data.
  // Once verified, the tag can stay (Google recommends keeping it for re-verification).
  verification: {
    google: "Yw31pISC-ruYUPrDLlTvM1Hqzc1Ho0QPhRhwg8juFhw",
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
