import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { AuthSessionProvider } from "@/components/auth/auth-session-provider";
import { Toaster } from "@/components/ui/sonner";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

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

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${geist.variable} ${geistMono.variable} ${playfair.variable}`} lang="en" suppressHydrationWarning>
      <body className="antialiased bg-neutral-50">
        <AuthSessionProvider>
          <SidebarProvider
            defaultOpen
            style={
              {
                "--sidebar-width": "14rem",
                "--sidebar-width-mobile": "14rem",
              } as React.CSSProperties
            }
          >
            <AdminSidebar />
            <SidebarInset className="md:ml-56">
              <main className="flex w-full scrollbar-hide break-keep">{children}</main>
            </SidebarInset>
          </SidebarProvider>
          <Toaster position="bottom-right" />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
