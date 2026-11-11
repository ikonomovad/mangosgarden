import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { BookOpen, Flame, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageShellProps {
  children: ReactNode;
  streak: number;
  sound: boolean;
  onToggleSound: () => void;
  className?: string;
}

/** Shared layout for every screen: centered column, fixed streak pill, floating controls. */
export function PageShell({ children, streak, sound, onToggleSound, className }: PageShellProps) {
  const soundLabel = sound ? "Mute sounds" : "Enable sounds";
  return (
    <div className="app-backdrop viewport-height overflow-hidden">
      <p
        aria-label={`${streak} day streak`}
        className="fixed left-[var(--page-left)] top-[var(--page-top)] z-20 flex h-11 items-center gap-1.5 rounded-full bg-card px-4 font-display text-lg text-primary shadow-soft"
      >
        <Flame className="h-5 w-5" aria-hidden /> {streak}
      </p>
      <nav aria-label="Game controls" className="fixed right-[var(--page-right)] top-[var(--page-top)] z-20 flex gap-2 md:top-1/2 md:-translate-y-1/2 md:flex-col">
        <Link to="/book" aria-label="Bird book" className="float-btn group">
          <BookOpen className="h-5 w-5" aria-hidden />
          <span className="float-tip">Bird book</span>
        </Link>
        <button type="button" aria-label={soundLabel} aria-pressed={sound} onClick={onToggleSound} className="float-btn group">
          {sound ? <Volume2 className="h-5 w-5" aria-hidden /> : <VolumeX className="h-5 w-5" aria-hidden />}
          <span className="float-tip">{soundLabel}</span>
        </button>
      </nav>
      <main className={cn("viewport-height mx-auto flex min-h-0 w-full max-w-[var(--page-max)] flex-col gap-[var(--gap)] overflow-y-auto overscroll-y-contain pl-[var(--page-left)] pr-[var(--page-right)] pb-[var(--page-bottom)] pt-[calc(var(--page-top)+var(--page-pad)+2.75rem)] [&>*]:shrink-0", className)}>
        {children}
      </main>
    </div>
  );
}
