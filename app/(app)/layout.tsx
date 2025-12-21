import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";

import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://goldfinger-tailor.com"),
  title: "GOLD FINGER Tailor",
  description: "Seoul bespoke atelier for first-class suits, crafted by GOLD FINGER.",
};

export const viewport = {
  maximumScale: 1, // Disable auto-zoom on mobile Safari
};

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});

const instrument = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${geist.variable} ${geistMono.variable} ${instrument.variable}`} lang="ko" suppressHydrationWarning>
      <TooltipProvider>
        <body className="antialiased bg-white">
          <SessionProvider>
            <Suspense fallback={null}>
              <SiteHeader />
            </Suspense>
            {children}
            <SiteFooter />
            <Toaster position="bottom-right" theme="light" />
          </SessionProvider>
        </body>
      </TooltipProvider>
    </html>
  );
}
