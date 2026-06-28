import BrandLogo from "@/components/BrandLogo";
import ResponsiveImage from "@/components/ResponsiveImage";
import { useLanguage } from "@/contexts/LanguageContext";
import { BRAND_IMAGES, BRAND_MOCKUPS } from "@/lib/brand";
import { Link } from "wouter";
import { ArrowRight, Box, MapPin, Shirt, Truck } from "lucide-react";

const palette: [string, string, string, boolean][] = [
  ["#2A1F1B", "brand_palette_ink_name", "brand_palette_ink_desc", true],
  ["#EFE6D8", "brand_palette_cream_name", "brand_palette_cream_desc", false],
  ["#D3BE9D", "brand_palette_tan_name", "brand_palette_tan_desc", false],
  ["#C9A84C", "brand_palette_gold_name", "brand_palette_gold_desc", false],
];

const assets = [
  {
    icon: Truck,
    titleKey: "brand_asset_truck_title",
    textKey: "brand_asset_truck_text",
    image: BRAND_IMAGES.foodtruckService,
  },
  {
    icon: Box,
    titleKey: "brand_asset_packaging_title",
    textKey: "brand_asset_packaging_text",
    image: BRAND_IMAGES.generatedMenuSystem,
  },
  {
    icon: Shirt,
    titleKey: "brand_asset_team_title",
    textKey: "brand_asset_team_text",
    image: BRAND_IMAGES.uniform,
  },
  {
    icon: MapPin,
    titleKey: "brand_asset_launch_title",
    textKey: "brand_asset_launch_text",
    image: BRAND_IMAGES.stickerRoll,
  },
];

const mockups = [
  {
    titleKey: "brand_mockup_box_title",
    labelKey: "brand_mockup_box_label",
    textKey: "brand_mockup_box_text",
    image: BRAND_MOCKUPS.burgerBox,
  },
  {
    titleKey: "brand_mockup_wrap_title",
    labelKey: "brand_mockup_wrap_label",
    textKey: "brand_mockup_wrap_text",
    image: BRAND_MOCKUPS.baguetteWrap,
  },
  {
    titleKey: "brand_mockup_counter_title",
    labelKey: "brand_mockup_counter_label",
    textKey: "brand_mockup_counter_text",
    image: BRAND_MOCKUPS.counterBag,
  },
  {
    titleKey: "brand_mockup_paper_title",
    labelKey: "brand_mockup_paper_label",
    textKey: "brand_mockup_paper_text",
    image: BRAND_MOCKUPS.paperBag,
  },
  {
    titleKey: "brand_mockup_teamwear_title",
    labelKey: "brand_mockup_teamwear_label",
    textKey: "brand_mockup_teamwear_text",
    image: BRAND_MOCKUPS.uniform,
  },
  {
    titleKey: "brand_mockup_signboard_title",
    labelKey: "brand_mockup_signboard_label",
    textKey: "brand_mockup_signboard_text",
    image: BRAND_MOCKUPS.signboard,
  },
];

export default function BrandSystemSection() {
  const { t } = useLanguage();

  return (
    <section id="brand" className="bb-section bb-section--deep">
      <div className="bb-inner container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-8 border-b border-[var(--bb-border)] pb-12 lg:flex-row lg:items-end">
          <div className="bb-reveal-right max-w-2xl">
            <div className="bb-eyebrow mb-6">{t("brand_eyebrow")}</div>
            <h2 className="lux-head text-4xl sm:text-5xl xl:text-6xl">
              {t("brand_head_pre")}{" "}
              <span className="lux-accent">{t("brand_head_accent")}</span>{" "}
              {t("brand_head_post")}
            </h2>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-5 lg:items-end">
            <BrandLogo
              variant="horizontal"
              className="h-12 w-auto max-w-[280px]"
            />
            <Link
              href="/brand"
              className="bb-button bb-button-ghost min-h-12 px-5"
            >
              {t("brand_full_cta")}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Palette — minimalist swatch band */}
        <div className="mt-12">
          <div className="mb-5 flex items-center justify-between">
            <span className="bb-number">{t("brand_palette_label")}</span>
            <span className="text-xs text-[var(--bb-text-soft)]">
              {t("brand_palette_note")}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--bb-border)] bg-[var(--bb-border)] lg:grid-cols-4">
            {palette.map(([color, nameKey, descKey, dark]) => {
              const ink = dark ? "#F4F1EA" : "#241A14";
              return (
                <div
                  key={nameKey}
                  className="group relative flex min-h-40 flex-col justify-between p-5 sm:min-h-52 sm:p-6 lg:min-h-60"
                  style={{ backgroundColor: color }}
                >
                  <code
                    className="text-[0.7rem] tracking-[0.18em] transition-opacity duration-300"
                    style={{ color: ink }}
                  >
                    {color}
                  </code>
                  <div>
                    <div
                      className="font-semibold"
                      style={{
                        color: ink,
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: "1.35rem",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {t(nameKey)}
                    </div>
                    <div className="mt-1 text-xs" style={{ color: ink }}>
                      {t(descKey)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Asymmetric mosaic */}
        <div className="mt-6 grid gap-3 lg:grid-cols-12">
          <figure className="bb-image-tile relative min-h-[360px] overflow-hidden rounded-2xl border border-[var(--bb-border)] lg:col-span-6 lg:row-span-2 lg:min-h-[560px]">
            <ResponsiveImage
              src={BRAND_IMAGES.brandSystem}
              sizes="(max-width: 1024px) calc(100vw - 3rem), 48vw"
              alt="Burger & Baguette brand system flatlay"
              loading="lazy"
              decoding="async"
            />
            <figcaption className="absolute bottom-6 left-6 right-6 z-10 flex items-center justify-between gap-3 rounded-xl border border-[var(--bb-border)] bg-[var(--bb-surface-strong)]/85 px-5 py-4 backdrop-blur-md">
              <div>
                <div className="bb-number">{t("brand_rollout_label")}</div>
                <div className="mt-1 text-sm text-[var(--bb-text-muted)]">
                  {t("brand_rollout_text")}
                </div>
              </div>
            </figcaption>
          </figure>

          {assets.map(asset => {
            const Icon = asset.icon;
            return (
              <figure
                key={asset.titleKey}
                className="bb-image-tile group relative min-h-[260px] overflow-hidden rounded-2xl border border-[var(--bb-border)] lg:col-span-3 lg:min-h-[272px]"
              >
                <ResponsiveImage
                  src={asset.image}
                  sizes="(max-width: 640px) calc(100vw - 3rem), (max-width: 1024px) 48vw, 24vw"
                  alt={`Burger & Baguette ${t(asset.titleKey)}`}
                  className="transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <figcaption className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[var(--bb-ink-deep)] via-[var(--bb-ink-deep)]/70 to-transparent p-5">
                  <Icon className="mb-2 text-[var(--bb-gold)]" size={20} />
                  <div className="lux-head text-lg text-[var(--bb-cream)]">
                    {t(asset.titleKey)}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--bb-cream)]/70">
                    {t(asset.textKey)}
                  </p>
                </figcaption>
              </figure>
            );
          })}
        </div>

        <div className="mt-16 border-t border-[var(--bb-border)] pt-12">
          <div className="mb-8 grid gap-5 lg:grid-cols-[minmax(0,0.72fr)_minmax(20rem,0.38fr)] lg:items-end">
            <div>
              <div className="bb-eyebrow bb-kicker-left mb-5">
                {t("brand_mockups_eyebrow")}
              </div>
              <h3 className="lux-head text-3xl sm:text-4xl xl:text-5xl">
                {t("brand_mockups_head_pre")}{" "}
                <span className="lux-accent">
                  {t("brand_mockups_head_accent")}
                </span>
                {t("brand_mockups_head_post")}
              </h3>
            </div>
            <p className="bb-copy text-sm lg:text-right">
              {t("brand_mockups_copy")}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {mockups.map(mockup => (
              <figure
                key={mockup.titleKey}
                className="group overflow-hidden rounded-lg border border-[var(--bb-border)] bg-[var(--bb-surface)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--bb-border-strong)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[var(--bb-surface-strong)]">
                  <ResponsiveImage
                    src={mockup.image}
                    sizes="(max-width: 640px) calc(100vw - 3rem), (max-width: 1280px) 48vw, 31vw"
                    alt={`Burger & Baguette ${t(mockup.titleKey)} mockup`}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <figcaption className="grid gap-3 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="bb-number">{t(mockup.labelKey)}</div>
                      <h4 className="lux-head mt-2 text-xl">
                        {t(mockup.titleKey)}
                      </h4>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-[var(--bb-text-muted)]">
                    {t(mockup.textKey)}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
