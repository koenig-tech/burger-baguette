"use client";

import { useEffect, useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import Footer from "@/components/Footer";
import { BRAND_LOGOS } from "@/lib/brand";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Copy,
  Download,
} from "lucide-react";

const colors = [
  {
    name: "Ink",
    hex: "#2A1F1B",
    rgb: "42 · 31 · 27",
    use: "Tiefe & Kontrast",
    dark: true,
  },
  {
    name: "Cream",
    hex: "#EFE6D8",
    rgb: "239 · 230 · 216",
    use: "Fläche & Ruhe",
    dark: false,
  },
  {
    name: "Tan",
    hex: "#D3BE9D",
    rgb: "211 · 190 · 157",
    use: "Wärme & Textur",
    dark: false,
  },
  {
    name: "Gold",
    hex: "#C9A84C",
    rgb: "201 · 168 · 76",
    use: "Akzent & Signatur",
    dark: false,
  },
  {
    name: "Herb",
    hex: "#64785A",
    rgb: "100 · 120 · 90",
    use: "Sekundär & Frische",
    dark: true,
  },
];

const logoVariants = [
  {
    label: "Primär · Horizontal",
    note: "Standard für Header, Schilder und Web.",
    src: BRAND_LOGOS.horizontalOnDark,
    file: "logo-horizontal-dark-cream.svg",
    bg: "#120a04",
  },
  {
    label: "Sekundär · Gestapelt",
    note: "Für quadratische Flächen und Packaging.",
    src: BRAND_LOGOS.stackedOnDark,
    file: "logo-stacked-dark-cream.svg",
    bg: "#120a04",
  },
  {
    label: "Monogramm · Badge",
    note: "Favicon, App-Icon, Sticker, Social.",
    src: BRAND_LOGOS.badgeCream,
    file: "logo-badge-cream.svg",
    bg: "#120a04",
  },
];

const logoOnBackgrounds = [
  { label: "Auf Ink", bg: "#2A1F1B", src: BRAND_LOGOS.horizontalOnDark },
  { label: "Auf Cream", bg: "#EFE6D8", src: BRAND_LOGOS.horizontalOnLight },
  { label: "Auf Tan", bg: "#D3BE9D", src: BRAND_LOGOS.horizontalOnLight },
  { label: "Auf Gold", bg: "#C9A84C", src: BRAND_LOGOS.horizontalOnLight },
];

const badgeOnBackgrounds = [
  { label: "Cream-Badge", bg: "#120a04", src: BRAND_LOGOS.badgeCream },
  { label: "Tan-Badge", bg: "#2A1F1B", src: BRAND_LOGOS.badgeTan },
  { label: "Dark-Badge", bg: "#EFE6D8", src: BRAND_LOGOS.badgeDark },
  { label: "Dark auf Gold", bg: "#C9A84C", src: BRAND_LOGOS.badgeDark },
];

const fonts = [
  {
    name: "Space Grotesk",
    role: "Display & Headlines",
    family: "'Space Grotesk', sans-serif",
    sample: "Burger & Baguette",
    weights: "Medium · SemiBold · Bold",
    italic: false,
  },
  {
    name: "DM Sans",
    role: "Fließtext & UI",
    family: "'DM Sans', sans-serif",
    sample: "Mobile Gourmet, frisch zubereitet.",
    weights: "Regular · Medium · SemiBold",
    italic: false,
  },
  {
    name: "Cormorant Garamond",
    role: "Akzent & Zitate",
    family: "'Cormorant Garamond', serif",
    sample: "Qualität trifft Mobilität",
    weights: "Italic · Medium",
    italic: true,
  },
];

type SignatureLayout =
  | "classic"
  | "compact"
  | "stacked"
  | "darkBand"
  | "minimal"
  | "softCard"
  | "split"
  | "goldFooter"
  | "framed"
  | "brandBar";

type SignatureVariant = {
  id: string;
  name: string;
  description: string;
  layout: SignatureLayout;
};

const signatureProfile = {
  name: "Max Mustermann",
  role: "Gründer · Burger & Baguette",
  phone: "+49 176 0000000",
  email: "hallo@burger-baguette.de",
  website: "burger-baguette.de",
  location: "Düsseldorf",
};

const signatureAssets = {
  badgeDark: "https://burger-baguette.de/assets/brand/logo-badge-dark.svg",
  badgeCream: "https://burger-baguette.de/assets/brand/logo-badge-cream.svg",
  badgeTan: "https://burger-baguette.de/assets/brand/logo-badge-tan.svg",
  horizontalDark:
    "https://burger-baguette.de/assets/brand/logo-horizontal-cream-dark.svg",
  horizontalCream:
    "https://burger-baguette.de/assets/brand/logo-horizontal-dark-cream.svg",
  stackedDark:
    "https://burger-baguette.de/assets/brand/logo-stacked-cream-dark.svg",
  stackedCream:
    "https://burger-baguette.de/assets/brand/logo-stacked-dark-cream.svg",
};

const signaturePreviewAssets = {
  badgeDark: BRAND_LOGOS.badgeDark,
  badgeCream: BRAND_LOGOS.badgeCream,
  badgeTan: BRAND_LOGOS.badgeTan,
  horizontalDark: BRAND_LOGOS.horizontalOnLight,
  horizontalCream: BRAND_LOGOS.horizontalOnDark,
  stackedDark: BRAND_LOGOS.stackedOnLight,
  stackedCream: BRAND_LOGOS.stackedOnDark,
};

const signatureVariants: SignatureVariant[] = [
  {
    id: "classic",
    name: "01 Classic Divider",
    description: "Badge, Gold-Trennlinie und kompakte Kontaktdaten.",
    layout: "classic",
  },
  {
    id: "compact",
    name: "02 Compact Row",
    description: "Schmale horizontale Signatur für kurze Antworten.",
    layout: "compact",
  },
  {
    id: "stacked",
    name: "03 Center Stack",
    description: "Zentriertes Layout für persönliche Erstkontakte.",
    layout: "stacked",
  },
  {
    id: "darkBand",
    name: "04 Dark Band",
    description: "Kontraststarkes Premium-Layout mit dunklem Markenfeld.",
    layout: "darkBand",
  },
  {
    id: "minimal",
    name: "05 Minimal Line",
    description: "Sehr reduziert mit goldener Kopflinie.",
    layout: "minimal",
  },
  {
    id: "softCard",
    name: "06 Soft Card",
    description: "Warmer Kartenlook für Angebote und Pitches.",
    layout: "softCard",
  },
  {
    id: "split",
    name: "07 Split Contact",
    description: "Name und Kontaktdaten klar zweispaltig getrennt.",
    layout: "split",
  },
  {
    id: "goldFooter",
    name: "08 Gold Footer",
    description: "Website und Standort als goldene Schlusszeile.",
    layout: "goldFooter",
  },
  {
    id: "framed",
    name: "09 Thin Frame",
    description: "Feiner Rahmen für ein ruhiges Corporate-Format.",
    layout: "framed",
  },
  {
    id: "brandBar",
    name: "10 Brand Bar",
    description: "Horizontales Logo als starke Markenzeile.",
    layout: "brandBar",
  },
];

function buildSignatureHtml(layout: SignatureLayout, assets = signatureAssets) {
  const p = signatureProfile;
  const font = "font-family:'DM Sans',Arial,sans-serif;";
  const head = "font-family:'Space Grotesk',Arial,sans-serif;font-weight:700;";
  const contact = `${p.phone} · ${p.email}`;
  const location = `${p.website} · ${p.location}`;

  switch (layout) {
    case "compact":
      return `<table style="${font}color:#2A1F1B;border-collapse:collapse"><tr><td style="padding-right:16px"><img src="${assets.horizontalDark}" width="124" alt="Burger & Baguette"></td><td style="padding-right:20px"><div style="${head}font-size:15px;color:#2A1F1B">${p.name}</div><div style="font-size:11px;color:#9a6a1c;font-weight:700">${p.role}</div></td><td style="border-left:2px solid #C9A84C;padding-left:18px;font-size:11px;line-height:1.65;color:#555">${contact}<br>${location}</td></tr></table>`;
    case "stacked":
      return `<table style="${font}width:360px;text-align:center;color:#2A1F1B;border-collapse:collapse"><tr><td><img src="${assets.stackedDark}" width="76" alt="Burger & Baguette"><div style="${head}font-size:17px;margin-top:10px">${p.name}</div><div style="font-size:12px;color:#9a6a1c;font-weight:700">${p.role}</div><div style="height:10px;border-bottom:2px solid #C9A84C;margin:0 auto 10px;width:72px"></div><div style="font-size:11px;line-height:1.65;color:#555">${contact}<br>${location}</div></td></tr></table>`;
    case "darkBand":
      return `<table style="${font}background:#2A1F1B;color:#EFE6D8;border-radius:14px;border-collapse:separate;padding:16px"><tr><td style="padding-right:18px"><img src="${assets.horizontalCream}" width="150" alt="Burger & Baguette"></td><td><div style="${head}font-size:16px;color:#EFE6D8">${p.name}</div><div style="font-size:12px;color:#C9A84C;font-weight:700">${p.role}</div><div style="font-size:11px;line-height:1.7;color:#D3BE9D;margin-top:7px">${contact}<br>${location}</div></td></tr></table>`;
    case "minimal":
      return `<table style="${font}color:#2A1F1B;border-top:3px solid #C9A84C;padding-top:12px;border-collapse:collapse"><tr><td style="padding-right:18px"><img src="${assets.badgeTan}" width="34" height="34" alt="Burger & Baguette"></td><td><div style="${head}font-size:16px;color:#2A1F1B">${p.name}</div><div style="font-size:12px;color:#9a6a1c;font-weight:700">${p.role}</div><div style="font-size:11px;line-height:1.65;color:#555;margin-top:8px">${contact} · ${location}</div></td></tr></table>`;
    case "softCard":
      return `<table style="${font}background:#EFE6D8;border:1px solid #D3BE9D;border-radius:16px;color:#2A1F1B;border-collapse:separate;padding:18px"><tr><td style="padding-right:18px"><img src="${assets.stackedDark}" width="64" alt="Burger & Baguette"></td><td><div style="${head}font-size:16px">${p.name}</div><div style="font-size:12px;color:#9a6a1c;font-weight:700">${p.role}</div><div style="font-size:11px;line-height:1.65;color:#5d5048;margin-top:8px">${contact}<br>${location}</div></td></tr></table>`;
    case "split":
      return `<table style="${font}color:#2A1F1B;border-collapse:collapse"><tr><td style="padding-right:24px;vertical-align:top"><img src="${assets.horizontalDark}" width="132" alt="Burger & Baguette" style="margin-bottom:10px"><div style="${head}font-size:16px">${p.name}</div><div style="font-size:12px;color:#9a6a1c;font-weight:700">${p.role}</div></td><td style="border-left:2px solid #C9A84C;padding-left:20px;font-size:11px;line-height:1.8;color:#555;vertical-align:top">${p.phone}<br>${p.email}<br>${p.website}<br>${p.location}</td></tr></table>`;
    case "goldFooter":
      return `<table style="${font}width:390px;color:#2A1F1B;border-collapse:separate;border-spacing:0"><tr><td style="padding:14px 16px;background:#fffdf8;border:1px solid #D3BE9D;border-bottom:0"><img src="${assets.badgeDark}" width="40" height="40" alt="Burger & Baguette" style="float:right;margin-left:16px"><div style="${head}font-size:16px">${p.name}</div><div style="font-size:12px;color:#9a6a1c;font-weight:700">${p.role}</div><div style="font-size:11px;color:#555;margin-top:7px">${contact}</div></td></tr><tr><td style="padding:9px 16px;background:#C9A84C;color:#2A1F1B;font-size:11px;font-weight:700">${location}</td></tr></table>`;
    case "framed":
      return `<table style="${font}color:#2A1F1B;border:1px solid #C9A84C;border-radius:14px;border-collapse:separate;padding:15px"><tr><td style="padding-right:15px"><span style="display:inline-block;background:#2A1F1B;border-radius:10px;padding:8px"><img src="${assets.badgeCream}" width="42" height="42" alt="Burger & Baguette"></span></td><td><div style="${head}font-size:16px">${p.name}</div><div style="font-size:12px;color:#9a6a1c;font-weight:700">${p.role}</div><div style="font-size:11px;line-height:1.65;color:#555;margin-top:7px">${contact}<br>${location}</div></td></tr></table>`;
    case "brandBar":
      return `<table style="${font}width:420px;color:#2A1F1B;border-collapse:collapse"><tr><td style="padding-bottom:12px;border-bottom:2px solid #C9A84C"><img src="${assets.horizontalDark}" width="168" alt="Burger & Baguette"></td></tr><tr><td style="padding-top:12px"><div style="${head}font-size:16px">${p.name}</div><div style="font-size:12px;color:#9a6a1c;font-weight:700">${p.role}</div><div style="font-size:11px;line-height:1.65;color:#555;margin-top:7px">${contact}<br>${location}</div></td></tr></table>`;
    case "classic":
    default:
      return `<table style="${font}color:#2A1F1B;border-collapse:collapse"><tr><td style="padding-right:18px;border-right:2px solid #C9A84C"><img src="${assets.badgeDark}" width="58" height="58" alt="Burger & Baguette"></td><td style="padding-left:18px"><div style="${head}font-size:16px;color:#2A1F1B">${p.name}</div><div style="font-size:12px;color:#9a6a1c;font-weight:700">${p.role}</div><div style="height:8px"></div><div style="font-size:12px;color:#555">${contact}</div><div style="font-size:12px;color:#555">${location}</div></td></tr></table>`;
  }
}

const downloads = [
  {
    label: "Logo Horizontal (Cream)",
    file: BRAND_LOGOS.horizontalOnDark,
    previewBg: "#2A1F1B",
    preview: "wide",
  },
  {
    label: "Logo Horizontal (Dark)",
    file: BRAND_LOGOS.horizontalOnLight,
    previewBg: "#EFE6D8",
    preview: "wide",
  },
  {
    label: "Logo Stacked (Cream)",
    file: BRAND_LOGOS.stackedOnDark,
    previewBg: "#2A1F1B",
    preview: "stacked",
  },
  {
    label: "Logo Stacked (Dark)",
    file: BRAND_LOGOS.stackedOnLight,
    previewBg: "#EFE6D8",
    preview: "stacked",
  },
  {
    label: "Badge (Cream)",
    file: BRAND_LOGOS.badgeCream,
    previewBg: "#2A1F1B",
    preview: "badge",
  },
  {
    label: "Badge (Dark)",
    file: BRAND_LOGOS.badgeDark,
    previewBg: "#EFE6D8",
    preview: "badge",
  },
  {
    label: "Badge (Tan)",
    file: BRAND_LOGOS.badgeTan,
    previewBg: "#2A1F1B",
    preview: "badge",
  },
];

type DownloadAsset = (typeof downloads)[number];
type DownloadFormat = "svg" | "png" | "jpg";

const downloadFormats: DownloadFormat[] = ["svg", "png", "jpg"];

const SectionHead = ({
  index,
  eyebrow,
  title,
  copy,
}: {
  index: string;
  eyebrow: string;
  title: string;
  copy?: string;
}) => (
  <div className="mb-10 flex flex-col gap-5 border-b border-[var(--bb-border)] pb-8 lg:flex-row lg:items-end lg:justify-between">
    <div className="max-w-2xl">
      <div className="bb-number mb-4">
        {index} · {eyebrow}
      </div>
      <h2 className="lux-head text-3xl sm:text-4xl">{title}</h2>
    </div>
    {copy ? (
      <p className="bb-copy max-w-md text-sm lg:text-right">{copy}</p>
    ) : null}
  </div>
);

export default function BrandIdentity() {
  const [copied, setCopied] = useState(false);
  const [openDownload, setOpenDownload] = useState<string | null>(null);
  const [selectedSignatureId, setSelectedSignatureId] = useState(
    signatureVariants[0].id
  );
  const [signatureMenuOpen, setSignatureMenuOpen] = useState(false);
  const selectedSignature =
    signatureVariants.find(variant => variant.id === selectedSignatureId) ??
    signatureVariants[0];
  const selectedSignatureIndex = Math.max(
    signatureVariants.findIndex(variant => variant.id === selectedSignature.id),
    0
  );
  const signatureHtml = buildSignatureHtml(selectedSignature.layout);
  const signaturePreviewHtml = buildSignatureHtml(
    selectedSignature.layout,
    signaturePreviewAssets
  );

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      if (!target.closest("[data-signature-menu-root]")) {
        setSignatureMenuOpen(false);
      }

      if (!target.closest("[data-download-menu-root]")) {
        setOpenDownload(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setSignatureMenuOpen(false);
      setOpenDownload(null);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const selectSignature = (index: number) => {
    const nextIndex =
      (index + signatureVariants.length) % signatureVariants.length;
    setSelectedSignatureId(signatureVariants[nextIndex].id);
    setSignatureMenuOpen(false);
    setCopied(false);
  };

  const downloadAsset = async (
    asset: DownloadAsset,
    format: DownloadFormat
  ) => {
    const fallbackName = asset.label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const fileName =
      asset.file
        .split("/")
        .pop()
        ?.replace(/\.svg$/i, "") || fallbackName;

    if (format === "svg") {
      const link = document.createElement("a");
      link.href = asset.file;
      link.download = `${fileName}.svg`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      return;
    }

    try {
      const response = await fetch(asset.file);
      const svgText = await response.text();
      const svgDocument = new DOMParser().parseFromString(
        svgText,
        "image/svg+xml"
      );
      const svgElement = svgDocument.documentElement;
      const viewBox = svgElement
        .getAttribute("viewBox")
        ?.split(/\s+/)
        .map(Number);
      const widthAttr = Number(svgElement.getAttribute("width"));
      const heightAttr = Number(svgElement.getAttribute("height"));
      const width =
        Number.isFinite(widthAttr) && widthAttr > 0
          ? widthAttr
          : viewBox?.[2] || 1200;
      const height =
        Number.isFinite(heightAttr) && heightAttr > 0
          ? heightAttr
          : viewBox?.[3] || 800;
      const scale = 2;
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);

      const context = canvas.getContext("2d");
      if (!context) return;

      if (format === "jpg") {
        context.fillStyle = asset.previewBg;
        context.fillRect(0, 0, canvas.width, canvas.height);
      }

      const svgBlob = new Blob([svgText], {
        type: "image/svg+xml;charset=utf-8",
      });
      const svgUrl = URL.createObjectURL(svgBlob);
      const image = new Image();
      const imageLoaded = new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () =>
          reject(new Error("Logo konnte nicht gerendert werden."));
      });

      image.src = svgUrl;
      await imageLoaded;
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(svgUrl);

      const mimeType = format === "png" ? "image/png" : "image/jpeg";
      const outputBlob = await new Promise<Blob | null>(resolve => {
        canvas.toBlob(resolve, mimeType, format === "jpg" ? 0.94 : undefined);
      });
      if (!outputBlob) return;

      const outputUrl = URL.createObjectURL(outputBlob);
      const link = document.createElement("a");
      link.href = outputUrl;
      link.download = `${fileName}.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(outputUrl);
    } catch (error) {
      console.error(error);
    }
  };

  const copySignature = async () => {
    let ok = false;
    try {
      await navigator.clipboard.writeText(signatureHtml);
      ok = true;
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = signatureHtml;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        ok = document.execCommand("copy");
        document.body.removeChild(ta);
      } catch {
        ok = false;
      }
    }
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bb-site">
      {/* Top bar */}
      <header
        className="sticky top-0 z-50 border-b border-[var(--bb-border)] backdrop-blur-xl"
        style={{
          background: "color-mix(in srgb, var(--bb-ink-deep) 82%, transparent)",
        }}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <BrandLogo
              variant="horizontal"
              tone="dark"
              className="h-8 w-auto max-w-[170px] sm:h-9 sm:max-w-[210px]"
            />
            <div className="leading-tight">
              <div className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[var(--bb-text-soft)]">
                Brand Guidelines
              </div>
            </div>
          </div>
          <a
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--bb-text-muted)] transition-colors hover:text-[var(--bb-gold)]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <ArrowLeft size={15} />
            Startseite
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="bb-section bb-section--deep">
        <div className="bb-inner container mx-auto px-6">
          <div className="bb-eyebrow mb-6">Markenidentität</div>
          <h1 className="lux-head text-5xl sm:text-6xl xl:text-7xl">
            Das Marken­handbuch von{" "}
            <span className="lux-accent">Burger &amp; Baguette.</span>
          </h1>
          <p className="bb-copy mt-6 max-w-2xl">
            Logos, Farben, Typografie, Favicon und E-Mail-Signatur — alle
            Bausteine der Marke an einem Ort, konsistent einsetzbar über Truck,
            Packaging, Web und Kommunikation.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {[
              "Logo-Suite",
              "Farben",
              "Typografie",
              "Favicon",
              "E-Mail-Signatur",
              "Downloads",
            ].map(tag => (
              <span key={tag} className="bb-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 01 Logo suite */}
      <section className="bb-section bb-section--soft">
        <div className="bb-inner container mx-auto px-6">
          <SectionHead
            index="01"
            eyebrow="Logo-Suite"
            title="Drei Lockups, ein System."
            copy="Horizontal als Standard, gestapelt für quadratische Flächen, Monogramm als kompaktes Signet."
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {logoVariants.map(v => (
              <div
                key={v.file}
                className="overflow-hidden rounded-2xl border border-[var(--bb-border)] bg-[var(--bb-surface)]"
              >
                <div
                  className="flex h-56 items-center justify-center p-10"
                  style={{ background: v.bg }}
                >
                  <img
                    src={v.src}
                    alt={v.label}
                    className="max-h-20 w-auto max-w-[80%]"
                  />
                </div>
                <div className="flex items-center justify-between gap-3 p-5">
                  <div>
                    <div className="lux-head text-base">{v.label}</div>
                    <div className="mt-1 text-xs text-[var(--bb-text-muted)]">
                      {v.note}
                    </div>
                  </div>
                  <a
                    href={v.src}
                    download={v.file}
                    className="bb-icon-box shrink-0"
                    aria-label={`${v.label} herunterladen`}
                  >
                    <Download size={18} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 02 Logo on backgrounds */}
      <section className="bb-section bb-section--deep">
        <div className="bb-inner container mx-auto px-6">
          <SectionHead
            index="02"
            eyebrow="Hintergründe"
            title="Logo auf jeder Fläche."
            copy="Auf dunklen Flächen die helle Version, auf hellen und farbigen Flächen die dunkle Version verwenden."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {logoOnBackgrounds.map(b => (
              <div
                key={b.label}
                className="overflow-hidden rounded-2xl border border-[var(--bb-border)]"
              >
                <div
                  className="flex h-40 items-center justify-center p-8"
                  style={{ background: b.bg }}
                >
                  <img
                    src={b.src}
                    alt={b.label}
                    className="max-h-12 w-auto max-w-[78%]"
                  />
                </div>
                <div className="bg-[var(--bb-surface)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--bb-text-muted)]">
                  {b.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {badgeOnBackgrounds.map(b => (
              <div
                key={b.label}
                className="overflow-hidden rounded-2xl border border-[var(--bb-border)]"
              >
                <div
                  className="flex h-40 items-center justify-center p-8"
                  style={{ background: b.bg }}
                >
                  <img src={b.src} alt={b.label} className="h-16 w-16" />
                </div>
                <div className="bg-[var(--bb-surface)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--bb-text-muted)]">
                  {b.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 03 Colors */}
      <section className="bb-section bb-section--soft">
        <div className="bb-inner container mx-auto px-6">
          <SectionHead
            index="03"
            eyebrow="Farbpalette"
            title="Vier Kernfarben, ein Akzent."
            copy="Ink und Cream tragen die Flächen, Gold setzt Akzente, Tan schafft Wärme, Herb steht für Frische."
          />
          <div className="flex snap-x overflow-x-auto overflow-y-hidden rounded-2xl border border-[var(--bb-border)] bg-[var(--bb-border)]">
            {colors.map(c => {
              const ink = c.dark ? "#F4F1EA" : "#241A14";
              return (
                <div
                  key={c.name}
                  className="flex min-h-[160px] min-w-[72%] snap-start flex-col justify-between border-r border-[var(--bb-border)] p-4 last:border-r-0 sm:min-w-[42%] lg:min-w-[20%]"
                  style={{ background: c.hex }}
                >
                  <code
                    className="text-[0.7rem] tracking-[0.18em]"
                    style={{ color: ink }}
                  >
                    {c.hex}
                  </code>
                  <div style={{ color: ink }}>
                    <div
                      className="font-semibold"
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: "1.3rem",
                      }}
                    >
                      {c.name}
                    </div>
                    <div className="mt-1 text-xs opacity-70">RGB {c.rgb}</div>
                    <div className="mt-2 text-xs opacity-70">{c.use}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 04 Typography */}
      <section className="bb-section bb-section--deep">
        <div className="bb-inner container mx-auto px-6">
          <SectionHead
            index="04"
            eyebrow="Typografie"
            title="Drei Schriften, klare Rollen."
            copy="Geometrische Display-Schrift, ruhiger Fließtext und eine Serifen-Kursive für Akzente."
          />
          <div className="grid gap-4">
            {fonts.map(f => (
              <div
                key={f.name}
                className="grid gap-6 rounded-2xl border border-[var(--bb-border)] bg-[var(--bb-surface)] p-8 lg:grid-cols-[minmax(0,0.34fr)_minmax(0,0.66fr)] lg:items-center"
              >
                <div>
                  <div className="lux-head text-xl">{f.name}</div>
                  <div className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--bb-gold)]">
                    {f.role}
                  </div>
                  <div className="mt-2 text-xs text-[var(--bb-text-muted)]">
                    {f.weights}
                  </div>
                </div>
                <div
                  className="text-[var(--bb-text)]"
                  style={{
                    fontFamily: f.family,
                    fontStyle: f.italic ? "italic" : "normal",
                    fontSize: "clamp(1.8rem, 4vw, 3rem)",
                    fontWeight: f.italic ? 500 : 600,
                    lineHeight: 1.1,
                    color: f.italic ? "var(--bb-gold)" : "var(--bb-text)",
                  }}
                >
                  {f.sample}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 05 Favicon & app icon */}
      <section className="bb-section bb-section--soft">
        <div className="bb-inner container mx-auto px-6">
          <SectionHead
            index="05"
            eyebrow="Favicon & App-Icon"
            title="Das Monogramm im Kleinformat."
            copy="Das Badge bleibt auch bei 16 px klar lesbar — ideal für Browser-Tabs, App-Icons und Social Avatare."
          />
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Browser tab mock */}
            <div className="rounded-2xl border border-[var(--bb-border)] bg-[var(--bb-surface)] p-7">
              <div className="bb-number mb-5">Browser-Tab</div>
              <div className="overflow-hidden rounded-lg border border-[var(--bb-border)] bg-[var(--bb-surface-soft)]">
                <div className="flex items-center gap-2 bg-[var(--bb-ink-soft)] px-3 py-2.5">
                  <img
                    src={BRAND_LOGOS.badgeCream}
                    alt="favicon"
                    className="h-4 w-4"
                  />
                  <span className="text-xs text-[var(--bb-text-muted)]">
                    Burger &amp; Baguette — Foodtruck
                  </span>
                  <span className="ml-auto text-[var(--bb-text-soft)]">×</span>
                </div>
                <div className="p-6">
                  <div className="flex items-end gap-5">
                    {[16, 32, 48].map(s => (
                      <div key={s} className="text-center">
                        <div
                          className="flex items-center justify-center rounded-md bg-[#120a04]"
                          style={{ height: s + 16, width: s + 16 }}
                        >
                          <img
                            src={BRAND_LOGOS.badgeCream}
                            alt={`${s}px`}
                            style={{ height: s, width: s }}
                          />
                        </div>
                        <div className="mt-2 text-[0.7rem] text-[var(--bb-text-soft)]">
                          {s}px
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* App icon */}
            <div className="rounded-2xl border border-[var(--bb-border)] bg-[var(--bb-surface)] p-7">
              <div className="bb-number mb-5">App-Icon</div>
              <div className="flex flex-wrap items-center gap-6">
                <div
                  className="flex h-28 w-28 items-center justify-center rounded-[1.6rem] shadow-lg shadow-black/30"
                  style={{ background: "#120a04" }}
                >
                  <img
                    src={BRAND_LOGOS.badgeTan}
                    alt="App Icon dark"
                    className="h-16 w-16"
                  />
                </div>
                <div
                  className="flex h-28 w-28 items-center justify-center rounded-[1.6rem] shadow-lg shadow-black/20"
                  style={{ background: "#C9A84C" }}
                >
                  <img
                    src={BRAND_LOGOS.badgeDark}
                    alt="App Icon gold"
                    className="h-16 w-16"
                  />
                </div>
                <div
                  className="flex h-28 w-28 items-center justify-center rounded-full border border-[var(--bb-border)]"
                  style={{ background: "#EFE6D8" }}
                >
                  <img
                    src={BRAND_LOGOS.badgeDark}
                    alt="Avatar"
                    className="h-14 w-14"
                  />
                </div>
              </div>
              <p className="mt-5 text-xs text-[var(--bb-text-muted)]">
                App-Icon mit abgerundeter Ecke, runder Social-Avatar — immer mit
                Schutzraum um das Monogramm.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 06 Email signature */}
      <section className="bb-section bb-section--deep">
        <div className="bb-inner container mx-auto px-6">
          <SectionHead
            index="06"
            eyebrow="E-Mail-Signatur"
            title="Eine Signatur, ein Auftritt."
            copy="Einheitliche Signatur für das gesamte Team — Monogramm, Name, Rolle und Kontakt mit Gold-Trennlinie."
          />
          <div className="rounded-2xl border border-[var(--bb-border)] bg-[var(--bb-surface)] p-5 sm:p-6">
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="bb-number">{selectedSignature.name}</div>
                <p className="mt-1 text-sm text-[var(--bb-text-muted)]">
                  {selectedSignature.description}
                </p>
              </div>
              <div className="relative w-full sm:w-80" data-signature-menu-root>
                <button
                  type="button"
                  aria-label="Signatur-Layout auswählen"
                  aria-expanded={signatureMenuOpen}
                  aria-haspopup="menu"
                  onClick={() => setSignatureMenuOpen(open => !open)}
                  className="flex min-h-12 w-full items-center justify-between gap-3 rounded-lg border border-[var(--bb-border)] bg-[var(--bb-surface-strong)] px-4 text-left text-sm font-bold text-[var(--bb-text)] transition-colors hover:border-[var(--bb-border-strong)]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  <span className="truncate">{selectedSignature.name}</span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 transition-transform duration-200 ${signatureMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {signatureMenuOpen ? (
                  <div
                    role="menu"
                    className="absolute right-0 top-14 z-30 max-h-80 w-full overflow-auto rounded-lg border border-[var(--bb-border)] bg-[var(--bb-ink-deep)] p-1 shadow-2xl shadow-black/40"
                  >
                    {signatureVariants.map((variant, index) => (
                      <button
                        key={variant.id}
                        type="button"
                        role="menuitem"
                        onClick={() => selectSignature(index)}
                        className={`grid w-full gap-0.5 rounded-md px-3 py-2.5 text-left transition-colors ${
                          selectedSignature.id === variant.id
                            ? "bg-[var(--bb-gold)]/16 text-[var(--bb-gold)]"
                            : "text-[var(--bb-text-muted)] hover:bg-[var(--bb-gold)]/10 hover:text-[var(--bb-gold)]"
                        }`}
                      >
                        <span
                          className="text-xs font-bold uppercase tracking-[0.12em]"
                          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                          {variant.name}
                        </span>
                        <span className="text-xs leading-snug opacity-75">
                          {variant.description}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div
              className="flex h-[260px] items-center overflow-auto rounded-xl bg-[#fffdf8] p-6 sm:h-[300px] sm:p-8 lg:h-[320px]"
              data-signature-preview
            >
              <div
                className="flex w-max min-w-full justify-center"
                dangerouslySetInnerHTML={{ __html: signaturePreviewHtml }}
              />
            </div>

            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => selectSignature(selectedSignatureIndex - 1)}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[var(--bb-border)] px-5 text-sm font-bold text-[var(--bb-text-muted)] transition-colors hover:border-[var(--bb-border-strong)] hover:text-[var(--bb-gold)]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <ArrowLeft size={16} />
                Prev
              </button>
              <button
                type="button"
                onClick={copySignature}
                className="bb-button bb-button-primary min-h-13 px-7"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Kopiert!" : "Signatur-HTML kopieren"}
              </button>
              <button
                type="button"
                onClick={() => selectSignature(selectedSignatureIndex + 1)}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[var(--bb-border)] px-5 text-sm font-bold text-[var(--bb-text-muted)] transition-colors hover:border-[var(--bb-border-strong)] hover:text-[var(--bb-gold)]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Next
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 07 Downloads */}
      <section className="bb-section bb-section--soft">
        <div className="bb-inner container mx-auto px-6">
          <SectionHead
            index="07"
            eyebrow="Downloads"
            title="Alle Assets, sofort einsatzbereit."
            copy="SVG-Dateien skalieren verlustfrei — ideal für Druck, Web und Sticker."
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {downloads.map(d => (
              <div
                key={d.label}
                data-download-menu-root
                className={`group relative flex items-center justify-between gap-4 rounded-xl border border-[var(--bb-border)] bg-[var(--bb-surface)] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--bb-border-strong)] ${
                  openDownload === d.label ? "z-40" : "z-0"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg border border-[var(--bb-border-strong)] p-2.5 shadow-inner shadow-black/10"
                    style={{ backgroundColor: d.previewBg }}
                  >
                    <img
                      src={d.file}
                      alt=""
                      className={
                        d.preview === "wide"
                          ? "h-auto max-h-10 w-full object-contain"
                          : d.preview === "stacked"
                            ? "h-full max-h-11 w-auto object-contain"
                            : "h-10 w-10 object-contain"
                      }
                    />
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-[var(--bb-text)]">
                      {d.label}
                    </div>
                    <div className="text-[0.7rem] uppercase tracking-[0.16em] text-[var(--bb-text-soft)]">
                      SVG · PNG · JPG
                    </div>
                  </div>
                </div>
                <div className="relative shrink-0">
                  <button
                    type="button"
                    aria-label={`${d.label} herunterladen`}
                    aria-expanded={openDownload === d.label}
                    aria-haspopup="menu"
                    data-download-menu-trigger
                    onClick={() =>
                      setOpenDownload(openDownload === d.label ? null : d.label)
                    }
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--bb-border)] text-[var(--bb-text-muted)] transition-colors hover:border-[var(--bb-border-strong)] hover:text-[var(--bb-gold)]"
                  >
                    <Download size={17} />
                  </button>
                  {openDownload === d.label ? (
                    <div
                      role="menu"
                      className="absolute right-0 top-12 z-50 w-32 overflow-hidden rounded-lg border border-[var(--bb-border-strong)] bg-[#120a04] p-1 shadow-2xl shadow-black/70"
                    >
                      {downloadFormats.map(format => (
                        <button
                          key={format}
                          type="button"
                          role="menuitem"
                          data-download-format={format}
                          onClick={() => {
                            setOpenDownload(null);
                            void downloadAsset(d, format);
                          }}
                          className="flex w-full items-center justify-between rounded-md px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--bb-text-muted)] transition-colors hover:bg-[var(--bb-gold)]/12 hover:text-[var(--bb-gold)]"
                          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                          {format}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
