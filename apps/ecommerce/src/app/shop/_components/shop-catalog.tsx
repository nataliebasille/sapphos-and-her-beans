"use client";

/**
 * Shop catalog — the coffee list on `/shop`. Renders one label card per coffee
 * on the Winter Frost canvas. The "Details" disclosure is shared across cards so
 * the whole grid expands/collapses together and rows stay aligned.
 */

import { useMemo, useState } from "react";
import { useProductList } from "~/app/_stores/products";
import { CoffeeCard } from "./coffee-card";
import { Eyebrow, FrostCanvas, groupByOrigin } from "./coffee-label";

export function ShopCatalog() {
  const products = useProductList();
  const groups = useMemo(() => groupByOrigin(products), [products]);
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <FrostCanvas>
      <div className="mx-auto max-w-6xl px-6 pb-24 md:px-10">
        <header className="border-b border-[#001F36]/10 py-10 md:py-14">
          <Eyebrow className="text-[#EFAA9C]">Shop Coffee</Eyebrow>
          <h1 className="mt-3 font-primary text-4xl leading-tight font-semibold tracking-tight text-[#001F36] md:text-5xl">
            Every lot, in season.
          </h1>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#001F36]/70">
            Direct-trade single origins, each traceable to the people who grew
            it. Choose a size and it&apos;s in your bag.
          </p>
        </header>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((g) => (
            <CoffeeCard
              key={g.key}
              group={g}
              detailsOpen={detailsOpen}
              onToggleDetails={() => setDetailsOpen((o) => !o)}
            />
          ))}
        </div>
      </div>
    </FrostCanvas>
  );
}
