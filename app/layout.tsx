import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Union & Confederacy Chronicle",
  description: "An American Civil War newspaper-style campaign journal for GMT Games' The U.S. Civil War.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
