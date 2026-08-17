import { type products } from "@models";

/**
 * Pure catalog data helpers — no JSX, no hooks, no "use client" — so they can be
 * used from both client components (the catalog grid) and server components (the
 * individual coffee page).
 */

export type Coffee = products.Product;

export type OriginGroup = {
  key: string;
  origin: string;
  label: string;
  farm: string;
  color: Coffee["color"];
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

export function originName(coffee: Coffee): string {
  return coffee.country ?? coffee.name?.split(" - ")[0] ?? "Coffee";
}

export function tastingNotes(coffee: Coffee, max = 4): string[] {
  return (coffee.tastingNotes ?? "")
    .split(",")
    .map((n) => n.trim())
    .filter(Boolean)
    .slice(0, max);
}

export function sizeLabel(size: Coffee["size"]): string {
  return size === "singleserve" ? "Single Serve" : size;
}

/** Source altitude data is inconsistent ("1200 - 1450" vs "2125 meters"). */
export function altitudeLabel(altitude?: string): string | null {
  if (!altitude) return null;
  const trimmed = altitude.trim();
  return /m(eters?)?$/i.test(trimmed) ? trimmed : `${trimmed}m`;
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

/**
 * Fermentation kicker for the label header — but only when it isn't already
 * spelled out in the origin label (e.g. "Co-fermented with Wine Yeast / Lychee").
 */
export function headerFermentKicker(group: OriginGroup): string | null {
  const f = fermentationInfo(group.fermentation);
  if (!f?.kicker) return null;
  if (group.label.toLowerCase().includes(f.kicker.toLowerCase())) return null;
  return f.kicker;
}

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

function toGroup(p: Coffee): OriginGroup {
  return {
    key: baseName(p),
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
}

function sortSizes(group: OriginGroup): void {
  group.sizes.sort(
    (a, b) => SIZE_ORDER.indexOf(a.size) - SIZE_ORDER.indexOf(b.size),
  );
}

/** Collapse per-size SKUs into one group per distinct coffee. */
export function groupByOrigin(list: Coffee[]): OriginGroup[] {
  const map = new Map<string, OriginGroup>();
  for (const p of list) {
    const key = baseName(p);
    let g = map.get(key);
    if (!g) {
      g = toGroup(p);
      map.set(key, g);
    }
    g.sizes.push(p);
  }
  for (const g of map.values()) sortSizes(g);
  return [...map.values()];
}

/** The origin group that contains the given product id, if any. */
export function groupForId(
  list: Coffee[],
  id: string,
): OriginGroup | undefined {
  return groupByOrigin(list).find((g) => g.sizes.some((s) => s.id === id));
}

/** Min–max price label for a group's sizes. */
export function priceRange(sizes: Coffee[]): string {
  const prices = sizes.map((s) => s.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? `$${min}` : `$${min}–$${max}`;
}
