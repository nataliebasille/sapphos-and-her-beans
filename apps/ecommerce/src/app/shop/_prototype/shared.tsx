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
