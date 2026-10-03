/**
 * Per-coffee accent used on the homepage cards. Coffees are modeled with a
 * `color` token (there are no product photos), so the homepage uses theme
 * classes instead of raw hex values for the origin panels.
 */
export const COFFEE_ACCENT_CLASS: Record<string, string> = {
  cyan: "bg-accent-700",
  sky: "bg-secondary-200",
  yellow: "bg-secondary-300",
  rose: "bg-accent-500",
  slate: "bg-primary-200",
  purple: "bg-accent-300",
  amber: "bg-secondary-500",
  emerald: "bg-success-500",
};

export function accentClassFor(color: string): string {
  return COFFEE_ACCENT_CLASS[color] ?? "bg-accent-700";
}
