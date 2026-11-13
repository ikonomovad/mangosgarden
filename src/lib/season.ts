/** Northern-hemisphere meteorological seasons from the local calendar month. */
export type Season = "spring" | "summer" | "autumn" | "winter";

export function seasonFor(date: Date): Season {
  const m = date.getMonth(); // 0 = January
  if (m >= 2 && m <= 4) return "spring";
  if (m >= 5 && m <= 7) return "summer";
  if (m >= 8 && m <= 10) return "autumn";
  return "winter";
}
