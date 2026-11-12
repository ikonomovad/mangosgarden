import { useEffect, useId, useState } from "react";
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover";
import { useLanguage } from "@/i18n/LanguageProvider";
import type { Bird } from "@/data/birds";

type Rarity = Bird["rarity"];

const LABEL = { common: "rarityCommon", uncommon: "rarityUncommon", rare: "rarityRare" } as const;

// Gem outline, top facet (lighter) and bottom facet (darker) per rarity, in a 36x36 box.
const GEMS: Record<Rarity, { fill: string; light: string; dark: string; shape: string; top: string; bottom: string }> = {
  common: {
    fill: "var(--rarity-common)", light: "var(--garden-soft)", dark: "var(--grass-deep)",
    shape: "M18 4a14 14 0 1 1 0 28a14 14 0 1 1 0-28Z",
    top: "M6 15a12.5 12.5 0 0 1 24 0Z",
    bottom: "M7 23h22a12.5 12.5 0 0 1-22 0Z",
  },
  uncommon: {
    fill: "var(--rarity-uncommon)", light: "var(--sky)", dark: "var(--grape)",
    shape: "M18 3l13 7.5v15L18 33 5 25.5v-15Z",
    top: "M18 4.5l11.7 6.8H6.3Z",
    bottom: "M6.3 24.7h23.4L18 31.5Z",
  },
  rare: {
    fill: "var(--rare)", light: "var(--sun)", dark: "var(--wood-light)",
    shape: "M18 3l15 15-15 15L3 18Z",
    top: "M18 4.5L26 12.5H10Z",
    bottom: "M10 23.5h16L18 31.5Z",
  },
};

const EMBLEM: Record<Rarity, string> = {
  common: "M13 21c0-5 4-8 10-8c0 6-4 9-10 8Zm0 0l5-4",
  uncommon: "M22 12c-5 1-8 6-8 12l8-6c1-2 1-4 0-6Zm-8 12l-1 2",
  rare: "M18 12l1.6 3.8 4 .4-3 2.7.9 4-3.5-2.1-3.5 2.1.9-4-3-2.7 4-.4Z",
};

export function RarityBadge({ rarity, delayed = false }: { rarity: Rarity; delayed?: boolean }) {
  const { t } = useLanguage();
  const label = t(LABEL[rarity]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => setOpen(false), 3000);
    return () => clearTimeout(timer);
  }, [open]);
  const keyboardFocus = (el: Element) => { try { return el.matches(":focus-visible"); } catch { return false; } };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
    <button
      type="button"
      data-rarity={rarity}
      aria-label={label}
      aria-expanded={open}
      onClick={() => setOpen((v) => !v)}
      onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
      onFocus={(e) => keyboardFocus(e.currentTarget) && setOpen(true)}
      onBlur={() => setOpen(false)}
      className={`rarity-badge inline-grid h-11 w-11 shrink-0 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-ring ${delayed ? "rarity-delayed" : ""}`}
    >
      <RarityGem rarity={rarity} />
    </button>
      </PopoverAnchor>
      <PopoverContent
        side="top"
        sideOffset={4}
        collisionPadding={8}
        role="tooltip"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => { if ((e.target as Element)?.closest?.(`[data-rarity]`) ) e.preventDefault(); }}
        className="w-auto rounded-full border-0 bg-card px-3 py-1 font-display text-xs text-card-foreground shadow-soft"
      >
        {label}
      </PopoverContent>
    </Popover>
  );
}

export function RarityGem({ rarity, className = "" }: { rarity: Rarity; className?: string }) {
  const clip = useId().replace(/:/g, "");
  const gem = GEMS[rarity];
  return (
      <span className={`relative inline-block h-9 w-9 ${className}`}>
        <svg viewBox="0 0 36 36" width="36" height="36" aria-hidden="true" className="rarity-gem overflow-visible">
          <defs><clipPath id={clip}><path d={gem.shape} /></clipPath></defs>
          <g clipPath={`url(#${clip})`}>
            <path d={gem.shape} fill={gem.fill} />
            <path d={gem.top} fill={gem.light} opacity="0.85" />
            <path d={gem.bottom} fill={gem.dark} opacity="0.55" />
            <path d={EMBLEM[rarity]} fill="var(--cloud)" stroke="var(--cloud)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            <rect className={`gem-streak ${rarity === "rare" ? "gem-streak-repeat" : ""}`} x="-14" y="-6" width="8" height="48" fill="var(--cloud)" opacity="0.75" transform="rotate(25 18 18)" />
          </g>
          <path d={gem.shape} fill="none" stroke="var(--wood)" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
        {rarity === "rare" && (
          <>
            <span aria-hidden className="gem-sparkle absolute -right-1 -top-1 text-[10px] leading-none text-rare">✦</span>
            <span aria-hidden className="gem-sparkle absolute -bottom-0.5 -left-1 text-[8px] leading-none text-rare [animation-delay:1.1s]">✦</span>
          </>
        )}
      </span>
  );
}
