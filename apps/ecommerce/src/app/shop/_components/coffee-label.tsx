"use client";

/**
 * Coffee-label primitives for the shop catalog and the individual coffee page.
 *
 * These re-tint the brand's signature product-label motifs (diamond-line origin
 * rule, size/price + score, spec grid, "traceable to" footer) onto the Winter
 * Frost / Deep Navy palette shared with the redesigned homepage. Pure data
 * helpers live in `catalog-data.ts` so the server coffee page can share them.
 */

import { twMerge } from "tailwind-merge";
import { accentFor, BRAND } from "~/app/(home)/_components/brand";
import { Eyebrow, useQuickAdd } from "~/app/(home)/_components/sections";
import { Plus } from "~/app/_components/icons/plus";
import { Check } from "~/app/_components/icons/check";
import {
  type Coffee,
  type OriginGroup,
  altitudeLabel,
  fermentationInfo,
  headerFermentKicker,
  sizeLabel,
} from "./catalog-data";

export { accentFor, Eyebrow };

/** Translucent accent for label tints (source accents are solid hex). */
function tint(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** One-click add for a single size — styled as an obvious add button. */
function SizeAddButton({ coffee }: { coffee: Coffee }) {
  const { added, add } = useQuickAdd(coffee.id);
  return (
    <button
      type="button"
      onClick={add}
      disabled={added}
      aria-label={`Add ${sizeLabel(coffee.size)} to cart`}
      className={twMerge(
        "group flex items-center gap-2 rounded-full border-2 py-1 pr-3.5 pl-1 transition-colors",
        added
          ? "border-[#3f8f6b] bg-[#3f8f6b] text-[#FAF9F8]"
          : "border-[#001F36] bg-white text-[#001F36] hover:bg-[#001F36] hover:text-[#FAF9F8]",
      )}
    >
      <span
        className={twMerge(
          "flex size-6 items-center justify-center rounded-full transition-colors",
          added
            ? "bg-white text-[#3f8f6b]"
            : "bg-[#001F36] text-[#FAF9F8] group-hover:bg-white group-hover:text-[#001F36]",
        )}
      >
        {added ? <Check className="size-4" /> : <Plus className="size-4" />}
      </span>
      <span className="text-xs font-bold tracking-wide uppercase">
        {added ? "Added" : sizeLabel(coffee.size)}
      </span>
      {!added && <span className="text-sm font-bold">${coffee.price}</span>}
    </button>
  );
}

/** Row of one-click add buttons — one per available size. */
export function SizeAddRow({
  sizes,
  className,
}: {
  sizes: Coffee[];
  className?: string;
}) {
  return (
    <div className={twMerge("flex flex-wrap gap-2", className)}>
      {sizes.map((s) => (
        <SizeAddButton key={s.id} coffee={s} />
      ))}
    </div>
  );
}

/**
 * Winter Frost page canvas. The shop routes are wrapped by the legacy pink
 * `PageContainer`; this cancels its top padding and repaints the surface in
 * Winter Frost so the catalog matches the redesigned homepage.
 */
export function FrostCanvas({ children }: { children: React.ReactNode }) {
  return (
    <div className="-mt-[calc(76px+1.5rem)] min-h-dvh bg-[#FAF9F8] pt-[calc(76px+1.5rem)]">
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Signature "coffee-label" motifs.
 * ------------------------------------------------------------------ */

/** The horizontal rule with a rotated-diamond node centered on it. */
function MotifRule() {
  return (
    <span className="relative h-[2px] flex-1 bg-[#001F36]">
      <span className="absolute top-1/2 left-1/2 aspect-square w-3.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border-2 border-[#001F36] bg-[#FAF9F8]" />
      <span className="absolute top-1/2 left-1/2 aspect-square w-1 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#001F36]" />
    </span>
  );
}

/** Origin name + lot flanked by the diamond-line motif. */
export function OriginMotif({
  origin,
  label,
  size = "md",
  className,
}: {
  origin: string;
  label: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const originSize =
    size === "lg"
      ? "text-3xl md:text-4xl"
      : size === "sm"
        ? "text-xl"
        : "text-2xl";
  return (
    <div className={twMerge("flex items-center gap-2.5", className)}>
      <MotifRule />
      <div className="flex flex-col items-center text-center text-[#001F36]">
        <span
          className={twMerge(
            "font-primary leading-none font-bold tracking-wide uppercase",
            originSize,
          )}
        >
          {origin}
        </span>
        <span className="font-primary mt-0.5 text-xs leading-tight tracking-wider">
          {label}
        </span>
      </div>
      <MotifRule />
    </div>
  );
}

/** Airy price label in the brand primary font. Accepts a range string. */
export function PriceTag({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <span
      className={twMerge(
        "font-primary text-2xl font-bold tracking-wide text-[#001F36]",
        className,
      )}
    >
      {text}
    </span>
  );
}

/** "{score} pts" badge in the brand primary font. */
export function ScoreBadge({
  score,
  className,
}: {
  score: number;
  className?: string;
}) {
  return (
    <span
      className={twMerge(
        "font-primary inline-flex flex-col items-center leading-none text-[#001F36]",
        className,
      )}
    >
      <span className="text-xl font-bold tracking-widest">{score}</span>
      <span className="text-[10px] tracking-[0.2em] uppercase">pts</span>
    </span>
  );
}

/** The fermentation kicker + processing pair shown in the label header. */
export function ProcessLine({ group }: { group: OriginGroup }) {
  const kicker = headerFermentKicker(group);
  if (!kicker && !group.processing) return null;
  return (
    <div className="flex flex-col items-center gap-0.5 leading-tight">
      {kicker ? (
        <span className="text-[10px] font-semibold tracking-[0.2em] text-[#001F36]/55 uppercase">
          {kicker}
        </span>
      ) : null}
      {group.processing ? (
        <span className="text-center text-xs font-bold tracking-[0.08em] text-[#001F36]/80 uppercase">
          {group.processing}
        </span>
      ) : null}
    </div>
  );
}

/** The mono-uppercase spec table — label column navy, value column accent-tinted. */
export function SpecGrid({
  group,
  accent,
  className,
}: {
  group: OriginGroup;
  accent: string;
  className?: string;
}) {
  const ferment = fermentationInfo(group.fermentation);
  // Process is surfaced in the label header by default, so it's omitted here.
  const rows: [string, string | undefined][] = [
    ferment ? ["Fermentation", ferment.value] : ["", undefined],
    ["Lot", group.lot],
    ["Region", group.region],
    ["Varietals", group.varietals],
    ["Altitude", altitudeLabel(group.altitude) ?? undefined],
  ];
  const visible = rows.filter(([label, value]) => label && value);

  return (
    <dl
      className={twMerge(
        "grid grid-cols-[max-content_1fr] gap-px overflow-hidden rounded-lg text-sm",
        className,
      )}
      style={{ backgroundColor: tint(BRAND.navy, 0.18) }}
    >
      {visible.map(([label, value]) => (
        <div key={label} className="col-span-2 grid grid-cols-subgrid gap-px">
          <dt className="flex items-center justify-end bg-[#001F36] px-2.5 py-1 text-right font-mono text-[10px] font-bold tracking-wide text-[#FAF9F8] uppercase">
            {label}
          </dt>
          <dd
            className="flex items-center px-2.5 py-1 text-[13px] font-semibold tracking-wide text-[#001F36]"
            style={{ backgroundColor: tint(accent, 0.22) }}
          >
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** "Traceable to {n}" italic serif footer. */
export function TraceableFooter({
  traceable,
  className,
}: {
  traceable: string;
  className?: string;
}) {
  return (
    <p
      className={twMerge(
        "font-serif text-xs font-bold tracking-wider text-[#001F36]/70 italic",
        className,
      )}
    >
      Traceable to {traceable}
    </p>
  );
}

/**
 * Collapsed-by-default "Details" disclosure: keeps the full spec grid +
 * traceable footer available without letting them dominate the card height.
 */
export function SpecDetails({
  group,
  accent,
  open,
  onToggle,
  className,
}: {
  group: OriginGroup;
  accent: string;
  open: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between border-t border-[#001F36]/10 pt-2 text-[11px] font-semibold tracking-[0.18em] text-[#001F36]/60 uppercase transition-colors outline-none hover:text-[#001F36] focus:outline-none focus-visible:outline-none"
      >
        {open ? "Hide details" : "Details"}
        <svg
          viewBox="0 0 12 12"
          fill="none"
          className={twMerge("size-3 transition-transform", open && "rotate-180")}
        >
          <path
            d="M2.5 4.5 6 8l3.5-3.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open ? (
        <div className="mt-2 flex flex-col gap-2">
          <SpecGrid group={group} accent={accent} />
          <TraceableFooter traceable={group.traceable} className="text-right" />
        </div>
      ) : null}
    </div>
  );
}
