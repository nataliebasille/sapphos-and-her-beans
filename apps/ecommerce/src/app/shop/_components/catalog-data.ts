import { products } from "@models";

/**
 * Pure catalog data helpers — no JSX, no hooks, no "use client" — so they can be
 * used from both client components (the catalog grid) and server components (the
 * individual coffee page).
 */

export type Coffee = products.Product;
export type CatalogCoffee = products.ProductWithVariants<Coffee>;

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
  return coffee.country ?? "Coffee";
}

export function tastingNotes(coffee: Coffee, max = 4): string[] {
  return (coffee.tastingNotes ?? "")
    .split(",")
    .map((n) => n.trim().replace(/^and\s+/i, ""))
    .filter(Boolean);
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

function toGroup(coffee: CatalogCoffee): OriginGroup {
  const sizes = products
    .resolveVariants(coffee)
    .sort((a, b) => SIZE_ORDER.indexOf(a.size) - SIZE_ORDER.indexOf(b.size));

  return {
    key: coffee.id,
    origin: originName(coffee),
    label: coffee.name,
    farm: coffee.farm,
    color: coffee.color,
    processing: coffee.processing,
    region: coffee.region,
    altitude: coffee.altitude,
    varietals: coffee.varietals,
    lot: coffee.lot,
    fermentation: coffee.fermentation,
    score: coffee.score,
    notes: tastingNotes(coffee, 4),
    traceable: coffee.traceable,
    isDecaf: coffee.isDecaf,
    sizes,
  };
}

/** One group per coffee, with its purchasable sizes resolved and ordered. */
export function toOriginGroups(coffees: CatalogCoffee[]): OriginGroup[] {
  return coffees.filter((coffee) => coffee.variants.length > 0).map(toGroup);
}

/** The origin group that contains the given size (variant) id, if any. */
export function groupForId(
  coffees: CatalogCoffee[],
  id: string,
): OriginGroup | undefined {
  return toOriginGroups(coffees).find((g) => g.sizes.some((s) => s.id === id));
}

/** Min–max price label for a group's sizes. */
export function priceRange(sizes: Coffee[]): string {
  const prices = sizes.map((s) => s.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? `$${min}` : `$${min}–$${max}`;
}
