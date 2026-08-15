"use client";

/**
 * PROTOTYPE — throwaway. Floating variant switcher for the coffee-list redesign.
 *
 * Renders the selected variant (gated by `?variant=`) plus a fixed bottom-center
 * bar to cycle between them. Hidden entirely in production builds.
 */

import { useCallback, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { products as models, type products } from "@models";
import { useProductList } from "~/app/_stores/products";
import { VariantA, VARIANT_A_NAME } from "./variant-a";
import { VariantB, VARIANT_B_NAME } from "./variant-b";
import { VariantC, VARIANT_C_NAME } from "./variant-c";
import { CurrentDesign, CURRENT_NAME } from "./variant-current";

type VariantKey = "current" | "A" | "B" | "C";

const VARIANTS: {
  key: VariantKey;
  name: string;
  Component: (props: { products: products.Product[] }) => React.ReactNode;
}[] = [
  { key: "current", name: CURRENT_NAME, Component: CurrentDesign },
  { key: "A", name: VARIANT_A_NAME, Component: VariantA },
  { key: "B", name: VARIANT_B_NAME, Component: VariantB },
  { key: "C", name: VARIANT_C_NAME, Component: VariantC },
];

function normalize(raw: string | null): VariantKey {
  const match = VARIANTS.find((v) => v.key.toLowerCase() === raw?.toLowerCase());
  return match?.key ?? "current";
}

export function CoffeeListPrototype() {
  const fetched = useProductList();
  // PROTOTYPE: fall back to the in-memory catalog so the redesign renders with
  // real density even without Stripe/DB configured locally.
  const products = fetched.length ? fetched : (models.PRODUCTS as unknown as products.Product[]);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const current = normalize(searchParams.get("variant"));
  const index = VARIANTS.findIndex((v) => v.key === current);
  const active = VARIANTS[index]!;

  const go = useCallback(
    (dir: 1 | -1) => {
      const next = VARIANTS[(index + dir + VARIANTS.length) % VARIANTS.length]!;
      const params = new URLSearchParams(searchParams.toString());
      params.set("variant", next.key);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [index, pathname, router, searchParams],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      if (
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el instanceof HTMLElement && el.isContentEditable)
      ) {
        return;
      }
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const ActiveComponent = active.Component;

  return (
    <>
      <ActiveComponent products={products} />
      {process.env.NODE_ENV !== "production" && (
        <div className="fixed bottom-5 left-1/2 z-[100] -translate-x-1/2">
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-slate-900 py-1.5 pr-2 pl-1.5 text-white shadow-2xl ring-1 ring-black/20">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous variant"
              className="flex size-9 items-center justify-center rounded-full text-xl transition-colors hover:bg-white/15"
            >
              ‹
            </button>
            <div className="flex min-w-[190px] flex-col items-center px-3 leading-tight">
              <span className="font-mono text-[10px] tracking-[0.25em] text-white/50 uppercase">
                prototype · {index + 1}/{VARIANTS.length}
              </span>
              <span className="text-sm font-semibold tracking-wide">
                {active.key === "current" ? "Current" : active.key} —{" "}
                {active.name}
              </span>
            </div>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next variant"
              className={twMerge(
                "flex size-9 items-center justify-center rounded-full text-xl transition-colors hover:bg-white/15",
              )}
            >
              ›
            </button>
          </div>
        </div>
      )}
    </>
  );
}
