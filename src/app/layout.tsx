import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
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
  metadataBase: new URL('https://www.tsalastudio.com'),
  title: {
    default: "Tsala Quilting Studio",
    template: "%s | Tsala Quilting Studio",
  },
  description: "Hobby Classes in Bengaluru - Quilting, Sewing, and Crafts.",
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.tsalastudio.com/',
    siteName: 'Tsala Quilting Studio',
    images: [
      {
        url: '/tsala-logo.png',
        width: 800,
        height: 600,
        alt: 'Tsala Quilting Studio Logo',
      },
    ],
  },
  twitter: {
    card: 'summary',
    site: '@tsalastudio',
    creator: '@tsalastudio',
  }
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
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
