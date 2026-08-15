"use client";

/**
 * PROTOTYPE — throwaway. Shared helpers for the coffee-list redesign variants.
 *
 * The full literal color-class strings below exist so Tailwind v4 generates
 * every shade the variants use (dynamic `bg-${color}-700` strings would NOT be
 * picked up by the scanner otherwise).
 */

import { useCallback, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Check } from "~/app/_components/icons/check";
import { Plus } from "~/app/_components/icons/plus";
import { useAddToCart } from "~/app/_stores/cart";
import { type products } from "@models";

export type CoffeeColor = products.Product["color"];

export const COLORS = {
  cyan: {
    bg50: "bg-cyan-50",
    bg100: "bg-cyan-100",
    bg200: "bg-cyan-200",
    bg700: "bg-cyan-700",
    bg900: "bg-cyan-900",
    bg950: "bg-cyan-950",
    text50: "text-cyan-50",
    text700: "text-cyan-700",
    text800: "text-cyan-800",
    text900: "text-cyan-900",
    text950: "text-cyan-950",
    border200: "border-cyan-200",
    border700: "border-cyan-700",
    border900: "border-cyan-900",
    border950: "border-cyan-950",
    ring: "ring-cyan-900",
  },
  sky: {
    bg50: "bg-sky-50",
    bg100: "bg-sky-100",
    bg200: "bg-sky-200",
    bg700: "bg-sky-700",
    bg900: "bg-sky-900",
    bg950: "bg-sky-950",
    text50: "text-sky-50",
    text700: "text-sky-700",
    text800: "text-sky-800",
    text900: "text-sky-900",
    text950: "text-sky-950",
    border200: "border-sky-200",
    border700: "border-sky-700",
    border900: "border-sky-900",
    border950: "border-sky-950",
    ring: "ring-sky-900",
  },
  yellow: {
    bg50: "bg-yellow-50",
    bg100: "bg-yellow-100",
    bg200: "bg-yellow-200",
    bg700: "bg-yellow-700",
    bg900: "bg-yellow-900",
    bg950: "bg-yellow-950",
    text50: "text-yellow-50",
    text700: "text-yellow-700",
    text800: "text-yellow-800",
    text900: "text-yellow-900",
    text950: "text-yellow-950",
    border200: "border-yellow-200",
    border700: "border-yellow-700",
    border900: "border-yellow-900",
    border950: "border-yellow-950",
    ring: "ring-yellow-900",
  },
  rose: {
    bg50: "bg-rose-50",
    bg100: "bg-rose-100",
    bg200: "bg-rose-200",
    bg700: "bg-rose-700",
    bg900: "bg-rose-900",
    bg950: "bg-rose-950",
    text50: "text-rose-50",
    text700: "text-rose-700",
    text800: "text-rose-800",
    text900: "text-rose-900",
    text950: "text-rose-950",
    border200: "border-rose-200",
    border700: "border-rose-700",
    border900: "border-rose-900",
    border950: "border-rose-950",
    ring: "ring-rose-900",
  },
  slate: {
    bg50: "bg-slate-50",
    bg100: "bg-slate-100",
    bg200: "bg-slate-200",
    bg700: "bg-slate-700",
    bg900: "bg-slate-900",
    bg950: "bg-slate-950",
    text50: "text-slate-50",
    text700: "text-slate-700",
    text800: "text-slate-800",
    text900: "text-slate-900",
    text950: "text-slate-950",
    border200: "border-slate-200",
    border700: "border-slate-700",
    border900: "border-slate-900",
    border950: "border-slate-950",
    ring: "ring-slate-900",
  },
  purple: {
    bg50: "bg-purple-50",
    bg100: "bg-purple-100",
    bg200: "bg-purple-200",
    bg700: "bg-purple-700",
    bg900: "bg-purple-900",
    bg950: "bg-purple-950",
    text50: "text-purple-50",
    text700: "text-purple-700",
    text800: "text-purple-800",
    text900: "text-purple-900",
    text950: "text-purple-950",
    border200: "border-purple-200",
    border700: "border-purple-700",
    border900: "border-purple-900",
    border950: "border-purple-950",
    ring: "ring-purple-900",
  },
  amber: {
    bg50: "bg-amber-50",
    bg100: "bg-amber-100",
    bg200: "bg-amber-200",
    bg700: "bg-amber-700",
    bg900: "bg-amber-900",
    bg950: "bg-amber-950",
    text50: "text-amber-50",
    text700: "text-amber-700",
    text800: "text-amber-800",
    text900: "text-amber-900",
    text950: "text-amber-950",
    border200: "border-amber-200",
    border700: "border-amber-700",
    border900: "border-amber-900",
    border950: "border-amber-950",
    ring: "ring-amber-900",
  },
  emerald: {
    bg50: "bg-emerald-50",
    bg100: "bg-emerald-100",
    bg200: "bg-emerald-200",
    bg700: "bg-emerald-700",
    bg900: "bg-emerald-900",
    bg950: "bg-emerald-950",
    text50: "text-emerald-50",
    text700: "text-emerald-700",
    text800: "text-emerald-800",
    text900: "text-emerald-900",
    text950: "text-emerald-950",
    border200: "border-emerald-200",
    border700: "border-emerald-700",
    border900: "border-emerald-900",
    border950: "border-emerald-950",
    ring: "ring-emerald-900",
  },
} as const satisfies Record<CoffeeColor, Record<string, string>>;

export function useAddedToCart(id: string) {
  const addToCart = useAddToCart();
  const [added, setAdded] = useState(false);

  const add = useCallback(() => {
    addToCart(`${id}`, { quantity: 1 });
    setAdded(true);
  }, [addToCart, id]);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 2000);
    return () => clearTimeout(t);
  }, [added]);

  return { added, add };
}

export function AddToCartButton({
  coffee,
  className,
  compact = false,
}: {
  coffee: products.Product;
  className?: string;
  compact?: boolean;
}) {
  const { added, add } = useAddedToCart(coffee.id);
  return (
    <button
      type="button"
      onClick={add}
      disabled={added}
      className={twMerge(
        "btn-solid/primary flex items-center justify-center tracking-wider uppercase",
        compact ? "btn-size-sm px-3" : "btn-size-sm w-full",
        added && "!bg-[#4BB543]",
        className,
      )}
    >
      {added ?
        <>
          <Check className={compact ? "size-5 pr-1" : "size-6 pr-2"} /> added
        </>
      : <>
          <Plus className={compact ? "size-5 pr-1" : "size-6 pr-2"} />{" "}
          {compact ? "add" : "add to cart"}
        </>
      }
    </button>
  );
}

/** Human label for the size field. */
export function sizeLabel(size: products.Product["size"]) {
  return size === "singleserve" ? "single serve" : size;
}

/**
 * Self-contained checkbox that ignores the app's global input styling
 * (Preflight/natcore stretch a raw `<input type=checkbox>` into a pill). The
 * native input is kept but visually hidden; the box + check are drawn by us.
 */
export function CheckboxField({
  checked,
  onChange,
  label,
  className,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      className={twMerge(
        "flex flex-row cursor-pointer items-center gap-2.5 text-sm text-primary-900 select-none",
        className,
      )}
    >
      <span className="relative inline-flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border border-primary-950/40 bg-white">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer absolute inset-0 z-10 m-0 size-full cursor-pointer appearance-none rounded-[5px] opacity-0"
        />
        <span className="pointer-events-none absolute inset-0 rounded-[4px] bg-primary-950 opacity-0 transition-opacity peer-checked:opacity-100" />
        <svg
          viewBox="0 0 12 12"
          fill="none"
          className="pointer-events-none relative z-20 size-3 text-white opacity-0 transition-opacity peer-checked:opacity-100"
        >
          <path
            d="M2 6.2 4.6 8.8 10 3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span>{label}</span>
    </label>
  );
}
