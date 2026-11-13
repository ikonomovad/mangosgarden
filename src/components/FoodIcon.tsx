import type { ReactNode } from "react";
import { FOODS } from "@/data/foods";

// Shared flat artwork; all palette values come from the garden's theme tokens.
export const FOOD_ICONS: Record<string, ReactNode> = {
  sunflower: <>
    <path d="M9 34 Q4 20 13 12 Q24 17 21 31 Q18 40 9 34Z" fill="var(--sunflower-seed)" />
    <path d="M21 35 Q20 19 30 15 Q40 24 32 36 Q28 42 21 35Z" fill="var(--sunflower-seed)" />
    <path d="M32 35 Q32 23 41 23 Q48 35 38 40Z" fill="var(--sunflower-seed)" />
    <path d="M13 17 Q17 25 13 33 M29 20 Q30 28 26 35 M40 28 L37 35" stroke="var(--card)" />
  </>,
  millet: <g fill="var(--sun)">
    {[[10,34],[18,34],[26,34],[34,34],[42,34],[14,27],[22,27],[30,27],[38,27],[19,20],[27,20],[35,20],[26,13]].map(([cx,cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3.5" />)}
  </g>,
  wheat: <>
    <path d="M23 43 L27 8" fill="none" />
    <g fill="var(--sun)">
      <path d="M26 34 Q13 34 13 24 Q24 22 26 34Z M26 25 Q14 24 15 15 Q26 15 26 25Z M27 17 Q19 9 27 3 Q34 10 27 17Z M26 34 Q39 33 38 23 Q28 23 26 34Z M27 25 Q39 23 38 14 Q28 15 27 25Z" />
    </g>
  </>,
  peanuts: <g fill="var(--wood-light)">
    <path d="M8 16 C1 20 5 29 11 30 C14 31 13 38 20 39 C29 41 33 31 27 26 C22 22 24 16 19 13 C14 10 10 12 8 16Z" />
    <path d="M28 10 C24 15 28 21 31 24 C34 27 28 32 34 36 C42 42 49 34 44 27 C40 22 44 18 40 12 C37 7 31 7 28 10Z" />
    <path d="M11 19 L17 24 M18 29 L22 34 M32 13 L36 20 M36 27 L39 32" fill="none" />
  </g>,
  walnut: <>
    <path d="M24 8 C10 5 5 18 7 29 C9 41 19 44 24 40 C30 44 40 39 42 28 C44 15 35 5 24 8Z" fill="var(--wood-light)" />
    <path d="M24 9 Q20 17 25 23 Q20 30 24 40 M16 15 Q10 21 15 29 M32 15 Q38 22 32 31" fill="none" />
  </>,
  apple: <>
    <path d="M24 15 Q22 9 25 4" stroke="var(--wood)" strokeWidth="2.5" />
    <path d="M25 11 Q28 3 38 6 Q34 15 25 11Z" fill="var(--leaf)" />
    <path d="M24 16 C12 8 4 17 7 29 C9 40 16 45 24 41 C32 45 39 40 41 29 C44 17 36 8 24 16Z" fill="var(--poppy)" />
    <path d="M14 20 Q10 24 13 30" stroke="var(--card)" strokeWidth="2.5" />
  </>,
  berries: <>
    <path d="M23 15 Q23 3 40 6 Q37 18 23 15Z" fill="var(--leaf)" />
    <circle cx="16" cy="22" r="9" fill="var(--chart-5)" />
    <circle cx="32" cy="23" r="9" fill="var(--grape)" />
    <circle cx="23" cy="34" r="9" fill="var(--lavender)" />
    <path d="M13 18 L17 19 M29 19 L33 20 M20 30 L24 31" stroke="var(--card)" />
  </>,
  orange: <>
    <path d="M4 16 H44 C44 43 4 43 4 16Z" fill="var(--primary)" />
    <path d="M8 19 H40 C38 39 10 39 8 19Z" fill="var(--sun)" />
    <path d="M24 19 L13 29 M24 19 V35 M24 19 L35 29" stroke="var(--card)" strokeWidth="2.5" />
  </>,
  mealworms: <>
    <g fill="none" stroke="var(--foreground)" strokeWidth="7">
      <path d="M8 14 C18 5 28 13 20 20 M31 13 C43 11 45 24 34 26 M9 30 C5 41 25 44 28 34" />
    </g>
    <g fill="none" stroke="var(--wood-light)" strokeWidth="4">
      <path d="M8 14 C18 5 28 13 20 20 M31 13 C43 11 45 24 34 26 M9 30 C5 41 25 44 28 34" />
    </g>
  </>,
  water: <>
    <path d="M24 4 C20 13 10 21 10 29 A14 14 0 0 0 38 29 C38 21 28 13 24 4Z" fill="var(--chart-5)" />
    <path d="M17 27 Q14 34 21 36" stroke="var(--card)" strokeWidth="2.5" />
  </>,
  figs: <>
    <path d="M14 10 Q15 5 18 4" stroke="var(--wood)" strokeWidth="2.5" />
    <path d="M14 10 C8 16 4 26 5 32 C6 40 22 40 23 32 C24 26 20 16 14 10Z" fill="var(--grape)" />
    <path d="M30 14 C26 20 24 28 25 34 C26 42 44 42 45 34 C46 28 40 20 37 14Z" fill="var(--grape)" />
    <path d="M32 19 C29 24 28 29 29 33 C30 38 40 38 41 33 C42 29 39 23 36 19Z" fill="var(--fig-flesh)" stroke="none" />
    <g fill="var(--sun)" stroke="none">
      <circle cx="33" cy="27" r="1.2" /><circle cx="37" cy="30" r="1.2" /><circle cx="33" cy="33" r="1.2" /><circle cx="36" cy="24" r="1.2" />
    </g>
  </>,
  corn: <>
    <path d="M24 6 C16 10 14 24 16 36 L32 36 C34 24 32 10 24 6Z" fill="var(--sun)" />
    <path d="M20 14 H28 M18 21 H30 M18 28 H30 M24 9 V35" stroke="var(--wood-light)" />
    <path d="M24 44 C12 40 8 28 10 18 C14 26 18 34 24 38Z" fill="var(--leaf)" />
    <path d="M24 44 C36 40 40 28 38 18 C34 26 30 34 24 38Z" fill="var(--leaf)" />
  </>,
  pumpkin: <g fill="var(--pumpkin-seed)">
    <path d="M6 34 Q6 24 15 22 Q20 30 14 38 Q8 40 6 34Z" />
    <path d="M18 40 Q14 30 22 26 Q30 30 28 40 Q23 46 18 40Z" />
    <path d="M30 34 Q32 24 41 22 Q44 32 36 38 Q31 40 30 34Z" />
    <path d="M17 22 Q19 12 27 8 Q32 16 26 24 Q20 27 17 22Z" />
  </g>,
  rosehip: <>
    <path d="M6 12 Q22 14 40 8 M20 13 L18 8" stroke="var(--wood)" strokeWidth="2.5" />
    <path d="M30 11 Q38 2 45 6 Q40 15 30 11Z" fill="var(--leaf)" />
    <g fill="var(--rosehip)">
      <ellipse cx="12" cy="26" rx="5.5" ry="8" />
      <ellipse cx="24" cy="31" rx="5.5" ry="8" />
      <ellipse cx="36" cy="25" rx="5.5" ry="8" />
    </g>
    <path d="M12 13 V18 M24 14 V23 M36 10 V17" />
  </>,
};

export function FoodIcon({ id, size = 40 }: { id: string; size?: number }) {
  const artwork = FOOD_ICONS[id];
  if (!artwork) {
    return <span aria-hidden="true">{FOODS.find((food) => food.id === id)?.emoji}</span>;
  }
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" focusable="false" className="inline-block shrink-0 align-text-bottom" fill="none" stroke="var(--foreground)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {artwork}
    </svg>
  );
}