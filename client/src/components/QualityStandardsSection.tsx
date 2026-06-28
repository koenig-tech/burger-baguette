import { useLanguage } from "@/contexts/LanguageContext";
import { ClipboardCheck, Leaf, PackageCheck, ShieldCheck, Timer, Truck } from "lucide-react";

const standards = [
  { icon: Leaf, titleKey: "standard_ingredients_title", textKey: "standard_ingredients_text" },
  { icon: ClipboardCheck, titleKey: "standard_recipe_title", textKey: "standard_recipe_text" },
  { icon: Timer, titleKey: "standard_speed_title", textKey: "standard_speed_text" },
  { icon: PackageCheck, titleKey: "standard_packaging_title", textKey: "standard_packaging_text" },
  { icon: ShieldCheck, titleKey: "standard_control_title", textKey: "standard_control_text" },
  { icon: Truck, titleKey: "standard_location_title", textKey: "standard_location_text" },
];

export default function QualityStandardsSection() {
  const { t } = useLanguage();

  return (
    <section id="standards" className="bb-section bb-section--soft">
      <div className="bb-inner container mx-auto px-6">
        <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
          {/* Sticky statement */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="bb-eyebrow mb-6">{t("standards_eyebrow")}</div>
            <h2 className="lux-head text-4xl sm:text-5xl">
              {t("standards_head_pre")} <span className="lux-accent">{t("standards_head_accent")}</span>
            </h2>
            <p className="bb-copy mt-6 max-w-md">
              {t("standards_copy")}
            </p>
            <div className="mt-8 rounded-2xl border border-[var(--bb-border-strong)] bg-[var(--bb-surface)] p-7">
              <div className="bb-number mb-3">{t("standards_rule_label")}</div>
              <p className="lux-head text-2xl">
                {t("standards_rule_pre")} <span className="lux-accent">{t("standards_rule_accent")}</span>
              </p>
            </div>
          </div>

          {/* Numbered ledger */}
          <div className="border-t border-[var(--bb-border)]">
            {standards.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.titleKey}
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-6 border-b border-[var(--bb-border)] py-7 transition-all duration-300 hover:px-3"
                >
                  <span
                    className="text-4xl italic text-[var(--bb-gold)]/40 transition-colors duration-300 group-hover:text-[var(--bb-gold)] sm:text-5xl"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    0{index + 1}
                  </span>
                  <div>
                    <h3 className="lux-head text-xl sm:text-2xl">{t(item.titleKey)}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[var(--bb-text-muted)]">{t(item.textKey)}</p>
                  </div>
                  <div className="bb-icon-box shrink-0">
                    <Icon size={20} />
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
