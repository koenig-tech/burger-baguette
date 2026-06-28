import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { BRAND_IMAGES } from "@/lib/brand";
import { Sandwich, Wheat, Package } from "lucide-react";
import ResponsiveImage from "./ResponsiveImage";

type MenuTab = "burgers" | "baguettes" | "extras";

const menuImages: Record<MenuTab, string> = {
  burgers: BRAND_IMAGES.burgerBox,
  baguettes: BRAND_IMAGES.baguetteWrap,
  extras: BRAND_IMAGES.friesDrinks,
};

const menuTagKeys = [
  "menu_tag_burger",
  "menu_tag_baguettes",
  "menu_tag_extras",
];

const valueStrip = [
  ["menu_value_heat_title", "menu_value_heat_text"],
  ["menu_value_upgrade_title", "menu_value_upgrade_text"],
  ["menu_value_price_title", "menu_value_price_text"],
];

export default function MenuSection() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<MenuTab>("burgers");

  const burgers = [
    {
      nameKey: "burger_classic",
      descKey: "burger_classic_desc",
      price: "8,90 €",
    },
    {
      nameKey: "burger_cheese",
      descKey: "burger_cheese_desc",
      price: "9,90 €",
    },
    { nameKey: "burger_bacon", descKey: "burger_bacon_desc", price: "10,90 €" },
    { nameKey: "burger_onion", descKey: "burger_onion_desc", price: "9,90 €" },
  ];
  const baguettes = [
    { nameKey: "bag_hack", descKey: "bag_hack_desc", price: "9,90 €" },
    { nameKey: "bag_merguez", descKey: "bag_merguez_desc", price: "12,50 €" },
    { nameKey: "bag_philly", descKey: "bag_philly_desc", price: "13,90 €" },
    { nameKey: "bag_veggi", descKey: "bag_veggi_desc", price: "9,90 €" },
  ];
  const extras = [
    { nameKey: "menu_fries", descKey: "menu_fries_desc", price: "4,50 €" },
    { nameKey: "menu_sauce", descKey: "menu_sauce_desc", price: "1,50 €" },
    { nameKey: "menu_cola", descKey: "menu_drinks", price: "2,50 €" },
    { nameKey: "menu_water", descKey: "menu_drinks", price: "2,00 €" },
  ];

  const items =
    activeTab === "burgers"
      ? burgers
      : activeTab === "baguettes"
        ? baguettes
        : extras;

  const tabs: { id: MenuTab; labelKey: string; icon: typeof Sandwich }[] = [
    { id: "burgers", labelKey: "menu_burgers", icon: Sandwich },
    { id: "baguettes", labelKey: "menu_baguettes", icon: Wheat },
    { id: "extras", labelKey: "menu_extras", icon: Package },
  ];

  return (
    <section id="menu" className="bb-section bb-section--deep">
      <div className="bb-inner container mx-auto px-6">
        {/* Header */}
        <div className="mb-12 max-w-3xl">
          <div className="bb-eyebrow mb-6">{t("menu_title")}</div>
          <h2 className="lux-head text-4xl sm:text-5xl xl:text-6xl">
            {t("menu_head_pre")}{" "}
            <span className="lux-accent">{t("menu_head_accent")}</span>
          </h2>
          <p className="bb-copy mt-5">{t("menu_intro")}</p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
          {/* Featured image */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <figure className="bb-image-tile min-h-[360px] overflow-hidden rounded-2xl border border-[var(--bb-border)] md:min-h-[460px] lg:min-h-[560px]">
              <ResponsiveImage
                src={menuImages[activeTab]}
                sizes="(max-width: 1024px) calc(100vw - 3rem), 42vw"
                alt="Burger & Baguette menu product"
                loading="lazy"
                decoding="async"
              />
              <figcaption className="absolute bottom-6 left-6 right-6 z-10 flex flex-wrap gap-2">
                {menuTagKeys.map(tagKey => (
                  <span key={tagKey} className="bb-tag">
                    {t(tagKey)}
                  </span>
                ))}
              </figcaption>
            </figure>
          </div>

          {/* Menu card */}
          <div className="min-w-0">
            {/* Tabs as underlined text */}
            <div className="menu-tabs-scroll flex w-full min-w-0 snap-x snap-mandatory gap-x-8 overflow-x-auto border-b border-[var(--bb-border)] pb-4">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group relative flex shrink-0 snap-start items-center gap-2 whitespace-nowrap pb-3 text-sm font-bold uppercase tracking-[0.16em] transition-colors ${
                      active
                        ? "text-[var(--bb-gold)]"
                        : "text-[var(--bb-text-soft)] hover:text-[var(--bb-text)]"
                    }`}
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    <Icon size={15} />
                    {t(tab.labelKey)}
                    <span
                      className={`absolute -bottom-[1.05rem] left-0 right-0 h-px transition-colors ${
                        active ? "bg-[var(--bb-gold)]" : "bg-transparent"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Items with dotted leaders */}
            <div className="mt-7 grid gap-7">
              {items.map(item => (
                <div key={item.nameKey}>
                  <div className="flex items-baseline gap-3">
                    <h3 className="lux-head text-xl">{t(item.nameKey)}</h3>
                    <span className="mb-1 flex-1 border-b border-dotted border-[var(--bb-border-strong)]" />
                    <span className="bb-price whitespace-nowrap text-lg">
                      {item.price}
                    </span>
                  </div>
                  <p className="mt-1.5 max-w-md text-sm leading-relaxed text-[var(--bb-text-muted)]">
                    {t(item.descKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Value strip */}
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-[var(--bb-border)] bg-[var(--bb-border)] sm:grid-cols-3">
          {valueStrip.map(([titleKey, textKey]) => (
            <div key={titleKey} className="bg-[var(--bb-ink-soft)] p-7">
              <h3 className="lux-head text-lg">{t(titleKey)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--bb-text-muted)]">
                {t(textKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
