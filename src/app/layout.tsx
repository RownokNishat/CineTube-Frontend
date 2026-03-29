import { Toaster } from "@/components/ui/sonner";
import QueryProviders from "@/providers/QueryProvider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "CineTube — Movie & Series Rating Portal",
    description: "Discover, rate, and review movies and TV series. Browse thousands of titles, write reviews, manage your watchlist, and subscribe for premium content.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProviders>
          {children}
          <Toaster position="top-right" richColors />
        </QueryProviders>
      </body>
    </html>
  );
}
