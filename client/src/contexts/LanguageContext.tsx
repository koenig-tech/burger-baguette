import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import deTranslations from "@/i18n/de";
import type { TranslationMap } from "@/i18n/types";

export type Language = "de" | "en" | "fr" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

type LoadedTranslations = Partial<Record<Language, TranslationMap>> & {
  de: TranslationMap;
};

const translationLoaders: Record<
  Exclude<Language, "de">,
  () => Promise<TranslationMap>
> = {
  en: () => import("@/i18n/en").then((module) => module.default),
  fr: () => import("@/i18n/fr").then((module) => module.default),
  ar: () => import("@/i18n/ar").then((module) => module.default),
};

const defaultTranslations: TranslationMap = deTranslations;

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function ensureStylesheet(id: string, href: string) {
  if (typeof document === "undefined") return;
  if (document.getElementById(id)) return;

  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setCurrentLanguage] = useState<Language>("de");
  const [translations, setTranslations] = useState<LoadedTranslations>({
    de: defaultTranslations,
  });

  const setLanguage = useCallback(
    (nextLanguage: Language) => {
      if (nextLanguage === "ar") {
        ensureStylesheet("bb-arabic-fonts", "/fonts/arabic-fonts.css");
      }

      if (nextLanguage === "de") {
        setCurrentLanguage("de");
        return;
      }

      if (translations[nextLanguage]) {
        setCurrentLanguage(nextLanguage);
        return;
      }

      void translationLoaders[nextLanguage]().then((loadedTranslations) => {
        setTranslations((currentTranslations) => ({
          ...currentTranslations,
          [nextLanguage]: loadedTranslations,
        }));
        setCurrentLanguage(nextLanguage);
      });
    },
    [translations]
  );

  const activeTranslations = translations[language] ?? defaultTranslations;

  const t = useCallback(
    (key: string): string => {
      return activeTranslations[key] || defaultTranslations[key] || key;
    },
    [activeTranslations]
  );

  const dir: "ltr" | "rtl" = language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [dir, language]);

  const value = useMemo(
    () => ({ language, setLanguage, t, dir }),
    [dir, language, setLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      <div dir={dir} lang={language}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
