import { useLanguage } from "@/contexts/LanguageContext";
import BrandLogo from "@/components/BrandLogo";

const footerLinks = [
  { labelKey: "nav_concept", href: "/#concept" },
  { labelKey: "nav_brand", href: "/brand" },
  { labelKey: "nav_menu", href: "/#menu" },
  { labelKey: "nav_workflow", href: "/#workflow" },
  { labelKey: "nav_businessplan", href: "/#businessplan" },
];

const footerHighlights = ["footer_highlight_mobile", "footer_highlight_truck", "footer_highlight_event"];

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="lux-footer">
      <BrandLogo variant="badge" className="lux-footer__mark" alt="" />
      <div className="bb-inner container mx-auto px-6">
        <div className="lux-footer__main">
          <div className="lux-footer__brand">
            <BrandLogo variant="horizontal" className="h-10 w-auto max-w-[250px]" />
            <p className="lux-footer__tagline">{t("footer_tagline")}</p>
            <p className="lux-footer__copy">
              {t("footer_copy")}
            </p>
            <div className="lux-footer__badges">
              {footerHighlights.map((itemKey) => (
                <span key={itemKey}>{t(itemKey)}</span>
              ))}
            </div>
          </div>

          <nav className="lux-footer__nav" aria-label="Footer">
            <span className="lux-footer__nav-title">{t("footer_nav_title")}</span>
            {footerLinks.map((link) => (
              <a key={link.href} href={link.href} className="lux-footer__link">
                {t(link.labelKey)}
              </a>
            ))}
            <a href="/brand" className="lux-footer__link">Brand Guidelines</a>
          </nav>
        </div>

        <div className="lux-footer__bottom" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <span>© {new Date().getFullYear()} Burger &amp; Baguette. {t("footer_rights")}.</span>
          <span>{t("footer_meta")}</span>
        </div>
      </div>
    </footer>
  );
}
