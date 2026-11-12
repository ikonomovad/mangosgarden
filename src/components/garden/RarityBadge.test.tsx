import { afterEach, describe, expect, it } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { RarityBadge } from "./RarityBadge";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { LANGUAGE_KEY } from "@/i18n/languages";
import { en } from "@/i18n/en";
import { mk } from "@/i18n/mk";

afterEach(() => { cleanup(); localStorage.clear(); });

const cases = [["common", "rarityCommon"], ["uncommon", "rarityUncommon"], ["rare", "rarityRare"]] as const;

describe("RarityBadge", () => {
  for (const [rarity, key] of cases) {
    it(`renders the ${rarity} gem as a button labelled in English and Macedonian`, async () => {
      for (const [lang, dict] of [["en", en], ["mk", mk]] as const) {
        localStorage.setItem(LANGUAGE_KEY, lang);
        const { container, unmount } = render(<LanguageProvider><RarityBadge rarity={rarity} /></LanguageProvider>);
        await act(async () => {});
        expect(screen.getByRole("button", { name: dict[key] })).toBeTruthy();
        expect(container.querySelector("svg")).not.toBeNull();
        expect(container.querySelectorAll(".gem-sparkle").length).toBe(rarity === "rare" ? 2 : 0);
        unmount();
      }
    });
  }

  it("draws a different gem shape per rarity", () => {
    const shapes = cases.map(([r]) => render(<RarityBadge rarity={r} />).container.querySelector("clipPath path")?.getAttribute("d"));
    expect(new Set(shapes).size).toBe(3);
  });

  it("shows the label on tap and hides it on an outside tap", async () => {
    render(<div><p>outside</p><RarityBadge rarity="rare" /></div>);
    expect(screen.queryByRole("tooltip")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: en.rarityRare }));
    expect((await screen.findByRole("tooltip")).textContent).toBe(en.rarityRare);
    fireEvent.pointerDown(screen.getByText("outside"));
    await act(async () => {});
    expect(screen.queryByRole("tooltip")).toBeNull();
  });
});
