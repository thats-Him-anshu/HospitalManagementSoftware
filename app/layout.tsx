import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
});

const sansFont = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "NIDARSANAM HEALTH CARE | Natural Healing. Real Results.",
  description: "Naturopathy Hospital Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${displayFont.variable} ${sansFont.variable} ${monoFont.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
