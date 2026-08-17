/**
 * Homepage brand tokens — from the Sappho brand guidelines.
 *
 * Deep Navy is the visual anchor, Winter Frost the dominant canvas, and
 * pink/peach are used as accents only (never large uninterrupted blocks).
 */
export const BRAND = {
  navy: "#001F36", // Deep Navy — visual anchor
  frost: "#FAF9F8", // Winter Frost — dominant page canvas
  pink: "#F8DCDF", // Pink
  peach: "#EFAA9C", // Peach
  peachyPink: "#E8ABB0", // Peachy Pink
  // Supporting earthy neutrals
  stone: "#D2CCC5",
  clay: "#CDBCA9",
  taupe: "#96887D",
  sand: "#C8B8A9",
  cocoa: "#926A48",
} as const;

/**
 * Per-coffee accent used on the homepage cards. Coffees are modeled with a
 * `color` token (there are no product photos), so the homepage leans on a warm,
 * brand-aligned accent per origin instead of stock bean imagery.
 */
export const COFFEE_ACCENT: Record<string, string> = {
  cyan: BRAND.peach,
  sky: "#9FB6C4",
  yellow: "#E7C48D",
  rose: BRAND.peachyPink,
  slate: BRAND.taupe,
  purple: "#B79FC0",
  amber: BRAND.cocoa,
  emerald: "#7E9A82",
};

export function accentFor(color: string): string {
  return COFFEE_ACCENT[color] ?? BRAND.peach;
}
