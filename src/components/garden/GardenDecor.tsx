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

export function GrapeVine({ className }: { className?: string }) {
  const cluster = (x: number, y: number) =>
    [[0, 0], [8, 0], [16, 0], [4, 7], [12, 7], [8, 14]].map(([dx, dy]) => (
      <circle key={`${x}-${dx}-${dy}`} cx={x + dx} cy={y + dy} r="4.5" fill="var(--grape)" />
    ));
  const leaf = (x: number, y: number, r: number) => (
    <path key={`${x}-${y}`} d="M0 0 C-12 -4 -14 -16 0 -22 C14 -16 12 -4 0 0Z" fill="var(--leaf)" transform={`translate(${x} ${y}) rotate(${r})`} />
  );
  return (
    <svg viewBox="0 0 200 140" className={className} aria-hidden>
      <path d="M0 8 C40 14 70 30 100 34 C130 38 150 56 170 80" fill="none" stroke="var(--wood)" strokeWidth="5" strokeLinecap="round" />
      <path d="M100 34 C96 50 104 60 98 70" fill="none" stroke="var(--wood)" strokeWidth="2" />
      {[leaf(30, 14, 160), leaf(62, 26, 200), leaf(118, 40, 150), leaf(150, 58, 210), leaf(170, 82, 170)]}
      {cluster(54, 34)}
      {cluster(130, 62)}
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
      <GrapeVine className="absolute left-0 top-16 hidden w-40 sm:block md:w-56" />
      {FLOWERS.map((f, i) => (
        <Flower key={i} color={f.color} className={`absolute ${f.pos} ${f.size} ${f.mobile ? "" : "hidden sm:block"}`} />
      ))}
      <Butterfly className="butterfly-float absolute left-[18%] top-[38%] h-6 w-7" />
      <Butterfly className="butterfly-float absolute right-[16%] top-[55%] hidden h-5 w-6 [animation-delay:-3s] sm:block" />
    </div>
  );
}
