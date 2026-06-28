import { useLanguage } from "@/contexts/LanguageContext";
import { BRAND_IMAGES } from "@/lib/brand";
import ResponsiveImage from "./ResponsiveImage";
import {
  ClipboardCheck,
  Flame,
  Gauge,
  ShoppingBasket,
  UsersRound,
} from "lucide-react";

const phases = [
  ["workflow_phase_prep_title", "workflow_phase_prep_text"],
  ["workflow_phase_lunch_title", "workflow_phase_lunch_text"],
  ["workflow_phase_event_title", "workflow_phase_event_text"],
  ["workflow_phase_clean_title", "workflow_phase_clean_text"],
];

const lanes = [
  {
    icon: ShoppingBasket,
    titleKey: "workflow_lane_buy_title",
    textKey: "workflow_lane_buy_text",
  },
  {
    icon: ClipboardCheck,
    titleKey: "workflow_lane_mise_title",
    textKey: "workflow_lane_mise_text",
  },
  {
    icon: Flame,
    titleKey: "workflow_lane_production_title",
    textKey: "workflow_lane_production_text",
  },
  {
    icon: Gauge,
    titleKey: "workflow_lane_pace_title",
    textKey: "workflow_lane_pace_text",
  },
  {
    icon: UsersRound,
    titleKey: "workflow_lane_roles_title",
    textKey: "workflow_lane_roles_text",
  },
];

export default function OperationsSection() {
  const { t } = useLanguage();

  return (
    <section id="workflow" className="bb-section bb-section--soft">
      <div className="bb-inner container mx-auto px-6">
        {/* Header */}
        <div className="mb-12 max-w-3xl">
          <div className="bb-eyebrow mb-6">{t("workflow_eyebrow")}</div>
          <h2 className="lux-head text-4xl sm:text-5xl xl:text-6xl">
            {t("workflow_head_pre")}{" "}
            <span className="lux-accent">{t("workflow_head_accent")}</span>
          </h2>
          <p className="bb-copy mt-5">{t("workflow_copy")}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Media */}
          <figure className="bb-image-tile min-h-[340px] overflow-hidden rounded-2xl border border-[var(--bb-border)] md:min-h-[480px]">
            <ResponsiveImage
              src={BRAND_IMAGES.workflow}
              sizes="(max-width: 1024px) calc(100vw - 3rem), 56vw"
              alt="Burger & Baguette kitchen workflow"
              loading="lazy"
              decoding="async"
            />
            <figcaption className="bb-media-pill absolute left-6 top-6 z-10 rounded-full border border-[var(--bb-border)] bg-[var(--bb-surface-strong)] px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.24em] text-[var(--bb-gold)] backdrop-blur-md">
              {t("workflow_media_label")}
            </figcaption>
          </figure>

          {/* Vertical day-flow */}
          <div className="rounded-2xl border border-[var(--bb-border)] bg-[var(--bb-surface)] p-8">
            <div className="bb-number mb-7">{t("workflow_day_label")}</div>
            <div className="workflow-day-flow relative pl-8">
              <div className="workflow-day-line absolute bottom-2 left-[0.32rem] top-2 w-px bg-[var(--bb-border-strong)]" />
              {phases.map(([titleKey, textKey], index) => (
                <div key={titleKey} className="relative pb-7 last:pb-0">
                  <span className="workflow-day-dot absolute -left-8 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[var(--bb-gold)] bg-[var(--bb-ink-deep)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--bb-gold)]" />
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="bb-number">0{index + 1}</span>
                    <h3 className="lux-head text-lg">{t(titleKey)}</h3>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--bb-text-muted)]">
                    {t(textKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lanes ledger */}
        <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-[var(--bb-border)] bg-[var(--bb-border)] sm:grid-cols-2 lg:grid-cols-5">
          {lanes.map(lane => {
            const Icon = lane.icon;
            return (
              <div key={lane.titleKey} className="bg-[var(--bb-ink-soft)] p-6">
                <Icon className="mb-4 text-[var(--bb-gold)]" size={22} />
                <h3 className="lux-head text-lg">{t(lane.titleKey)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--bb-text-muted)]">
                  {t(lane.textKey)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
