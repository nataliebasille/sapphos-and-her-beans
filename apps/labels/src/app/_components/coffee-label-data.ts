import type { CSSProperties } from "react";
import twColors from "tailwindcss/colors";
import * as products from "../../../../../lib/models/products";
import tailwindConfig from "../../../tailwind.config";

export type CoffeeKey = {
  [K in keyof typeof products]: (typeof products)[K] extends (
    { type: "coffee" }
  ) ?
    K
  : never;
}[keyof typeof products];

export type Coffee = (typeof products)[CoffeeKey];

const COFFEE_KEYS = (Object.keys(products) as (keyof typeof products)[]).filter(
  (k): k is CoffeeKey => {
    const value = products[k] as unknown;
    return (
      typeof value === "object" &&
      value !== null &&
      "type" in value &&
      value.type === "coffee"
    );
  },
);

/** Only coffees currently for sale get labels. */
export const ACTIVE_COFFEE_KEYS = COFFEE_KEYS.filter((k) => products[k].active);

export const getCoffee = (key: CoffeeKey): Coffee => products[key];

type Shades = Record<
  | "50"
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900"
  | "950",
  string
>;

const customColors = tailwindConfig.theme?.extend?.colors as Record<
  string,
  Shades
>;

/**
 * Exposes the coffee's colour ramp as `--c50` … `--c950` so the label can use
 * `bg-[var(--c900)]` etc. (coffee colours are data, so they can't be static Tailwind classes).
 */
export function paletteVars(color: Coffee["color"]): CSSProperties {
  const shades =
    color === "navy" || color === "pumpkin" ?
      customColors[color]
    : (twColors[color] as Shades);
  return Object.fromEntries(
    Object.entries(shades).map(([k, v]) => [`--c${k}`, v]),
  ) as CSSProperties;
}

// Same kicker/value wording as the shop card (apps/ecommerce/src/app/shop/_components/coffee-card.tsx).
export function fermentationInfo(
  coffee: Coffee,
): { kicker: string; value: string; anaerobic: boolean } | undefined {
  if (!("fermentation" in coffee) || !coffee.fermentation) return undefined;
  const f = coffee.fermentation;
  if (typeof f === "string")
    return { kicker: "Fermentation", value: f, anaerobic: false };
  if (f.type === "cofermentation")
    return { kicker: "Co-Fermentation", value: f.ingredient, anaerobic: false };
  return {
    kicker: "Anaerobic",
    value: f.duration ?? "Anaerobic",
    anaerobic: true,
  };
}

// Same splitting as the shop (apps/ecommerce/src/app/shop/_components/catalog-data.ts).
export function tastingNotes(coffee: Coffee): string[] {
  return (coffee.tastingNotes ?? "")
    .split(",")
    .map((n) => n.trim().replace(/^and\s+/i, ""))
    .filter(Boolean);
}

// Labels follow the shop's "Processing" + coffee passport spec rows.
export function detailRows(coffee: Coffee): [label: string, value: string][] {
  const rows: [string, string | undefined][] = [
    ["Farm", coffee.farm],
    ["Processing", coffee.processing],
    ["Varietals", coffee.varietals],
    ["Altitude", "altitude" in coffee ? coffee.altitude : undefined],
    ["Region", coffee.region?.trim()],
    ["Lot", coffee.lot],
  ];
  return rows.filter((r): r is [string, string] => Boolean(r[1]));
}

export const score = (coffee: Coffee) =>
  "score" in coffee ? coffee.score : undefined;
