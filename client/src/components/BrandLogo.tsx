import { useTheme } from "@/contexts/ThemeContext";
import { BRAND_LOGOS } from "@/lib/brand";
import { cn } from "@/lib/utils";

type LogoVariant = "horizontal" | "stacked" | "badge";
type LogoTone = "auto" | "dark" | "light" | "tan";

interface BrandLogoProps {
  variant?: LogoVariant;
  tone?: LogoTone;
  className?: string;
  alt?: string;
  fetchPriority?: "high" | "low" | "auto";
}

function resolveLogo(
  variant: LogoVariant,
  tone: LogoTone,
  theme: "light" | "dark"
) {
  const effectiveTone =
    tone === "auto" ? (theme === "dark" ? "dark" : "light") : tone;

  if (variant === "badge") {
    if (effectiveTone === "tan") return BRAND_LOGOS.badgeTan;
    if (effectiveTone === "dark") return BRAND_LOGOS.badgeDark;
    return BRAND_LOGOS.badgeCream;
  }

  if (variant === "stacked") {
    return effectiveTone === "dark"
      ? BRAND_LOGOS.stackedOnDark
      : BRAND_LOGOS.stackedOnLight;
  }

  return effectiveTone === "dark"
    ? BRAND_LOGOS.horizontalOnDark
    : BRAND_LOGOS.horizontalOnLight;
}

export default function BrandLogo({
  variant = "horizontal",
  tone = "auto",
  className,
  alt = "Burger & Baguette",
  fetchPriority,
}: BrandLogoProps) {
  const { theme } = useTheme();
  const src = resolveLogo(variant, tone, theme);

  return (
    <img
      src={src}
      alt={alt}
      className={cn("block h-auto select-none", className)}
      decoding="async"
      fetchPriority={fetchPriority}
      draggable={false}
    />
  );
}
