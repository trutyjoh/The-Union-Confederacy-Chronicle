import type { Metadata } from "next";
import "./globals.css";

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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
