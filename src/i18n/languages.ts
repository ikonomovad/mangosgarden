import { en } from "./en";
import { mk } from "./mk";

export const languages = [
  { id: "en", label: "EN", locale: "en-GB", messages: en },
  { id: "mk", label: "МК", locale: "mk-MK", messages: mk },
] as const;
export type Language = typeof languages[number]["id"];
export type TranslationKey = keyof typeof en;
export type Localized<T> = Partial<Record<Language, T>> & { en: T };
export const LANGUAGE_KEY = "mangos-garden:language";
export function languageConfig(language: Language) {
  return languages.find((item) => item.id === language) ?? languages[0];
}
export function t(key: TranslationKey, params: Record<string, string | number> = {}, language: Language = "en"): string {
  const config = languageConfig(language);
  const message = config.messages[key] ?? en[key];
  return message.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = params[name];
    return value === undefined ? match : typeof value === "number" ? new Intl.NumberFormat(config.locale).format(value) : value;
  });
}
export function localized<T>(values: Localized<T>, language: Language): T {
  return values[language] ?? values.en;
}
export function initialLanguage(deviceLanguage: string, saved: string | null): Language {
  return languages.find((item) => item.id === saved)?.id ?? languages.find((item) => item.id === deviceLanguage.toLowerCase().split("-")[0])?.id ?? "en";
}