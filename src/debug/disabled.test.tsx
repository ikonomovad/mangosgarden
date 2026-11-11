import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

vi.mock("@/lib/game", async (original) => {
  const game = await original<typeof import("@/lib/game")>();
  return { ...game, ENABLE_DEBUG_PANEL: false };
});

import { DeveloperPanel } from "./DeveloperPanel";
import { changeClock, debugEnabled, DEBUG_SESSION_KEY } from "./actions";
import { DEBUG_CLOCK_KEY } from "@/lib/game";

afterEach(() => { cleanup(); localStorage.clear(); sessionStorage.clear(); window.history.replaceState({}, "", "/"); });

it("disabled flag prevents panel, URL activation, and clock buttons", () => {
  window.history.replaceState({}, "", "/?debug=1");
  localStorage.setItem(DEBUG_CLOCK_KEY, "86400000");
  expect(debugEnabled()).toBe(false);
  expect(sessionStorage.getItem(DEBUG_SESSION_KEY)).toBeNull();
  expect(changeClock(1)).toBe(false);
  expect(localStorage.getItem(DEBUG_CLOCK_KEY)).toBe("86400000");
  render(<DeveloperPanel />);
  expect(screen.queryByRole("complementary", { name: "Developer test panel" })).toBeNull();
});