import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { RarityBadge } from "./RarityBadge";
import { en } from "@/i18n/en";

afterEach(cleanup);

describe("RarityBadge", () => {
  const cases = [["common", en.rarityCommon], ["uncommon", en.rarityUncommon], ["rare", en.rarityRare]] as const;
  for (const [rarity, label] of cases) {
    it(`renders the ${rarity} gem with its label`, () => {
      const { container, getByText } = render(<RarityBadge rarity={rarity} />);
      expect(container.querySelector(`[data-rarity="${rarity}"] svg`)).not.toBeNull();
      expect(getByText(label)).toBeTruthy();
      expect(container.querySelectorAll(".gem-sparkle").length).toBe(rarity === "rare" ? 2 : 0);
    });
  }
  it("draws a different gem shape per rarity", () => {
    const shapes = cases.map(([r]) => render(<RarityBadge rarity={r} />).container.querySelector("clipPath path")?.getAttribute("d"));
    expect(new Set(shapes).size).toBe(3);
  });
});
