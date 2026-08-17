import { type products } from "@models";

/**
 * Literal Tailwind class strings per label color, keyed to the product's
 * `color`. Written out in full so Tailwind's compiler can see every class.
 */
export type CoffeePalette = {
  surface: string;
  panel: string;
  panelText: string;
  accentBg: string;
  accentText: string;
  textStrong: string;
  textMuted: string;
  border: string;
  borderStrong: string;
  chipBg: string;
  chipText: string;
  gradientFrom: string;
  gradientTo: string;
};

export const COFFEE_PALETTES: Record<products.Product["color"], CoffeePalette> =
  {
    cyan: {
      surface: "bg-cyan-50",
      panel: "bg-cyan-900",
      panelText: "text-cyan-50",
      accentBg: "bg-cyan-200",
      accentText: "text-cyan-950",
      textStrong: "text-cyan-950",
      textMuted: "text-cyan-800",
      border: "border-cyan-900",
      borderStrong: "border-cyan-950",
      chipBg: "bg-cyan-100",
      chipText: "text-cyan-900",
      gradientFrom: "from-cyan-900",
      gradientTo: "to-cyan-700",
    },
    sky: {
      surface: "bg-sky-50",
      panel: "bg-sky-900",
      panelText: "text-sky-50",
      accentBg: "bg-sky-200",
      accentText: "text-sky-950",
      textStrong: "text-sky-950",
      textMuted: "text-sky-800",
      border: "border-sky-900",
      borderStrong: "border-sky-950",
      chipBg: "bg-sky-100",
      chipText: "text-sky-900",
      gradientFrom: "from-sky-900",
      gradientTo: "to-sky-700",
    },
    yellow: {
      surface: "bg-yellow-50",
      panel: "bg-yellow-900",
      panelText: "text-yellow-50",
      accentBg: "bg-yellow-200",
      accentText: "text-yellow-950",
      textStrong: "text-yellow-950",
      textMuted: "text-yellow-800",
      border: "border-yellow-900",
      borderStrong: "border-yellow-950",
      chipBg: "bg-yellow-100",
      chipText: "text-yellow-900",
      gradientFrom: "from-yellow-900",
      gradientTo: "to-yellow-700",
    },
    rose: {
      surface: "bg-rose-50",
      panel: "bg-rose-900",
      panelText: "text-rose-50",
      accentBg: "bg-rose-200",
      accentText: "text-rose-950",
      textStrong: "text-rose-950",
      textMuted: "text-rose-800",
      border: "border-rose-900",
      borderStrong: "border-rose-950",
      chipBg: "bg-rose-100",
      chipText: "text-rose-900",
      gradientFrom: "from-rose-900",
      gradientTo: "to-rose-700",
    },
    slate: {
      surface: "bg-slate-50",
      panel: "bg-slate-900",
      panelText: "text-slate-50",
      accentBg: "bg-slate-200",
      accentText: "text-slate-950",
      textStrong: "text-slate-950",
      textMuted: "text-slate-800",
      border: "border-slate-900",
      borderStrong: "border-slate-950",
      chipBg: "bg-slate-100",
      chipText: "text-slate-900",
      gradientFrom: "from-slate-900",
      gradientTo: "to-slate-700",
    },
    purple: {
      surface: "bg-purple-50",
      panel: "bg-purple-900",
      panelText: "text-purple-50",
      accentBg: "bg-purple-200",
      accentText: "text-purple-950",
      textStrong: "text-purple-950",
      textMuted: "text-purple-800",
      border: "border-purple-900",
      borderStrong: "border-purple-950",
      chipBg: "bg-purple-100",
      chipText: "text-purple-900",
      gradientFrom: "from-purple-900",
      gradientTo: "to-purple-700",
    },
    amber: {
      surface: "bg-amber-50",
      panel: "bg-amber-900",
      panelText: "text-amber-50",
      accentBg: "bg-amber-200",
      accentText: "text-amber-950",
      textStrong: "text-amber-950",
      textMuted: "text-amber-800",
      border: "border-amber-900",
      borderStrong: "border-amber-950",
      chipBg: "bg-amber-100",
      chipText: "text-amber-900",
      gradientFrom: "from-amber-900",
      gradientTo: "to-amber-700",
    },
    emerald: {
      surface: "bg-emerald-50",
      panel: "bg-emerald-900",
      panelText: "text-emerald-50",
      accentBg: "bg-emerald-200",
      accentText: "text-emerald-950",
      textStrong: "text-emerald-950",
      textMuted: "text-emerald-800",
      border: "border-emerald-900",
      borderStrong: "border-emerald-950",
      chipBg: "bg-emerald-100",
      chipText: "text-emerald-900",
      gradientFrom: "from-emerald-900",
      gradientTo: "to-emerald-700",
    },
    violet: {
      surface: "bg-violet-50",
      panel: "bg-violet-900",
      panelText: "text-violet-50",
      accentBg: "bg-violet-200",
      accentText: "text-violet-950",
      textStrong: "text-violet-950",
      textMuted: "text-violet-800",
      border: "border-violet-900",
      borderStrong: "border-violet-950",
      chipBg: "bg-violet-100",
      chipText: "text-violet-900",
      gradientFrom: "from-violet-900",
      gradientTo: "to-violet-700",
    },
  };
