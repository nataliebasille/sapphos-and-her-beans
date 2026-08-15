"use client";

/**
 * PROTOTYPE — throwaway. Shared helpers for the coffee-list redesign variants.
 *
 * These variants adopt the `new-ui` design system (Winter Frost canvas, Deep
 * Navy anchor, muted earthy per-coffee accents) so the shop page matches the
 * redesigned homepage. Brand tokens + helpers are reused from the home build.
 */

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { type products } from "@models";
import { accentFor, BRAND } from "~/app/(home)/_components/brand";
import { BrandingStylizedFont } from "~/app/fonts";
import {
  type Coffee,
  Eyebrow,
  originName,
  tastingNotes,
  useQuickAdd,
} from "~/app/(home)/_components/sections";

export { accentFor, BRAND, Eyebrow, originName, tastingNotes, useQuickAdd };
export type { Coffee };

export const FROST = BRAND.frost;
export const NAVY = BRAND.navy;

/** Translucent accent for label tints (source accents are solid hex). */
export function tint(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function sizeLabel(size: products.Product["size"]) {
  return size === "singleserve" ? "Single Serve" : size;
}

/** Source altitude data is inconsistent ("1200 - 1450" vs "2125 meters"). */
export function altitudeLabel(altitude?: string): string | null {
  if (!altitude) return null;
  const trimmed = altitude.trim();
  return /m(eters?)?$/i.test(trimmed) ? trimmed : `${trimmed}m`;
}

export type OriginGroup = {
  key: string;
  origin: string;
  label: string;
  farm: string;
  color: string;
  processing?: string;
  region?: string;
  altitude?: string;
  varietals?: string;
  lot?: string;
  fermentation?: Coffee["fermentation"];
  score?: number;
  notes: string[];
  traceable: string;
  isDecaf: boolean;
  sizes: Coffee[];
};

const SIZE_ORDER = ["250g", "100g", "singleserve"];

/** Base product name with the trailing size segment removed. */
function baseName(p: Coffee): string {
  const parts = (p.name ?? "").split(" - ");
  return parts.length >= 2 ? parts.slice(0, -1).join(" - ") : `${p.farm}`;
}

/** The distinguishing lot label (name minus country + size), else the farm. */
function lotLabel(p: Coffee): string {
  const parts = (p.name ?? "").split(" - ");
  if (parts.length >= 3) return parts.slice(1, -1).join(" - ");
  return p.farm;
}

/** Collapse per-size SKUs into one card per distinct coffee. */
export function groupByOrigin(list: Coffee[]): OriginGroup[] {
  const map = new Map<string, OriginGroup>();
  for (const p of list) {
    const key = baseName(p);
    let g = map.get(key);
    if (!g) {
      g = {
        key,
        origin: originName(p),
        label: lotLabel(p),
        farm: p.farm,
        color: p.color,
        processing: p.processing,
        region: p.region,
        altitude: p.altitude,
        varietals: p.varietals,
        lot: p.lot,
        fermentation: p.fermentation,
        score: p.score,
        notes: tastingNotes(p, 4),
        traceable: p.traceable,
        isDecaf: p.isDecaf,
        sizes: [],
      };
      map.set(key, g);
    }
    g.sizes.push(p);
  }
  for (const g of map.values()) {
    g.sizes.sort(
      (a, b) => SIZE_ORDER.indexOf(a.size) - SIZE_ORDER.indexOf(b.size),
    );
  }
  return [...map.values()];
}

/** Navy pill add-to-cart, matching the homepage FeaturedCard. */
export function AddButton({
  coffee,
  size = "md",
  className,
}: {
  coffee: Coffee;
  size?: "sm" | "md";
  className?: string;
}) {
  const { added, add } = useQuickAdd(coffee.id);
  return (
    <button
      type="button"
      onClick={add}
      disabled={added}
      className={twMerge(
        "rounded-full font-semibold tracking-[0.1em] text-[#FAF9F8] uppercase transition-colors",
        size === "sm" ? "px-4 py-2 text-xs" : "px-5 py-2.5 text-[13px]",
        added ? "bg-[#3f8f6b]" : "bg-[#001F36] hover:bg-[#001F36]/85",
        className,
      )}
    >
      {added ? "Added ✓" : "Add"}
    </button>
  );
}

/** Selectable size chips; returns the currently selected SKU via render prop. */
export function useSizeSelection(group: OriginGroup) {
  const [selected, setSelected] = useState<Coffee>(group.sizes[0]!);
  return { selected, setSelected };
}

export function SizePills({
  group,
  selected,
  onSelect,
  className,
}: {
  group: OriginGroup;
  selected: Coffee;
  onSelect: (c: Coffee) => void;
  className?: string;
}) {
  return (
    <div className={twMerge("flex flex-wrap gap-1.5", className)}>
      {group.sizes.map((s) => {
        const active = s.id === selected.id;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(s)}
            className={twMerge(
              "rounded-full border px-3 py-1 text-xs font-semibold tracking-wide transition-colors",
              active
                ? "border-[#001F36] bg-[#001F36] text-[#FAF9F8]"
                : "border-[#001F36]/20 text-[#001F36]/80 hover:border-[#001F36]/50",
            )}
          >
            {sizeLabel(s.size)}
          </button>
        );
      })}
    </div>
  );
}

/** Pink tasting-note chips, matching the homepage. */
export function NoteChips({
  notes,
  className,
}: {
  notes: string[];
  className?: string;
}) {
  return (
    <div className={twMerge("flex flex-wrap gap-1.5", className)}>
      {notes.map((n) => (
        <span
          key={n}
          className="rounded-full bg-[#F8DCDF]/60 px-2.5 py-1 text-xs text-[#001F36]/80"
        >
          {n}
        </span>
      ))}
    </div>
  );
}

/** Shared page shell: Winter Frost canvas that covers the legacy pink container. */
export function ShopCanvas({ children }: { children: React.ReactNode }) {
  return (
    <div className="-mt-[calc(76px+1.5rem)] min-h-dvh bg-[#FAF9F8] pt-[calc(76px+1.5rem)]">
      {children}
    </div>
  );
}

/* ================================================================== *
 * Signature "coffee-label" motifs — carried over from the original
 * product card, re-tinted onto the Winter Frost / navy palette.
 * ================================================================== */

/** The horizontal rule with a rotated-diamond node (one side of the motif). */
function MotifRule({ flip }: { flip?: boolean }) {
  return (
    <span className="relative h-[2px] flex-1 bg-[#001F36]">
      <span
        className={twMerge(
          "absolute top-1/2 aspect-square w-3.5 -translate-y-1/2 rotate-45 border-2 border-[#001F36] bg-[#FAF9F8]",
          flip ? "right-0 translate-x-1/2" : "left-0 -translate-x-1/2",
        )}
      />
      <span
        className={twMerge(
          "absolute top-1/2 aspect-square w-1 -translate-y-1/2 rotate-45 bg-[#001F36]",
          flip ? "right-0 translate-x-1/2" : "left-0 -translate-x-1/2",
        )}
      />
    </span>
  );
}

/** Origin name + farm flanked by the diamond-line motif, in MedievalSharp. */
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
    size === "lg" ? "text-3xl" : size === "sm" ? "text-xl" : "text-2xl";
  return (
    <div className={twMerge("flex items-center gap-2.5", className)}>
      <MotifRule />
      <div className="flex flex-col items-center text-center text-[#001F36]">
        <span
          className={twMerge(
            "leading-none font-bold tracking-wide uppercase",
            originSize,
            BrandingStylizedFont.className,
          )}
        >
          {origin}
        </span>
        <span
          className={twMerge(
            "mt-0.5 text-xs leading-tight tracking-wider",
            BrandingStylizedFont.className,
          )}
        >
          {label}
        </span>
      </div>
      <MotifRule flip />
    </div>
  );
}

/** Airy size + price label in MedievalSharp — no box, no fill. */
export function SizePriceBadge({
  size,
  price,
  className,
}: {
  size: string;
  price: number;
  className?: string;
}) {
  return (
    <span className={twMerge("inline-flex items-baseline gap-2", className)}>
      <span
        className={twMerge(
          "text-2xl font-bold tracking-wide text-[#001F36]",
          BrandingStylizedFont.className,
        )}
      >
        ${price}
      </span>
      <span className="text-[11px] font-semibold tracking-[0.18em] text-[#001F36]/55 uppercase">
        {sizeLabel(size)}
      </span>
    </span>
  );
}

/** "{score} pts" badge in MedievalSharp. */
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
        "inline-flex flex-col items-center leading-none text-[#001F36]",
        BrandingStylizedFont.className,
        className,
      )}
    >
      <span className="text-xl font-bold tracking-widest">{score}</span>
      <span className="text-[10px] tracking-[0.2em] uppercase">pts</span>
    </span>
  );
}

/** Human-readable fermentation value + kicker, from the original card logic. */
export function fermentationInfo(f: Coffee["fermentation"]): {
  kicker?: string;
  value: string;
} | null {
  if (!f) return null;
  if (typeof f === "string") return { value: f };
  if (f.type === "cofermentation")
    return { kicker: "Co-fermented", value: f.ingredient };
  return { kicker: "Anaerobic", value: f.duration ?? "Anaerobic" };
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
  // Process is surfaced in the card header by default, so it's omitted here.
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
        "font-serif text-sm font-bold tracking-wider text-[#001F36]/75 italic",
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
  className,
}: {
  group: OriginGroup;
  accent: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between border-t border-[#001F36]/10 pt-2 text-[11px] font-semibold tracking-[0.18em] text-[#001F36]/60 uppercase transition-colors hover:text-[#001F36]"
      >
        {open ? "Hide details" : "Details"}
        <svg
          viewBox="0 0 12 12"
          fill="none"
          className={twMerge(
            "size-3 transition-transform",
            open && "rotate-180",
          )}
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

