import { t, type Language } from "@/i18n/languages";

export function birdSearchUrl(name: string, language: Language): string {
  return `https://www.google.com/search?q=${encodeURIComponent(t("birdSearchQuery", { name }, language))}`;
}

export function birdChatUrl(name: string, language: Language): string {
  return `https://chatgpt.com/?q=${encodeURIComponent(t("birdChatPrompt", { name }, language))}`;
}