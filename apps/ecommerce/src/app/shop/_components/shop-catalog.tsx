"use client";

/**
 * Shop catalog — the coffee list on `/shop`. Renders one "mini passport" card
 * per coffee; each links through to the full coffee page at /shop/[id].
 */

import { useMemo } from "react";
import { useProductList } from "~/app/_stores/products";
import { groupByOrigin } from "./catalog-data";
import { CoffeeCard } from "./coffee-card";
import { Eyebrow, FrostCanvas } from "./coffee-label";

export function ShopCatalog() {
  const products = useProductList();
  const groups = useMemo(() => groupByOrigin(products), [products]);

  return (
    <FrostCanvas>
      <div className="mx-auto max-w-6xl px-6 pb-24 md:px-10">
        <header className="border-b border-[#001F36]/10 pt-6 pb-10 md:pt-8 md:pb-14">
          <Eyebrow className="text-accent-700">Shop Coffee</Eyebrow>
          <h1 className="font-primary text-primary-800 mt-3 text-3xl! leading-tight font-semibold tracking-tight md:text-4xl!">
            Every lot, in season.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed tracking-wide text-[#001F36]/70">
            Direct-trade single origins, each traceable to the people who grew
            it. Choose a size and it&apos;s in your bag.
          </p>
        </header>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((g) => (
            <CoffeeCard key={g.key} group={g} />
          ))}
        </div>
      </div>
    </FrostCanvas>
  );
}
