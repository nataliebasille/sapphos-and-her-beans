// PROTOTYPE — throwaway helpers shared by the label design variants.
// Question: "What should the new 4x6in coffee bag label look like?"
import twColors from "tailwindcss/colors";
import { twMerge } from "tailwind-merge";
import type { CSSProperties, PropsWithChildren } from "react";
import {
  Antic,
  Courier_Prime,
  MedievalSharp,
  Montserrat,
  Noto_Sans,
} from "next/font/google";
import * as products from "../../../../../lib/models/products";
import tailwindConfig from "../../../tailwind.config";

export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "800", "900"],
});
export const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});
export const antic = Antic({ subsets: ["latin"], weight: "400" });
export const medievalSharp = MedievalSharp({
  subsets: ["latin"],
  weight: "400",
});
export const courierPrime = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const BRAND = {
  navy: "#001F36",
  pink: "#F8DCDF",
  peach: "#EFAA9C",
  peachyPink: "#E8ABB0",
  frost: "#FAF9F8",
} as const;

export type CoffeeKey = {
  [K in keyof typeof products]: (typeof products)[K] extends (
    { type: "coffee" }
  ) ?
    K
  : never;
}[keyof typeof products];

export type Coffee = (typeof products)[CoffeeKey];

export const COFFEE_KEYS = (
  Object.keys(products) as (keyof typeof products)[]
).filter((k): k is CoffeeKey => {
  const value = products[k] as unknown;
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    value.type === "coffee"
  );
});

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

export function shades(color: Coffee["color"]): Shades {
  if (color === "navy" || color === "pumpkin") return customColors[color];
  return twColors[color] as Shades;
}

/** Inline CSS vars `--c50` … `--c950` for the coffee's colour, usable as `bg-[var(--c900)]`. */
export function paletteVars(color: Coffee["color"]): CSSProperties {
  const s = shades(color);
  return Object.fromEntries(
    Object.entries(s).map(([k, v]) => [`--c${k}`, v]),
  ) as CSSProperties;
}

// Mirrors the shop card's fermentation kicker/value (apps/ecommerce/src/app/shop/_components/coffee-card.tsx).
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

export function fermentationText(coffee: Coffee): string | undefined {
  if (!("fermentation" in coffee) || !coffee.fermentation) return undefined;
  const f = coffee.fermentation;
  if (typeof f === "string") return f;
  if (f.type === "cofermentation") return `Co-fermented with ${f.ingredient}`;
  return f.duration ? `Anaerobic · ${f.duration}` : "Anaerobic";
}

export function tastingNotes(coffee: Coffee): string[] {
  return (coffee.tastingNotes ?? "")
    .split(",")
    .map((n) => n.trim().replace(/^and\s+/i, ""))
    .filter(Boolean);
}

// Same labels/order as the shop: "Processing" (card) then the passport spec rows.
export function detailRows(coffee: Coffee): [string, string][] {
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
export const callout = (coffee: Coffee) =>
  "callout" in coffee ? coffee.callout : undefined;

/** The white-on-black logo recoloured via a luminance mask. */
export function Logo({
  color,
  className,
  style,
}: {
  color: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      role="img"
      aria-label="Sappho & her beans coffee"
      className={className}
      style={{
        backgroundColor: color,
        maskImage: "url('/sappho_logo.png')",
        maskMode: "luminance",
        maskSize: "175%",
        maskPosition: "center 52%",
        maskRepeat: "no-repeat",
        ...style,
      }}
    />
  );
}

export function QrCode({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <img
      src="/site qr code.png"
      alt="qr-code"
      className={className}
      style={{ imageRendering: "pixelated", ...style }}
    />
  );
}

export function LabelFrame({
  children,
  style,
  className,
}: PropsWithChildren<{ style?: CSSProperties; className?: string }>) {
  return (
    <div
      className={twMerge(
        "relative h-[6in] w-[4in] shrink-0 overflow-hidden shadow-xl",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
