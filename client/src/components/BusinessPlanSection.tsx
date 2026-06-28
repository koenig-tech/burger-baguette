import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight, BarChart3, Euro, Package, Sandwich, CheckCircle2 } from "lucide-react";

const kpis = [
  ["65K€", "business_kpi_invest_label", "business_kpi_invest_text"],
  ["38.5%", "business_kpi_margin_label", "business_kpi_margin_text"],
  ["4–5", "business_kpi_pilot_label", "business_kpi_pilot_text"],
];

const invest = [
  ["business_invest_trailer", "22.5K€"],
  ["business_invest_equipment", "22K€"],
  ["business_invest_brand", "8K€"],
  ["business_invest_license", "12.5K€"],
];

const finance = [
  ["business_finance_revenue", "60K€", "80%"],
  ["business_finance_cogs", "20K€", "32%"],
  ["business_finance_staff", "9K€", "24%"],
  ["business_finance_reserve", "5K€", "18%"],
];

const products = [
  [Package, "business_product_burger_label", "business_product_burger_value"],
  [Sandwich, "business_product_baguette_label", "business_product_baguette_value"],
  [CheckCircle2, "business_product_extras_label", "business_product_extras_value"],
] as const;

const roadmap = [
  ["business_road_setup_title", "business_road_setup_text"],
  ["business_road_test_title", "business_road_test_text"],
  ["business_road_pilot_title", "business_road_pilot_text"],
  ["business_road_scale_title", "business_road_scale_text"],
];

export default function BusinessPlanSection() {
  const { t } = useLanguage();

  return (
    <section id="businessplan" className="bb-section bb-section--deep">
      <div className="bb-inner container mx-auto px-6">
        {/* Header */}
        <div className="mb-12 max-w-3xl">
          <div className="bb-eyebrow mb-6">{t("business_eyebrow")}</div>
          <h2 className="lux-head text-4xl sm:text-5xl xl:text-6xl">
            {t("business_head_pre")} <span className="lux-accent">{t("business_head_accent")}</span>
          </h2>
          <p className="bb-copy mt-5">
            {t("business_copy")}
          </p>
        </div>

        {/* KPI row */}
        <div className="grid overflow-hidden rounded-2xl border border-[var(--bb-border)] md:grid-cols-3 md:gap-px md:bg-[var(--bb-border)]">
          {kpis.map(([value, labelKey, textKey]) => (
            <div key={labelKey} className="bg-[var(--bb-ink-soft)] p-8 md:p-9">
              <div className="text-5xl font-bold tracking-tight text-[var(--bb-gold)] sm:text-6xl">{value}</div>
              <div className="lux-head mt-3 text-lg">{t(labelKey)}</div>
              <p className="mt-2 text-sm leading-relaxed text-[var(--bb-text-muted)]">{t(textKey)}</p>
            </div>
          ))}
        </div>

        {/* Tables */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-[var(--bb-border)] bg-[var(--bb-surface)] p-8">
            <div className="business-card-head mb-6 flex items-center gap-3">
              <Euro className="text-[var(--bb-gold)]" size={22} />
              <h3 className="lux-head text-2xl">{t("business_invest_title")}</h3>
            </div>
            <div className="grid gap-4">
              {invest.map(([labelKey, value]) => (
                <div key={labelKey} className="flex items-center justify-between border-b border-[var(--bb-border)] pb-3 last:border-b-0 last:pb-0">
                  <span className="text-sm text-[var(--bb-text-muted)]">{t(labelKey)}</span>
                  <strong className="lux-head text-base">{value}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--bb-border)] bg-[var(--bb-surface)] p-8">
            <div className="business-card-head mb-6 flex items-center gap-3">
              <BarChart3 className="text-[var(--bb-gold)]" size={22} />
              <h3 className="lux-head text-2xl">{t("business_finance_title")}</h3>
            </div>
            <div className="grid gap-4">
              {finance.map(([labelKey, value, width]) => (
                <div key={labelKey}>
                  <div className="business-finance-row mb-2 flex items-center justify-between gap-4 text-sm">
                    <span className="text-[var(--bb-text-muted)]">{t(labelKey)}</span>
                    <strong className="text-[var(--bb-text)]">{value}</strong>
                  </div>
                  <div className="business-meter h-1.5 overflow-hidden rounded-full bg-[var(--bb-surface-soft)]">
                    <div className="business-meter-fill h-full rounded-full bg-[var(--bb-gold)]" style={{ width }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product structure */}
        <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-[var(--bb-border)] bg-[var(--bb-border)] sm:grid-cols-3">
          {products.map(([Icon, labelKey, valueKey]) => (
            <div key={labelKey} className="flex items-center gap-4 bg-[var(--bb-ink-soft)] p-6">
              <div className="bb-icon-box shrink-0">
                <Icon size={20} />
              </div>
              <div>
                <div className="lux-head text-base">{t(labelKey)}</div>
                <div className="mt-0.5 text-xs text-[var(--bb-text-muted)]">{t(valueKey)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Roadmap stepper */}
        <div className="mt-14">
          <div className="bb-number mb-7">{t("business_roadmap_label")}</div>
          <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="absolute left-0 right-0 top-3 hidden h-px bg-gradient-to-r from-transparent via-[var(--bb-border-strong)] to-transparent lg:block" />
            {roadmap.map(([titleKey, textKey], index) => (
              <div key={titleKey} className="relative">
                <span className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--bb-gold)] bg-[var(--bb-ink-deep)] text-[0.7rem] font-bold text-[var(--bb-gold)]">
                  {index + 1}
                </span>
                <h3 className="lux-head mt-5 text-xl">{t(titleKey)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--bb-text-muted)]">{t(textKey)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Closing band */}
        <div className="mt-12 grid gap-6 rounded-2xl border border-[var(--bb-border-strong)] bg-[var(--bb-surface)] p-8 md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div>
            <h3 className="lux-head text-3xl">
              {t("business_closing_head_pre")} <span className="lux-accent">{t("business_closing_head_accent")}</span>
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--bb-text-muted)]">
              {t("business_closing_copy")}
            </p>
          </div>
          <button
            type="button"
            className="bb-button bb-button-primary min-h-13 px-7"
            onClick={() => document.getElementById("launch")?.scrollIntoView({ behavior: "smooth" })}
          >
            {t("business_launch_cta")}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
