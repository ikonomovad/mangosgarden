import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { BIRDS } from "@/data/birds";
import { BookBadge, BookComplete, BooksCompleted } from "./BookComplete";

afterEach(() => { cleanup(); localStorage.clear(); });
const wrap = (ui: React.ReactNode) => render(<LanguageProvider>{ui}</LanguageProvider>);

it("shows the panel only when the book is complete, with the book number", () => {
  wrap(<BookComplete collected={BIRDS.length - 1} completed={0} onConfirm={() => {}} />);
  expect(screen.queryByRole("button", { name: "Start a new book" })).toBeNull();
  cleanup();
  wrap(<BookComplete collected={BIRDS.length} completed={1} onConfirm={() => {}} />);
  expect(screen.getByText("Book 2 complete! 🎉")).toBeInTheDocument();
});

it("cancel changes nothing; confirm calls the reset", () => {
  const onConfirm = vi.fn();
  wrap(<BookComplete collected={BIRDS.length} completed={0} onConfirm={onConfirm} />);
  fireEvent.click(screen.getByRole("button", { name: "Start a new book" }));
  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  expect(onConfirm).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Start a new book" }));
  fireEvent.click(screen.getByRole("button", { name: "Start new book" }));
  expect(onConfirm).toHaveBeenCalledOnce();
});

it("badge shows Book 1 at the start and Book 2 after one completed book", () => {
  wrap(<BookBadge completed={0} />);
  expect(screen.getByText("Book 1")).toBeInTheDocument();
  cleanup();
  wrap(<BookBadge completed={1} />);
  expect(screen.getByText("Book 2")).toBeInTheDocument();
});

it("shows Books completed only after the first completed book", () => {
  wrap(<BooksCompleted completed={0} />);
  expect(screen.queryByText(/Books completed/)).toBeNull();
  cleanup();
  wrap(<BooksCompleted completed={1} />);
  expect(screen.getByText("Books completed: 1")).toBeInTheDocument();
});
