/** Decorative, non-interactive garden details: wildflowers, a grapevine, butterflies. */

type FlowerColor = "poppy" | "lavender" | "daisy";

const PETAL: Record<FlowerColor, string> = {
  poppy: "var(--poppy)",
  lavender: "var(--lavender)",
  daisy: "var(--daisy)",
};

export function Flower({ color, className }: { color: FlowerColor; className?: string }) {
  return (
    <svg viewBox="0 0 40 60" className={className} aria-hidden>
      <path d="M20 58 V26" stroke="var(--leaf)" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="13" cy="44" rx="7" ry="3.5" fill="var(--leaf)" transform="rotate(-30 13 44)" />
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="20" cy="12" rx="6" ry="9" fill={PETAL[color]} transform={`rotate(${a} 20 20)`} />
      ))}
      <circle cx="20" cy="20" r="5" fill={color === "poppy" ? "var(--foreground)" : "var(--sun)"} />
    </svg>
  );
}

export function FigBranch({ className }: { className?: string }) {
  const leaf = (x: number, y: number, r: number, k: number) => (
    <path
      key={k}
      d="M0 0 C-4 -6 -16 -4 -18 -12 C-12 -14 -14 -24 -8 -28 C-4 -22 -2 -32 0 -36 C2 -32 4 -22 8 -28 C14 -24 12 -14 18 -12 C16 -4 4 -6 0 0Z"
      fill="var(--leaf)"
      transform={`translate(${x} ${y}) rotate(${r})`}
    />
  );
  return (
    <svg viewBox="0 0 200 130" className={className} aria-hidden>
      <path d="M0 10 C50 18 90 30 130 52 C150 62 165 78 175 92" fill="none" stroke="var(--wood)" strokeWidth="6" strokeLinecap="round" />
      {[leaf(40, 18, 200, 1), leaf(85, 32, 160, 2), leaf(130, 52, 210, 3), leaf(172, 92, 170, 4)]}
      {([[64, 25], [148, 64]] as const).map(([x, y]) => (
        <g key={x}>
          <path d={`M${x} ${y} v6`} stroke="var(--wood)" strokeWidth="2" />
          <path d={`M${x} ${y + 5} C${x - 9} ${y + 8} ${x - 8} ${y + 22} ${x} ${y + 22} C${x + 8} ${y + 22} ${x + 9} ${y + 8} ${x} ${y + 5}Z`} fill="var(--grape)" />
        </g>
      ))}
    </svg>
  );
}

export function AppleTree({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 100" className={className} aria-hidden>
      <rect x="35" y="55" width="10" height="45" rx="3" fill="var(--wood)" />
      <circle cx="40" cy="38" r="34" fill="var(--leaf)" />
      {([[24, 26], [50, 18], [58, 42], [32, 50], [44, 34], [20, 44]] as const).map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="var(--poppy)" />
      ))}
    </svg>
  );
}

export function Butterfly({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 24" className={className} aria-hidden>
      <g className="butterfly-wings">
        <ellipse cx="9" cy="9" rx="8" ry="7" fill="var(--accent)" />
        <ellipse cx="21" cy="9" rx="8" ry="7" fill="var(--accent)" />
        <ellipse cx="10" cy="18" rx="5" ry="4" fill="var(--rare)" />
        <ellipse cx="20" cy="18" rx="5" ry="4" fill="var(--rare)" />
      </g>
      <rect x="14" y="5" width="2" height="16" rx="1" fill="var(--foreground)" />
    </svg>
  );
}

const FLOWERS: { color: FlowerColor; pos: string; size: string; mobile: boolean }[] = [
  { color: "poppy", pos: "left-[4%] bottom-20", size: "h-12 w-8", mobile: true },
  { color: "daisy", pos: "left-[14%] bottom-8", size: "h-9 w-6", mobile: true },
  { color: "lavender", pos: "left-[24%] bottom-24", size: "h-10 w-7", mobile: false },
  { color: "poppy", pos: "left-[34%] bottom-4", size: "h-8 w-5", mobile: false },
  { color: "daisy", pos: "left-[44%] bottom-16", size: "h-11 w-7", mobile: true },
  { color: "lavender", pos: "left-[55%] bottom-6", size: "h-9 w-6", mobile: false },
  { color: "poppy", pos: "left-[64%] bottom-24", size: "h-10 w-7", mobile: false },
  { color: "daisy", pos: "left-[74%] bottom-10", size: "h-12 w-8", mobile: true },
  { color: "lavender", pos: "left-[84%] bottom-20", size: "h-11 w-7", mobile: true },
  { color: "poppy", pos: "left-[93%] bottom-6", size: "h-9 w-6", mobile: false },
];

/** All decorations; sits behind scene content and never captures taps. */
export function GardenDecor() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <FigBranch className="absolute left-0 top-16 hidden w-40 sm:block md:w-56" />
      <AppleTree className="absolute bottom-48 right-[10%] hidden h-24 w-20 md:block" />
      {FLOWERS.map((f, i) => (
        <Flower key={i} color={f.color} className={`absolute ${f.pos} ${f.size} ${f.mobile ? "" : "hidden sm:block"}`} />
      ))}
      <Butterfly className="butterfly-float absolute left-[18%] top-[38%] h-6 w-7" />
      <Butterfly className="butterfly-float absolute right-[16%] top-[55%] hidden h-5 w-6 [animation-delay:-3s] sm:block" />
    </div>
  );
}
