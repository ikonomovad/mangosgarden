import { BIRDS } from "@/data/birds";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { LANGUAGE_KEY, initialLanguage, languageConfig, languages, localized, t, type Language, type Localized, type TranslationKey } from "./languages";

function valueFor(language: Language, setLanguage: (language: Language) => void) {
  const locale = languageConfig(language).locale;
  return {
    language, locale, setLanguage,
    t: (key: TranslationKey, params?: Record<string, string | number>) => t(key, params, language),
    number: (value: number, options?: Intl.NumberFormatOptions) => new Intl.NumberFormat(locale, options).format(value),
    text: <T,>(values: Localized<T>) => localized(values, language),
    date: (key: string) => { const [y = 0, m = 1, d = 1] = key.split("-").map(Number); return new Intl.DateTimeFormat(locale, { day: "numeric", month: "numeric", year: "numeric" }).format(new Date(y, m - 1, d)); },
  };
}
const LanguageContext = createContext(valueFor("en", () => {}));
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, update] = useState<Language>("en");
  useEffect(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem(LANGUAGE_KEY); } catch { /* Storage may be blocked. */ }
    update(initialLanguage(navigator.language, saved));
  }, []);
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  const setLanguage = (next: Language) => {
    if (!languages.some((item) => item.id === next)) return;
    update(next);
    try { localStorage.setItem(LANGUAGE_KEY, next); } catch { /* Keep the in-memory choice. */ }
  };
  return <LanguageContext.Provider value={valueFor(language, setLanguage)}>{children}</LanguageContext.Provider>;
}
export const useLanguage = () => useContext(LanguageContext);

/** Keep the current page's metadata in step with a browser-only language choice. */
export function usePageMetadata(page: "index" | "book") {
  const { language, t } = useLanguage();
  useEffect(() => {
    document.title = t(page === "index" ? "indexTitle" : "bookTitle");
    const values = {
      description: t(page === "index" ? "indexDescription" : "bookDescription", { total: BIRDS.length }),
      "og:title": t(page === "index" ? "appName" : "bookOgTitle"),
      "og:description": t(page === "index" ? "indexOgDescription" : "bookOgDescription", { total: BIRDS.length }),
    };
    for (const [key, value] of Object.entries(values)) {
      document.querySelectorAll(`meta[name="${key}"], meta[property="${key}"]`).forEach((tag) => tag.setAttribute("content", value));
    }
  }, [language, page]);
}