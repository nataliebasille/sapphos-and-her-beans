"use client";

import { twMerge } from "tailwind-merge";
import { PageContainer } from "../_components/page-container";
import { Heading } from "../_components/heading";
import { ProductCard } from "./_components/product-card";
import { useProductListStore } from "../_stores/product-list-provider";

export default function ShopPage() {
  const products = useProductListStore((state) => state.products);

  return (
    <PageContainer className="px-10">
      <div
        className={twMerge(
          "mb-10 border-b-[1px] border-black/30 md:col-span-2",
        )}
      >
        <Heading
          level={3}
          className="mb-0 text-center uppercase tracking-wide md:text-left"
        >
          Coffee
        </Heading>
      </div>

      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
    </PageContainer>
  );
}
