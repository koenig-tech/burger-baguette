import { useEffect } from "react";
import { useLocation } from "wouter";

const SITE_URL = "https://burger-baguette.de";
const OG_IMAGE = `${SITE_URL}/assets/seo/og-image.jpg`;

const defaultDescription =
  "Burger & Baguette ist ein mobiles Foodtruck-Konzept für Premium Smash Burger, Gourmet Baguettes, starke Verpackung und einen klaren Businessplan.";

const routeSeo: Record<
  string,
  {
    title: string;
    description: string;
    robots?: string;
  }
> = {
  "/": {
    title: "Burger & Baguette | Premium Foodtruck Konzept",
    description: defaultDescription,
  },
  "/brand": {
    title: "Brand Identity | Burger & Baguette",
    description:
      "Das Brand System von Burger & Baguette: Logo, Farbpalette, Packaging, Teamwear und Foodtruck-Auftritt als konsistente Marke.",
  },
  "/404": {
    title: "Seite nicht gefunden | Burger & Baguette",
    description: "Diese Seite wurde nicht gefunden.",
    robots: "noindex, nofollow",
  },
};

const privatePrefixes = [
  "/intranet",
  "/dienstplan",
  "/lohnabrechnung",
  "/personalakte",
];

function setMeta(
  selector: string,
  attribute: "content" | "href",
  value: string
) {
  const element = document.head.querySelector(selector);
  element?.setAttribute(attribute, value);
}

export default function SeoManager() {
  const [location] = useLocation();

  useEffect(() => {
    const path = location === "/" ? "/" : location.replace(/\/$/, "");
    const isPrivate = privatePrefixes.some(prefix => path.startsWith(prefix));
    const seo = routeSeo[path] ?? {
      title: "Burger & Baguette | Premium Foodtruck Konzept",
      description: defaultDescription,
      robots: isPrivate
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large",
    };
    const canonical = `${SITE_URL}${path === "/" ? "/" : path}`;
    const robots =
      seo.robots ??
      (isPrivate
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large");

    document.title = seo.title;
    document.documentElement.lang = "de";

    setMeta('meta[name="description"]', "content", seo.description);
    setMeta('meta[name="robots"]', "content", robots);
    setMeta('link[rel="canonical"]', "href", canonical);
    setMeta('meta[property="og:title"]', "content", seo.title);
    setMeta('meta[property="og:description"]', "content", seo.description);
    setMeta('meta[property="og:url"]', "content", canonical);
    setMeta('meta[property="og:image"]', "content", OG_IMAGE);
    setMeta('meta[property="og:image:secure_url"]', "content", OG_IMAGE);
    setMeta('meta[name="twitter:title"]', "content", seo.title);
    setMeta('meta[name="twitter:description"]', "content", seo.description);
    setMeta('meta[name="twitter:image"]', "content", OG_IMAGE);
  }, [location]);

  return null;
}
