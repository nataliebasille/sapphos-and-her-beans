import type { Coffee } from "./coffee-label-data";

/**
 * Literal Tailwind classes per coffee colour, written out in full so Tailwind
 * can see every class (same approach as the shop's coffee-palette.ts).
 * `navy` and `pumpkin` come from this app's tailwind.config.ts.
 */
export type LabelPalette = {
  /** Default text */
  ink: string;
  /** Spine background */
  spine: string;
  /** Spine text (score, country) */
  spineText: string;
  /** Spine size text */
  spineMuted: string;
  /** Logo and footer rules */
  rule: string;
  /** Coffee name */
  name: string;
  /** Fermentation icon and kicker */
  accent: string;
  /** Fermentation dashed rules */
  accentBorder: string;
  /** Fermentation value and QR caption */
  strong: string;
  /** Tasting note dotted rules */
  noteRule: string;
  /** Tasting note numbers */
  noteNumber: string;
};

export const LABEL_PALETTES: Record<Coffee["color"], LabelPalette> = {
  cyan: {
    ink: "text-cyan-950",
    spine: "bg-cyan-900",
    spineText: "text-cyan-50",
    spineMuted: "text-cyan-200",
    rule: "border-cyan-900",
    name: "text-cyan-900",
    accent: "text-cyan-700",
    accentBorder: "border-cyan-700",
    strong: "text-cyan-800",
    noteRule: "border-cyan-300",
    noteNumber: "text-cyan-600",
  },
  sky: {
    ink: "text-sky-950",
    spine: "bg-sky-900",
    spineText: "text-sky-50",
    spineMuted: "text-sky-200",
    rule: "border-sky-900",
    name: "text-sky-900",
    accent: "text-sky-700",
    accentBorder: "border-sky-700",
    strong: "text-sky-800",
    noteRule: "border-sky-300",
    noteNumber: "text-sky-600",
  },
  navy: {
    ink: "text-navy-950",
    spine: "bg-navy-900",
    spineText: "text-navy-50",
    spineMuted: "text-navy-200",
    rule: "border-navy-900",
    name: "text-navy-900",
    accent: "text-navy-700",
    accentBorder: "border-navy-700",
    strong: "text-navy-800",
    noteRule: "border-navy-300",
    noteNumber: "text-navy-600",
  },
  yellow: {
    ink: "text-yellow-950",
    spine: "bg-yellow-900",
    spineText: "text-yellow-50",
    spineMuted: "text-yellow-200",
    rule: "border-yellow-900",
    name: "text-yellow-900",
    accent: "text-yellow-700",
    accentBorder: "border-yellow-700",
    strong: "text-yellow-800",
    noteRule: "border-yellow-300",
    noteNumber: "text-yellow-600",
  },
  rose: {
    ink: "text-rose-950",
    spine: "bg-rose-900",
    spineText: "text-rose-50",
    spineMuted: "text-rose-200",
    rule: "border-rose-900",
    name: "text-rose-900",
    accent: "text-rose-700",
    accentBorder: "border-rose-700",
    strong: "text-rose-800",
    noteRule: "border-rose-300",
    noteNumber: "text-rose-600",
  },
  slate: {
    ink: "text-slate-950",
    spine: "bg-slate-900",
    spineText: "text-slate-50",
    spineMuted: "text-slate-200",
    rule: "border-slate-900",
    name: "text-slate-900",
    accent: "text-slate-700",
    accentBorder: "border-slate-700",
    strong: "text-slate-800",
    noteRule: "border-slate-300",
    noteNumber: "text-slate-600",
  },
  purple: {
    ink: "text-purple-950",
    spine: "bg-purple-900",
    spineText: "text-purple-50",
    spineMuted: "text-purple-200",
    rule: "border-purple-900",
    name: "text-purple-900",
    accent: "text-purple-700",
    accentBorder: "border-purple-700",
    strong: "text-purple-800",
    noteRule: "border-purple-300",
    noteNumber: "text-purple-600",
  },
  amber: {
    ink: "text-amber-950",
    spine: "bg-amber-900",
    spineText: "text-amber-50",
    spineMuted: "text-amber-200",
    rule: "border-amber-900",
    name: "text-amber-900",
    accent: "text-amber-700",
    accentBorder: "border-amber-700",
    strong: "text-amber-800",
    noteRule: "border-amber-300",
    noteNumber: "text-amber-600",
  },
  emerald: {
    ink: "text-emerald-950",
    spine: "bg-emerald-900",
    spineText: "text-emerald-50",
    spineMuted: "text-emerald-200",
    rule: "border-emerald-900",
    name: "text-emerald-900",
    accent: "text-emerald-700",
    accentBorder: "border-emerald-700",
    strong: "text-emerald-800",
    noteRule: "border-emerald-300",
    noteNumber: "text-emerald-600",
  },
  violet: {
    ink: "text-violet-950",
    spine: "bg-violet-900",
    spineText: "text-violet-50",
    spineMuted: "text-violet-200",
    rule: "border-violet-900",
    name: "text-violet-900",
    accent: "text-violet-700",
    accentBorder: "border-violet-700",
    strong: "text-violet-800",
    noteRule: "border-violet-300",
    noteNumber: "text-violet-600",
  },
  pumpkin: {
    ink: "text-pumpkin-950",
    spine: "bg-pumpkin-900",
    spineText: "text-pumpkin-50",
    spineMuted: "text-pumpkin-200",
    rule: "border-pumpkin-900",
    name: "text-pumpkin-900",
    accent: "text-pumpkin-700",
    accentBorder: "border-pumpkin-700",
    strong: "text-pumpkin-800",
    noteRule: "border-pumpkin-300",
    noteNumber: "text-pumpkin-600",
  },
};
