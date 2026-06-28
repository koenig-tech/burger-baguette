import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Providers from "./providers";
import "../client/src/index.css";

const siteUrl = "https://burger-baguette.de";
const ogImage = `${siteUrl}/assets/seo/og-image.jpg`;
const description =
  "Burger & Baguette ist ein mobiles Foodtruck-Konzept für Premium Smash Burger, Gourmet Baguettes, starke Verpackung und einen klaren Businessplan.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Burger & Baguette | Premium Foodtruck Konzept",
    template: "%s | Burger & Baguette",
  },
  description,
  robots: "index, follow, max-image-preview:large",
  authors: [{ name: "Burger & Baguette" }],
  applicationName: "Burger & Baguette",
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/assets/brand/logo-badge-dark.svg",
    shortcut: "/assets/brand/logo-badge-dark.svg",
    apple: "/assets/brand/logo-badge-dark.svg",
  },
  openGraph: {
    type: "website",
    siteName: "Burger & Baguette",
    locale: "de_DE",
    url: "/",
    title: "Burger & Baguette | Premium Foodtruck Konzept",
    description:
      "Premium Smash Burger und Gourmet Baguettes als mobiles Foodtruck-Konzept mit starkem Brand System und klarer Launch-Strategie.",
    images: [
      {
        url: ogImage,
        secureUrl: ogImage,
        type: "image/jpeg",
        width: 1200,
        height: 630,
        alt: "Burger & Baguette Foodtruck und Brand System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Burger & Baguette | Premium Foodtruck Konzept",
    description:
      "Premium Smash Burger, Gourmet Baguettes, Brand System und Businessplan für ein mobiles Foodtruck-Konzept.",
    images: [ogImage],
  },
};

export const viewport: Viewport = {
  themeColor: "#2A1F1B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="de" dir="ltr" className="dark" data-theme="dark">
      <head>
        <link rel="stylesheet" href="/fonts/google-fonts.css" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
