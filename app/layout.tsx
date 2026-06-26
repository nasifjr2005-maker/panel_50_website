import type { Metadata } from "next";
import { Oswald } from "next/font/google";
import { PremiumBackground } from "@/components/premium-background";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-oswald"
});

const title = "PANEL 50 OFFICIAL STORE | Premium Free Fire Panels & Gaming Services";
const description =
  "Buy trusted Free Fire panels and gaming services from PANEL 50 OFFICIAL STORE. Fast delivery, secure service, affordable pricing, and premium customer support.";

export const metadata: Metadata = {
  metadataBase: new URL("https://panel50officialstore.com"),
  title,
  description,
  keywords: [
    "PANEL 50 OFFICIAL STORE",
    "Free Fire panels",
    "gaming services",
    "Free Fire panel store",
    "instant panel delivery"
  ],
  icons: {
    icon: "/frame.png",
    shortcut: "/frame.png",
    apple: "/frame.png"
  },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "PANEL 50 OFFICIAL STORE",
    type: "website",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "PANEL 50 OFFICIAL STORE premium gaming services"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.svg"]
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${oswald.variable} antialiased`}>
        <PremiumBackground />
        {children}
      </body>
    </html>
  );
}
