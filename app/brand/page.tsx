import type { Metadata } from "next";
import BrandIdentity from "@/pages/BrandIdentity";

export const metadata: Metadata = {
  title: "Brand Identity",
  description:
    "Das Brand System von Burger & Baguette: Logo, Farbpalette, Packaging, Teamwear und Foodtruck-Auftritt als konsistente Marke.",
  alternates: {
    canonical: "/brand",
  },
  openGraph: {
    title: "Brand Identity | Burger & Baguette",
    description:
      "Das Brand System von Burger & Baguette: Logo, Farbpalette, Packaging, Teamwear und Foodtruck-Auftritt als konsistente Marke.",
    url: "/brand",
  },
};

export default function BrandPage() {
  return <BrandIdentity />;
}
