import { describe, expect, it } from "vitest";
import { BIRDS, BIRD_TEXT } from "@/data/birds";
import { FOODS, FOOD_TEXT } from "@/data/foods";
import { GREETINGS, LEARNED_LINE, MANGO_LINES, MANGO_TEXT, MILESTONE_LINES, VISIT_LINES } from "@/data/mango-lines";
import { en } from "./en";
import { mk } from "./mk";
import { initialLanguage, languages, localized } from "./languages";

describe("translation coverage", () => {
  it("English and Macedonian have exactly matching keys", () => {
    expect(Object.keys(mk).sort()).toEqual(Object.keys(en).sort());
    for (const language of languages) expect(Object.keys(language.messages).sort()).toEqual(Object.keys(en).sort());
  });
  for (const language of languages) {
    it(`every bird has a name and fact in ${language.id}`, () => {
      for (const bird of BIRDS) {
        expect(BIRD_TEXT[bird.id]?.[language.id]?.name).toEqual(expect.stringMatching(/\S/));
        expect(BIRD_TEXT[bird.id]?.[language.id]?.fact).toEqual(expect.stringMatching(/\S/));
      }
    });
    it(`every food has a name in ${language.id}`, () => {
      for (const food of FOODS) expect(FOOD_TEXT[food.id][language.id]).toEqual(expect.stringMatching(/\S/));
    });
    it(`every Mango greeting, mood, reaction, milestone and learned line has ${language.id}`, () => {
      const lines = [...GREETINGS, ...Object.values(MANGO_LINES).flat(), ...Object.values(VISIT_LINES).flat(), ...Object.values(MILESTONE_LINES), LEARNED_LINE];
      for (const line of lines) expect(MANGO_TEXT[line]?.[language.id]).toEqual(expect.stringMatching(/\S/));
    });
  }
  it("defaults to Macedonian for Macedonian devices", () => { expect(initialLanguage("mk-MK", null)).toBe("mk"); });
  it("defaults to English for other devices", () => { expect(initialLanguage("fr-FR", null)).toBe("en"); });
  it("a saved choice overrides the device", () => { expect(initialLanguage("mk-MK", "en")).toBe("en"); });
  it("missing data translations fall back to English", () => { expect(localized({ en: "fallback" }, "mk")).toBe("fallback"); });
});