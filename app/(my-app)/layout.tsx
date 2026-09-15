import type { Metadata } from "next";
import { draftMode } from "next/headers";
import {
  Rajdhani,
  Montserrat,
  Changa_One,
} from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingDecorations from "@/components/ui/FloatingDecorations";
import { WeezeventDialogProvider } from "@/components/providers/WeezeventDialogProvider";
import { AudiencePickerProvider } from "@/components/providers/AudiencePickerProvider";

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const goldman = Changa_One({
  variable: "--font-goldman",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://holidaygeekcup.fr"),
  title: "HGC - Esports & Gaming",
  description: "Professional esports and gaming platform",
  icons: {
    icon: "/assets/logos/logo-hgc.svg",
    shortcut: "/assets/logos/logo-hgc.svg",
    apple: "/assets/logos/logo-hgc.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isEnabled: isPreview } = await draftMode();

  return (
    <html lang="fr">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body
        className={`${rajdhani.variable} ${montserrat.variable} ${goldman.variable} antialiased`}
      >
        {isPreview && (
          <div className="fixed top-0 inset-x-0 z-[9999] flex items-center justify-center gap-3 bg-amber-500 py-2 text-sm font-semibold text-gray-950">
            Mode aperçu — contenu non publié compris.
            {/* <Link> préchargerait cette route au survol, désactivant le
                mode aperçu avant même le clic : un <a> classique est voulu. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/api/preview/disable" className="underline">
              Quitter l’aperçu
            </a>
          </div>
        )}
        <WeezeventDialogProvider>
          <AudiencePickerProvider>
            <div className="page-wrapper relative">
              <FloatingDecorations />
              <Header />
              <main className="relative z-10 bg-gray-950">{children}</main>
              <Footer />
            </div>
          </AudiencePickerProvider>
        </WeezeventDialogProvider>
      </body>
    </html>
  );
}
