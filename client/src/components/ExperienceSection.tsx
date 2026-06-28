import { useLanguage } from "@/contexts/LanguageContext";
import { BRAND_IMAGES } from "@/lib/brand";
import { Clock3, MessageSquare, PackageCheck, Route } from "lucide-react";

const steps = [
  {
    icon: Route,
    titleKey: "journey_step_visible_title",
    textKey: "journey_step_visible_text",
  },
  {
    icon: MessageSquare,
    titleKey: "journey_step_order_title",
    textKey: "journey_step_order_text",
  },
  {
    icon: Clock3,
    titleKey: "journey_step_wait_title",
    textKey: "journey_step_wait_text",
  },
  {
    icon: PackageCheck,
    titleKey: "journey_step_takeaway_title",
    textKey: "journey_step_takeaway_text",
  },
];

export default function ExperienceSection() {
  const { t } = useLanguage();

  return (
    <section id="journey" className="bb-section bb-section--deep">
      <div className="bb-inner container mx-auto px-6">
        {/* Header */}
        <div className="mb-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="bb-eyebrow mb-6">{t("journey_eyebrow")}</div>
            <h2 className="lux-head text-4xl sm:text-5xl xl:text-6xl">
              {t("journey_head_pre")}{" "}
              <span className="lux-accent">{t("journey_head_accent")}</span>
            </h2>
          </div>
          <p className="bb-copy max-w-md lg:text-right">{t("journey_copy")}</p>
        </div>

        {/* Cinematic band */}
        <figure className="bb-image-tile mb-14 min-h-[280px] overflow-hidden rounded-2xl border border-[var(--bb-border)] md:min-h-[360px]">
          <img
            src={BRAND_IMAGES.stickerRoll}
            alt="Burger & Baguette event queue brand experience"
            loading="lazy"
            decoding="async"
          />
        </figure>

        {/* Horizontal timeline */}
        <div className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-[var(--bb-border-strong)] to-transparent lg:block" />
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.titleKey} className="relative">
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--bb-border-strong)] bg-[var(--bb-ink-deep)] text-[var(--bb-gold)]">
                  <Icon size={22} />
                </div>
                <div className="bb-number mt-6">0{index + 1}</div>
                <h3 className="lux-head mt-2 text-xl">{t(step.titleKey)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--bb-text-muted)]">
                  {t(step.textKey)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
