import type { BirdLook } from "@/data/birds";
import type { Mood } from "@/data/mango-lines";

interface BirdSvgProps {
  look: BirdLook & { tail?: string };
  mood?: Mood | "neutral";
  className?: string;
  title?: string;
}

/** One reusable flat storybook bird. Colors + one marking come from data. */
export function BirdSvg({ look, mood = "neutral", className, title }: BirdSvgProps) {
  const { body, belly, wing, beak, marking, markingColor } = look;
  const tail = look.tail ?? wing;
  const ink = "#3a2e26";

  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label={title}>
      {title && <title>{title}</title>}
      {/* tail */}
      <path d="M32 74 L6 66 L10 82 L4 92 L34 86 Z" fill={tail} />
      {/* legs */}
      <path d="M54 96 v10 M66 96 v10" stroke={beak === "#f2a93b" ? beak : "#d98b52"} strokeWidth="3" strokeLinecap="round" />
      {/* crest (behind head) */}
      {(marking === "crest" || marking === "crest-tipped") && (
        <g>
          <path d="M56 42 L50 16 L64 36 L66 12 L72 36 L82 20 L78 44 Z" fill={markingColor} />
          {marking === "crest-tipped" && (
            <path d="M50 16 l3 8 M66 12 l1 8 M82 20 l-3 7" stroke={ink} strokeWidth="4" strokeLinecap="round" />
          )}
        </g>
      )}
      {/* body */}
      <circle cx="60" cy="66" r="32" fill={body} />
      <ellipse cx="66" cy="80" rx="22" ry="16" fill={belly} />
      {marking === "red-breast" && <ellipse cx="74" cy="72" rx="16" ry="14" fill={markingColor} />}
      {marking === "face" && <circle cx="76" cy="58" r="13" fill={markingColor} />}
      {marking === "cap" && <path d="M38 50 Q60 22 86 46 Q62 40 38 50 Z" fill={markingColor} />}
      {marking === "spots" &&
        [[50, 56], [62, 50], [58, 74], [46, 70], [70, 86], [54, 88]].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2.2" fill={markingColor} />
        ))}
      {/* wing */}
      <path d="M36 66 Q48 52 66 66 Q60 88 38 86 Q30 78 36 66 Z" fill={wing} />
      {marking === "wingbar" && <path d="M40 74 Q52 70 62 76" stroke={markingColor} strokeWidth="4" fill="none" strokeLinecap="round" />}
      {/* eye area */}
      {marking === "mask" && <ellipse cx="76" cy="56" rx="10" ry="5" fill={markingColor} />}
      {mood === "happy" ? (
        <path d="M72 56 q4 -5 8 0" stroke={ink} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      ) : (
        <g className="bird-eye">
          <circle cx="76" cy="56" r={mood === "excited" ? 4.5 : 3.5} fill={ink} />
          <circle cx="77.5" cy="54.5" r="1.3" fill="#ffffff" />
        </g>
      )}
      {mood === "grumpy" && <path d="M69 48 L83 52" stroke={ink} strokeWidth="3" strokeLinecap="round" />}
      {/* cheek */}
      <circle cx="80" cy="66" r="3.5" fill="#f5a3a3" opacity="0.55" />
      {/* beak */}
      {mood === "excited" ? (
        <g>
          <path d="M88 56 L101 60 L88 63 Z" fill={beak} />
          <path d="M88 66 L99 69 L88 71 Z" fill={beak} />
        </g>
      ) : (
        <path d="M88 57 L102 63 L88 69 Z" fill={beak} />
      )}
    </svg>
  );
}
