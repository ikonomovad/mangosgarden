import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { PatButton } from "./PatMango";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { loadPatDate } from "@/lib/pat";

afterEach(() => { cleanup(); localStorage.clear(); });

async function mount(today: string, onPat = vi.fn()) {
  const r = render(<LanguageProvider><PatButton today={today} onPat={onPat} /></LanguageProvider>);
  await act(async () => {});
  return { ...r, onPat, button: () => r.container.querySelector<HTMLButtonElement>("button[aria-label=\"Pat Mango\"]")! };
}

describe("PatButton", () => {
  it("first click saves the date and hides the button", async () => {
    const { button, onPat } = await mount("2026-11-12");
    expect(button().className).not.toContain("invisible");
    fireEvent.click(button());
    expect(onPat).toHaveBeenCalledTimes(1);
    expect(loadPatDate()).toBe("2026-11-12");
    expect(button().className).toContain("invisible");
  });
  it("stays hidden after reload the same day and shows again on a new day", async () => {
    localStorage.setItem("mangos-garden:pat", "2026-11-12");
    const { button, rerender } = await mount("2026-11-12");
    expect(button().className).toContain("invisible");
    rerender(<LanguageProvider><PatButton today="2026-11-13" onPat={() => {}} /></LanguageProvider>);
    await act(async () => {});
    expect(button().className).not.toContain("invisible");
  });
  it("a double click counts once", async () => {
    const { button, onPat } = await mount("2026-11-12");
    const b = button();
    fireEvent.click(b); fireEvent.click(b);
    expect(onPat).toHaveBeenCalledTimes(1);
  });
});
