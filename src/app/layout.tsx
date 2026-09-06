import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Noto_Sans_JP, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getLocalizedPageMetadata, getSiteOrigin } from "@/lib/seo";
import { DOCUMENT_LOCALE_HEADER, isLocale } from "@/lib/localeRoutes";
import { headers } from "next/headers";

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
  return getLocalizedPageMetadata(
    "PolySyntax - Multilingual Frontend Reading",
    "One frontend idea, three languages.",
    'en',
    '/',
    await getSiteOrigin(),
  );
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = (await headers()).get(DOCUMENT_LOCALE_HEADER);
  const documentLocale = locale && isLocale(locale) ? locale : 'en';

  return (
    <html lang={documentLocale} className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} ${notoSansKR.variable} ${notoSansJP.variable}`}>
      <body className="bg-background font-sans text-foreground">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
