import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight } from "lucide-react";

const heroStats = [
  ["65K€", "hero_stat_budget"],
  ["4–5", "hero_stat_launch"],
  ["2.5K€", "hero_stat_goal"],
];

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section id="home" className="lux-hero scroll-hero-section">
      <div className="lux-hero__bg lux-hero__bg-media" aria-hidden="true" />
      <div className="lux-hero__scrim" />
      <div className="lux-hero__glow" />
      <div className="lux-hero__grain" />
      <div className="lux-hero__vignette" />

      <div className="lux-hero__inner container mx-auto px-6">
        <div className="max-w-3xl">
          <span className="lux-hero__eyebrow">{t("hero_eyebrow")}</span>

          <h1 className="lux-hero__title">
            Burger <span className="amp">&amp;</span> Baguette
          </h1>

          <p className="lux-hero__tagline">{t("hero_tagline")}</p>
          <p className="lux-hero__subtitle">
            {t("hero_subtitle")}
          </p>

          <div className="lux-hero__actions">
            <a
              href="#menu"
              className="bb-button bb-button-primary px-7"
            >
              {t("hero_cta")}
              <ArrowRight size={17} />
            </a>
            <a
              href="#businessplan"
              className="bb-button bb-button-ghost px-7"
            >
              {t("hero_bp_cta")}
            </a>
          </div>

          <div className="lux-hero__stats">
            {heroStats.map(([value, labelKey]) => (
              <div key={labelKey} className="lux-hero__stat">
                <strong>{value}</strong>
                <span>{t(labelKey)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lux-hero__scroll" aria-hidden="true">
        {t("hero_scroll")}
        <span className="lux-hero__scroll-line" />
      </div>
    </section>
  );
}
