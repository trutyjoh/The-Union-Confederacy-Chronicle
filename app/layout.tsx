import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  IM_Fell_English_SC,
  Libre_Baskerville,
  Libre_Caslon_Text,
  Old_Standard_TT,
  Ultra,
  UnifrakturCook,
} from "next/font/google";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { SanityLive } from "@/lib/sanity";
import "./globals.css";

const imFell = IM_Fell_English_SC({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-im-fell",
  display: "swap",
});
const blackletter = UnifrakturCook({
  weight: "700",
  subsets: ["latin"],
  variable: "--font-blackletter",
  display: "swap",
});
const caslon = Libre_Caslon_Text({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-caslon",
  display: "swap",
});
const oldStandard = Old_Standard_TT({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-old-standard",
  display: "swap",
});
const clarendon = Ultra({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-clarendon",
  display: "swap",
});
const cormorant = Cormorant_Garamond({
  weight: "700",
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});
const baskerville = Libre_Baskerville({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-baskerville",
  display: "swap",
});

const fontVariables = [
  imFell.variable,
  blackletter.variable,
  caslon.variable,
  oldStandard.variable,
  clarendon.variable,
  cormorant.variable,
  baskerville.variable,
].join(" ");

const socialImage = "https://raw.githubusercontent.com/trutyjoh/The-Union-Confederacy-Chronicle/main/public/og.png";

export const metadata: Metadata = {
  metadataBase: new URL("https://the-union-confederacy-chronicle.vercel.app"),
  title: "The Union & Confederacy Chronicle",
  description: "An American Civil War newspaper-style campaign journal for GMT Games' The U.S. Civil War.",
  openGraph: {
    title: "The Union & Confederacy Chronicle",
    description: "A GMT Games U.S. Civil War campaign journal presented as a period newspaper.",
    type: "website",
    images: [{ url: socialImage, width: 1200, height: 630, alt: "The Union & Confederacy Chronicle newspaper masthead" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Union & Confederacy Chronicle",
    description: "A GMT Games U.S. Civil War campaign journal presented as a period newspaper.",
    images: [socialImage],
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { isEnabled } = await draftMode();

  return (
    <html lang="en" className={fontVariables}>
      <body>
        {children}
        <SanityLive />
        {isEnabled ? <VisualEditing /> : null}
      </body>
    </html>
  );
}
