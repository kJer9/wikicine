import type { Metadata } from "next";
import { Bebas_Neue, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const display = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: {
    default: "WikiCiné — L'encyclopédie du cinéma",
    template: "%s · WikiCiné",
  },
  description:
    "Découvrez des films, réalisateurs, acteurs, mouvements cinématographiques et analyses de cinéma sur WikiCiné.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark">
      <body className={`${display.variable} ${body.variable} ${mono.variable}`}>
        <Navbar />
        <div className="sprocket-divider" />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
