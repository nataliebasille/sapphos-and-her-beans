"use client";

import { twMerge } from "tailwind-merge";
import { Heading } from "../_components/heading";
import { useProductList } from "../_stores/products";
import { ProductCard } from "./_components/product-card";

export default function ShopPage() {
  const products = useProductList();

  return (
    <div className="px-4 md:px-10">
      <div
        className={twMerge(
          "mb-5 border-b-[1px] border-black/30 md:col-span-2 md:mb-10",
        )}
      >
        <Heading
          level={3}
          className="mb-0 text-center uppercase tracking-wide md:text-left"
        >
          Coffee
        </Heading>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:gap-12 lg:grid-cols-3">
        {products.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
    </div>
  );
}
