import type { ReactNode } from "react";
import { FOODS } from "@/data/foods";

// Shared flat artwork; all palette values come from the garden's theme tokens.
export const FOOD_ICONS: Record<string, ReactNode> = {
  sunflower: <>
    <path d="M9 34 Q4 20 13 12 Q24 17 21 31 Q18 40 9 34Z" fill="var(--wood)" />
    <path d="M21 35 Q20 19 30 15 Q40 24 32 36 Q28 42 21 35Z" fill="var(--wood)" />
    <path d="M32 35 Q32 23 41 23 Q48 35 38 40Z" fill="var(--wood)" />
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
    <path d="M5 16 Q17 5 28 15 L18 34 Q7 31 5 16Z M21 21 Q32 11 43 21 L34 41 Q23 38 21 21Z" fill="var(--poppy)" />
    <path d="M8 16 Q17 9 24 16 L17 30 Q10 27 8 16Z M24 22 Q32 15 39 22 L33 37 Q26 34 24 22Z" fill="var(--card)" />
    <path d="M16 20 Q12 23 17 25 Q20 23 16 20Z M32 26 Q28 29 33 31 Q36 29 32 26Z" fill="var(--foreground)" stroke="none" />
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
    <path d="M21 31 H27 V41 H34 V44 H14 V41 H21Z" fill="var(--wood-light)" />
    <path d="M5 22 H43 Q39 35 24 35 Q9 35 5 22Z" fill="var(--card)" />
    <ellipse cx="24" cy="22" rx="19" ry="4" fill="var(--chart-5)" />
    <path d="M24 3 C22 7 18 10 18 14 A6 6 0 0 0 30 14 C30 10 26 7 24 3Z" fill="var(--chart-5)" />
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