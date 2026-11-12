import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLanguage } from "@/i18n/LanguageProvider";
import { claimPat, patAvailable } from "@/lib/pat";

/** Round pat button; hidden (space kept) once today's pat is used. Double taps count once. */
export function PatButton({ today, onPat }: { today: string; onPat: () => void }) {
  const { t } = useLanguage();
  const [available, setAvailable] = useState(false);
  const busy = useRef(false);
  useEffect(() => { busy.current = false; setAvailable(!!today && patAvailable(today)); }, [today]);
  const click = () => {
    if (busy.current || !available) return;
    busy.current = true;
    if (!claimPat(today)) { setAvailable(false); return; }
    setAvailable(false);
    onPat();
  };
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
    <Button
      variant="ghost"
      size="icon"
      aria-label={t("patMango")}
      aria-hidden={!available}
      tabIndex={available ? 0 : -1}
      disabled={!available}
      onClick={click}
      className={`float-btn h-11 w-11 rounded-full p-0 [&_svg]:size-8 ${available ? "" : "invisible"}`}
    >
      <PatHand />
    </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-card text-foreground shadow-soft">
          {t("patMango")}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function PatHand() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12" />
      <path d="M11 11V4.5a1.5 1.5 0 0 1 3 0V12" />
      <path d="M14 11.5V6a1.5 1.5 0 0 1 3 0v7" />
      <path d="M8 13l-1.6-1.8a1.6 1.6 0 0 0-2.4 2.1L7.5 18a5.5 5.5 0 0 0 4.5 2.5h1a5 5 0 0 0 5-5V13" />
    </svg>
  );
}

function Heart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 20s-7-4.4-7-9.5A3.8 3.8 0 0 1 12 8a3.8 3.8 0 0 1 7 2.5C19 15.6 12 20 12 20z" fill="currentColor" stroke="var(--wood)" strokeWidth="1" />
    </svg>
  );
}

/** 3–5 hearts float up from Mango, then unmount after ~1.2s. */
export function PatHearts() {
  const [done, setDone] = useState(false);
  const hearts = useMemo(() => {
    const n = 3 + Math.floor(Math.random() * 3);
    return Array.from({ length: n }, (_, i) => ({
      drift: Math.round((Math.random() - 0.5) * 40),
      left: 20 + Math.random() * 50,
      delay: i * 0.08,
      pink: i % 2 === 1,
    }));
  }, []);
  useEffect(() => { const id = setTimeout(() => setDone(true), 1500); return () => clearTimeout(id); }, []);
  if (done) return null;
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {hearts.map((h, i) => (
        <span
          key={i}
          className={`pat-heart absolute top-2 ${h.pink ? "text-[var(--mango-heart-pink)]" : "text-poppy"} ${i > 0 ? "pat-heart-extra" : ""}`}
          style={{ left: `${h.left}%`, animationDelay: `${h.delay}s`, ["--drift" as string]: `${h.drift}px` }}
        >
          <Heart className="h-5 w-5" />
        </span>
      ))}
    </div>
  );
}
