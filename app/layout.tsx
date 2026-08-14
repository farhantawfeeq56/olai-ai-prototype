import type { Metadata } from "next";
import {
  Fraunces,
  IBM_Plex_Mono,
  Inter,
  Noto_Serif_Tamil,
} from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const notoSerifTamil = Noto_Serif_Tamil({
  variable: "--font-noto-serif-tamil",
  subsets: ["tamil"],
  weight: ["400", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "ஓலை·AI — Olai Restore",
  description:
    "A restoration workbench for Tamil palm-leaf manuscripts — preprocessing, damage diagnosis, AI restoration, translation, and archive search.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${notoSerifTamil.variable} ${inter.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
