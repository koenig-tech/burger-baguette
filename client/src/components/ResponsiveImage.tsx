import type { ImgHTMLAttributes } from "react";

type ResponsiveImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  sizes: string;
  widths?: number[];
};

const NATIVE_SERIES_WIDTHS = [640, 960, 1280, 1672];
const SITE_MOCKUP_WIDTHS = [480, 800, 1200, 1800];
const SITE_MOCKUP_NATIVE_WIDTHS: Record<string, number> = {
  "brand-baguette-wrap": 1200,
};

function variantForWidth(src: string, width: number) {
  return src.replace(/\.png\.webp$/, `-${width}.webp`);
}

function intrinsicWidthFor(src: string) {
  if (src.includes("/generated-brand/native-series/")) return 1672;
  if (src.includes("/assets/brand/site/")) {
    const match = src.match(/\/([^/]+)\.png\.webp$/);
    const key = match?.[1];
    return key ? (SITE_MOCKUP_NATIVE_WIDTHS[key] ?? 1800) : 1800;
  }

  return undefined;
}

export function srcSetForImage(src: string, widths?: number[]) {
  if (!src.endsWith(".png.webp")) return undefined;

  const intrinsicWidth = intrinsicWidthFor(src);
  const candidateWidths =
    widths ??
    (src.includes("/assets/brand/site/")
      ? SITE_MOCKUP_WIDTHS
      : NATIVE_SERIES_WIDTHS);

  return candidateWidths
    .filter((width) => !intrinsicWidth || width <= intrinsicWidth)
    .map((width) => {
      const imageSrc =
        width === intrinsicWidth ? src : variantForWidth(src, width);
      return `${imageSrc} ${width}w`;
    })
    .join(", ");
}

export default function ResponsiveImage({
  src,
  sizes,
  widths,
  ...props
}: ResponsiveImageProps) {
  return (
    <img
      {...props}
      src={src}
      srcSet={srcSetForImage(src, widths)}
      sizes={sizes}
    />
  );
}
