import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import config from "../config.json";
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
  icons: {
    icon: config.logo,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.tsalastudio.com/',
    siteName: 'Tsala Quilting Studio',
    images: [
      {
        url: config.logo,
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
    images: [config.logo],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Delius&family=Delius+Swash+Caps&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Platypi:ital,wght@0,300..800;1,300..800&family=Playwrite+ZA:wght@100..400&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;1,100;1,200;1,300&family=Quicksand:wght@300..700&family=Roboto+Flex:opsz,wght,XOPQ,XTRA,YOPQ,YTDE,YTFI,YTLC,YTUC@8..144,100..1000,96,468,79,-203,738,514,712&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen font-sans`}
      >
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
