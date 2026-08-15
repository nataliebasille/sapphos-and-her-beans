"use client";

/** PROTOTYPE — throwaway. Baseline: the current coffee-list grid, for comparison. */

import { twMerge } from "tailwind-merge";
import { type products } from "@models";
import { Heading } from "~/app/_components/heading";
import { ProductCard } from "~/app/_components/product-card";

export const CURRENT_NAME = "Current grid";

export function CurrentDesign({
  products: list,
}: {
  products: products.Product[];
}) {
  return (
    <div className="px-4 md:px-10">
      <div
        className={twMerge(
          "mb-5 border-b-[1px] border-black/30 md:col-span-2 md:mb-10",
        )}
      >
        <Heading
          level={3}
          className="mb-0 text-center tracking-wide uppercase md:text-left"
        >
          Coffee
        </Heading>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-12 lg:grid-cols-3">
        {list.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
