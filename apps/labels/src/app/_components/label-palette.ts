import type { Coffee } from "./coffee-label-data";

/**
 * Natcore palette per coffee colour, the same palettes the shop uses
 * (`palette` in apps/ecommerce/src/app/shop/_components/coffee-palette.ts).
 * Set on the label so shade utilities like `bg-900` / `text-950` use the
 * coffee's colour. `navy` and `pumpkin` come from the shared styles/palettes.css.
 * Written out in full so Tailwind can see every class.
 */
export const LABEL_PALETTES: Record<Coffee["color"], string> = {
  cyan: "palette-cyan",
  sky: "palette-sky",
  navy: "palette-navy",
  yellow: "palette-yellow",
  rose: "palette-rose",
  slate: "palette-slate",
  purple: "palette-purple",
  amber: "palette-amber",
  emerald: "palette-emerald",
  violet: "palette-violet",
  pumpkin: "palette-pumpkin",
};
