import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { LANGUAGE_KEY } from "@/i18n/languages";
import { MeetMango } from "./MeetMango";

afterEach(() => {
  cleanup();
  localStorage.clear();
});

describe("Meet Mango introduction", () => {
  it.each([
    ["en", "Meet Mango"],
    ["mk", "Запознај го Манго"],
  ])("opens from the welcome link in %s", (language, title) => {
    localStorage.setItem(LANGUAGE_KEY, language);
    render(<LanguageProvider><MeetMango /></LanguageProvider>);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: title }));
    expect(screen.getByRole("dialog", { name: title })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
  });
});