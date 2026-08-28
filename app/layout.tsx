import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { WhatsAppFAB } from "@/components/layout/WhatsAppFAB";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { QuoteProvider } from "@/lib/quote/QuoteContext";
import { site } from "@/lib/site";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono-jb",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Laboratorio y Suministros`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    "suministros de laboratorio",
    "reactivos",
    "insumos laboratorio clínico",
    "cristalería",
    "bioseguridad",
    "equipos de laboratorio",
    "Aalere's",
  ],
  openGraph: {
    type: "website",
    locale: "es_VE",
    siteName: site.name,
    title: `${site.name} — Laboratorio y Suministros`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Laboratorio y Suministros`,
    description: site.description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <QuoteProvider>
          <CustomCursor />
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <WhatsAppFAB />
        </QuoteProvider>
      </body>
    </html>
  );
}
