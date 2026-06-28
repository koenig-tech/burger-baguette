import { useLanguage } from "@/contexts/LanguageContext";
import { BRAND_IMAGES } from "@/lib/brand";
import ResponsiveImage from "./ResponsiveImage";
import {
  Flame,
  Route,
  PackageCheck,
  Timer,
  ShieldCheck,
  MapPin,
  Sparkles,
} from "lucide-react";

const pillars = [
  {
    icon: Flame,
    titleKey: "concept_pillar_card_title",
    textKey: "concept_pillar_card_text",
  },
  {
    icon: PackageCheck,
    titleKey: "concept_pillar_brand_title",
    textKey: "concept_pillar_brand_text",
  },
  {
    icon: Route,
    titleKey: "concept_pillar_route_title",
    textKey: "concept_pillar_route_text",
  },
];

const notes = [
  {
    icon: Timer,
    labelKey: "concept_note_service_label",
    valueKey: "concept_note_service_text",
  },
  {
    icon: ShieldCheck,
    labelKey: "concept_note_quality_label",
    valueKey: "concept_note_quality_text",
  },
  {
    icon: MapPin,
    labelKey: "concept_note_mobility_label",
    valueKey: "concept_note_mobility_text",
  },
  {
    icon: Sparkles,
    labelKey: "concept_note_brand_label",
    valueKey: "concept_note_brand_text",
  },
];

export default function ConceptSection() {
  const { t } = useLanguage();

  return (
    <section id="concept" className="bb-section bb-section--soft">
      <div className="bb-inner container mx-auto px-6">
        {/* Manifesto */}
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="bb-reveal-right">
            <div className="bb-eyebrow mb-6">{t("concept_title")}</div>
            <h2 className="lux-head max-w-[15ch] text-4xl sm:text-5xl xl:text-[4.25rem] xl:leading-[0.98]">
              {t("concept_subtitle")}
            </h2>
          </div>
          <p className="bb-copy bb-reveal-left max-w-xl border-l border-[var(--bb-border-strong)] pl-6">
            {t("concept_text")}
          </p>
        </div>

        {/* Ledger of pillars */}
        <div className="mt-14 grid overflow-hidden rounded-2xl border border-[var(--bb-border)] md:grid-cols-3 md:gap-px md:bg-[var(--bb-border)]">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.titleKey}
                className="group flex flex-col bg-[var(--bb-ink-soft)] p-8 transition-colors duration-300 hover:bg-[var(--bb-surface-soft)] md:p-10"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-5xl italic text-[var(--bb-gold)]/35 transition-colors duration-300 group-hover:text-[var(--bb-gold)]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    0{index + 1}
                  </span>
                  <Icon className="text-[var(--bb-gold)]" size={24} />
                </div>
                <h3 className="lux-head mt-10 text-2xl">
                  {t(pillar.titleKey)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--bb-text-muted)]">
                  {t(pillar.textKey)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Cinematic band + notes */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.45fr_1fr]">
          <div className="bb-image-tile min-h-[360px] border border-[var(--bb-border)] md:min-h-[460px]">
            <ResponsiveImage
              src={BRAND_IMAGES.location}
              sizes="(max-width: 1024px) calc(100vw - 3rem), 58vw"
              alt="Burger & Baguette business district lunch service"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-x-0 bottom-0 z-[5] h-3/4 bg-gradient-to-t from-[#080502] via-[#080502]/72 to-transparent" />
            <div className="bb-media-pill absolute left-6 top-6 z-10 rounded-full border border-[var(--bb-border)] bg-[var(--bb-surface-strong)] px-4 py-2 text-[0.7rem] font-bold uppercase tracking-[0.24em] text-[var(--bb-gold)] backdrop-blur-md">
              {t("concept_media_label")}
            </div>
            <div className="absolute bottom-7 left-7 right-7 z-10">
              <div className="bb-number mb-3">{t("concept_media_number")}</div>
              <div className="lux-head text-2xl text-[#F4F1EA] sm:text-3xl">
                {t("concept_media_title")}{" "}
                <span className="lux-accent">{t("concept_media_accent")}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-4">
            {notes.map(note => {
              const Icon = note.icon;
              return (
                <div
                  key={note.labelKey}
                  className="group flex items-start gap-5 rounded-xl border border-[var(--bb-border)] bg-[var(--bb-surface)] p-6 transition-all duration-300 hover:border-[var(--bb-border-strong)]"
                >
                  <div className="bb-icon-box shrink-0">
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-[var(--bb-gold)]">
                      {t(note.labelKey)}
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-[var(--bb-text-muted)]">
                      {t(note.valueKey)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
