import type { Metadata } from "next";
import { Rajdhani, Changa_One } from "next/font/google";
import "../(my-app)/globals.css";
import { WeezeventDialogProvider } from "@/components/providers/WeezeventDialogProvider";

/**
 * Coquille minimale pour les pages destinées à être affichées en `<iframe>`
 * (aperçus de cards dans le backoffice, voir GamesListView, ActualitePreviewField).
 * Charge le même CSS et les mêmes polices que le site public, sans
 * Header/Footer/décorations : ces pages n'affichent qu'un composant isolé,
 * jamais une page complète.
 *
 * `WeezeventDialogProvider` est requis par `ActualiteCard` (bouton CTA
 * billetterie) — inoffensif pour les autres cards, qui ne l'utilisent pas.
 */

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
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
  robots: { index: false, follow: false },
};

export default function EmbedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" style={{ height: "100%", overflow: "hidden" }}>
      <body
        className={`${rajdhani.variable} ${goldman.variable} antialiased`}
        style={{
          margin: 0,
          height: "100%",
          overflow: "hidden",
          background: "var(--body-bg)",
        }}
      >
        <WeezeventDialogProvider>{children}</WeezeventDialogProvider>
      </body>
    </html>
  );
}
