import { useState, useEffect } from "react";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import BrandLogo from "@/components/BrandLogo";
import { Check, ChevronDown, Menu, X, Sun, Moon } from "lucide-react";

const LANGUAGES: { code: Language; label: string }[] = [
  { code: "de", label: "DE" },
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "ar", label: "عر" },
];

const NAV_LINKS = [
  { key: "nav_home", href: "#home", kind: "section" },
  { key: "nav_concept", href: "#concept", kind: "section" },
  { key: "nav_brand", href: "/brand", kind: "route" },
  { key: "nav_menu", href: "#menu", kind: "section" },
  { key: "nav_journey", href: "#journey", kind: "section" },
  { key: "nav_workflow", href: "#workflow", kind: "section" },
  { key: "nav_businessplan", href: "#businessplan", kind: "section" },
];

export default function Navbar() {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState("#home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

  useEffect(() => {
    const sectionIds = NAV_LINKS.filter(link => link.kind === "section").map(
      link => link.href.slice(1)
    );
    let frame = 0;

    const updateNavigationState = () => {
      frame = 0;
      setScrolled(window.scrollY > 50);

      if (window.scrollY < 80) {
        setActiveHref("#home");
        return;
      }

      const marker = Math.min(window.innerHeight * 0.34, 320);
      let nextHref = "#home";

      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (!section) continue;

        const rect = section.getBoundingClientRect();
        if (rect.top <= marker && rect.bottom > 96) {
          nextHref = `#${id}`;
        }
      }

      setActiveHref(nextHref);
    };

    const onScrollOrResize = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateNavigationState);
    };

    updateNavigationState();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const activeLanguage =
    LANGUAGES.find(lang => lang.code === language) ?? LANGUAGES[0];

  const isLinkActive = (link: (typeof NAV_LINKS)[number]) =>
    link.kind === "route"
      ? typeof window !== "undefined" && window.location.pathname === link.href
      : activeHref === link.href;

  return (
    <>
      <nav
        className={`site-navbar fixed top-0 left-0 right-0 z-50 ${
          scrolled ? "site-navbar--scrolled" : ""
        }`}
        style={{
          WebkitBackdropFilter: "blur(12px) saturate(1.18)",
          backdropFilter: "blur(12px) saturate(1.18)",
        }}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between gap-3 md:h-20">
            <a
              href="#home"
              className="site-logo group flex min-w-0 items-center gap-3"
            >
              <BrandLogo
                variant="horizontal"
                tone={scrolled ? "auto" : "dark"}
                className="h-9 max-h-9 w-auto max-w-[180px] sm:max-w-[220px]"
                fetchPriority="high"
              />
            </a>

            {/* Desktop Nav Links */}
            <div className="site-nav-pill hidden items-center gap-0.5 rounded-full p-1 backdrop-blur-md xl:flex">
              {NAV_LINKS.map(link => {
                const isActive = isLinkActive(link);
                return (
                  <a
                    key={link.key}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`site-nav-link relative rounded-full px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] ${
                      isActive ? "site-nav-link--active" : ""
                    }`}
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {t(link.key)}
                  </a>
                );
              })}
            </div>

            {/* Controls */}
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              {/* Language Switcher */}
              <div className="relative">
                <button
                  type="button"
                  aria-label={`Sprache wechseln, aktuell ${activeLanguage.label}`}
                  aria-expanded={languageOpen}
                  onClick={() => setLanguageOpen(open => !open)}
                  className="site-nav-control flex h-9 min-w-[72px] items-center justify-between gap-2 rounded-full px-3 text-sm font-bold"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <span>{activeLanguage.label}</span>
                  <ChevronDown
                    size={15}
                    className={`transition-transform duration-200 ${languageOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {languageOpen && (
                  <div className="site-nav-menu absolute right-0 top-12 z-50 w-32 overflow-hidden rounded-lg p-1">
                    {LANGUAGES.map(lang => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setLanguage(lang.code);
                          setLanguageOpen(false);
                        }}
                        className={`site-nav-menu__item flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                          language === lang.code ? "site-nav-menu__item--active" : ""
                        }`}
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        <span>{lang.label}</span>
                        {language === lang.code && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Theme toggle */}
              {toggleTheme && (
                <button
                  type="button"
                  aria-label={theme === "dark" ? "Helles Design aktivieren" : "Dunkles Design aktivieren"}
                  title={theme === "dark" ? "Light Mode" : "Dark Mode"}
                  onClick={toggleTheme}
                  className="site-nav-control flex h-9 w-9 items-center justify-center rounded-full"
                >
                  {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                </button>
              )}

              {/* Mobile Toggle */}
              <button
                type="button"
                aria-label={mobileOpen ? "Menu schliessen" : "Menu oeffnen"}
                className="site-nav-control flex h-9 w-9 items-center justify-center rounded-full xl:hidden"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Animated mobile menu overlay */}
      <div
        className={`lux-mobile xl:hidden ${mobileOpen ? "is-open" : ""}`}
        aria-hidden={!mobileOpen}
      >
        <div className="container mx-auto flex h-full flex-col px-5">
          <div className="lux-mobile__head">
            <BrandLogo variant="horizontal" className="h-9 w-auto max-w-[180px]" />
            <button
              type="button"
              aria-label="Menu schliessen"
              className="lux-mobile__close"
              onClick={() => setMobileOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <nav className="lux-mobile__links" aria-label="Mobile">
            {NAV_LINKS.map((link, index) => {
              const isActive = isLinkActive(link);
              return (
                <a
                  key={link.key}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setMobileOpen(false)}
                  className={`lux-mobile__link ${isActive ? "lux-mobile__link--active" : ""}`}
                >
                  <span className="lux-mobile__idx">0{index + 1}</span>
                  {t(link.key)}
                </a>
              );
            })}
          </nav>

          <div className="lux-mobile__foot">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang.code)}
                className={`lux-mobile__lang ${language === lang.code ? "lux-mobile__lang--active" : ""}`}
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
