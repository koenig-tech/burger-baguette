import { useLanguage } from "@/contexts/LanguageContext";
import { BRAND_IMAGES } from "@/lib/brand";
import ResponsiveImage from "./ResponsiveImage";
import {
  ArrowRight,
  CalendarDays,
  Check,
  MapPinned,
  Target,
  TrendingUp,
} from "lucide-react";

const checklist = [
  {
    icon: Target,
    titleKey: "launch_check_locations_title",
    textKey: "launch_check_locations_text",
  },
  {
    icon: MapPinned,
    titleKey: "launch_check_route_title",
    textKey: "launch_check_route_text",
  },
  {
    icon: TrendingUp,
    titleKey: "launch_check_metrics_title",
    textKey: "launch_check_metrics_text",
  },
  {
    icon: CalendarDays,
    titleKey: "launch_check_scale_title",
    textKey: "launch_check_scale_text",
  },
];

export default function LaunchSection() {
  const { t } = useLanguage();

  return (
    <section id="launch" className="bb-section bb-section--soft">
      <div className="bb-inner container mx-auto px-6">
        {/* Closing panel */}
        <div className="lux-launch relative overflow-hidden rounded-3xl border border-[var(--bb-border-strong)]">
          <ResponsiveImage
            src={BRAND_IMAGES.stickerRoll}
            sizes="calc(100vw - 3rem)"
            alt="Burger & Baguette launch event queue"
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
          <div className="lux-launch__scrim absolute inset-0" />
          <div className="relative z-10 mx-auto max-w-3xl px-6 py-20 text-center sm:py-28">
            <div className="bb-eyebrow mb-6 justify-center">
              {t("launch_eyebrow")}
            </div>
            <h2 className="lux-head text-4xl text-[var(--bb-cream)] sm:text-5xl xl:text-6xl">
              {t("launch_head_pre")}{" "}
              <span className="lux-accent">{t("launch_head_accent")}</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[var(--bb-cream)]/75">
              {t("launch_copy")}
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                className="bb-button bb-button-primary px-7"
                onClick={() =>
                  document
                    .getElementById("businessplan")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                {t("launch_business_cta")}
                <ArrowRight size={16} />
              </button>
              <button
                type="button"
                className="bb-button bb-button-ghost px-7"
                onClick={() =>
                  document
                    .getElementById("menu")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                {t("launch_menu_cta")}
              </button>
            </div>
          </div>
        </div>

        {/* Checklist */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {checklist.map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.titleKey}
                className="group rounded-2xl border border-[var(--bb-border)] bg-[var(--bb-surface)] p-6 transition-all duration-300 hover:border-[var(--bb-border-strong)]"
              >
                <div className="mb-5 flex items-center justify-between">
                  <Icon className="text-[var(--bb-gold)]" size={22} />
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--bb-gold)]/40 text-[var(--bb-gold)]">
                    <Check size={13} />
                  </span>
                </div>
                <h3 className="lux-head text-lg">{t(item.titleKey)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--bb-text-muted)]">
                  {t(item.textKey)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
