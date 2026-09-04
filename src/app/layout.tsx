import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Noto_Sans_JP, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { absoluteUrl, getLocaleAlternates, getSiteOrigin } from "@/lib/seo";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  weight: ["400", "500", "600", "700"],
  display: "swap",
  fallback: ["Arial", "sans-serif"],
  preload: false,
});

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  weight: ["400", "500", "600", "700"],
  display: "swap",
  fallback: ["Arial", "sans-serif"],
  preload: false,
});

export async function generateMetadata(): Promise<Metadata> {
  const origin = await getSiteOrigin();
  const canonical = absoluteUrl(origin, '/');
  const image = absoluteUrl(origin, '/opengraph-image.svg');
  return {
    title: "PolySyntax - Multilingual Frontend Reading",
    description: "One frontend idea, three languages.",
    alternates: { canonical, languages: await getLocaleAlternates(origin, '/') },
    openGraph: {
      title: "PolySyntax - Multilingual Frontend Reading",
      description: "One frontend idea, three languages.",
      url: canonical,
      siteName: 'PolySyntax',
      images: [{ url: image, width: 1200, height: 630, alt: 'PolySyntax' }],
    },
    twitter: {
      card: 'summary',
      title: "PolySyntax - Multilingual Frontend Reading",
      description: "One frontend idea, three languages.",
      images: [image],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} ${notoSansKR.variable} ${notoSansJP.variable}`}>
      <body className="bg-background font-sans text-foreground">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
