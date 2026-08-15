"use client";

/**
 * PROTOTYPE — throwaway. Variant A: editorial white-card grid.
 * Extends the homepage FeaturedCard treatment into a dense shop grid.
 */

import { useMemo } from "react";
import {
  AddButton,
  accentFor,
  Eyebrow,
  type OriginGroup,
  NoteChips,
  ShopCanvas,
  SizePills,
  groupByOrigin,
  sizeLabel,
  useSizeSelection,
  type Coffee,
} from "./shared";

export const VARIANT_A_NAME = "Editorial grid";

function CoffeeCard({ group }: { group: OriginGroup }) {
  const accent = accentFor(group.color);
  const { selected, setSelected } = useSizeSelection(group);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[#001F36]/10 bg-white transition-shadow hover:shadow-xl hover:shadow-[#001F36]/5">
      {/* accent label block */}
      <div
        className="relative flex aspect-[5/3] flex-col justify-between p-5"
        style={{ backgroundColor: accent }}
      >
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-white/25 px-3 py-1 text-[0.65rem] font-semibold tracking-[0.18em] text-[#001F36] uppercase">
            {sizeLabel(selected.size)}
          </span>
          {group.score ? (
            <span className="font-primary text-sm font-semibold text-[#001F36]/80">
              {group.score} pts
            </span>
          ) : null}
        </div>
        <div>
          <p className="text-[0.7rem] font-semibold tracking-[0.2em] text-[#001F36]/60 uppercase">
            {group.processing}
          </p>
          <h3 className="mt-1 font-primary text-2xl leading-tight font-semibold text-[#001F36]">
            {group.origin}
          </h3>
          <p className="text-sm text-[#001F36]/70">{group.label}</p>
        </div>
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col p-5">
        <NoteChips notes={group.notes} />

        <div className="mt-4">
          <SizePills group={group} selected={selected} onSelect={setSelected} />
        </div>

        <div className="mt-5 flex items-center justify-between">
          <span className="font-primary text-xl font-semibold text-[#001F36]">
            ${selected.price}
          </span>
          <AddButton coffee={selected} size="sm" />
        </div>
      </div>
    </article>
  );
}

export function VariantA({ products: list }: { products: Coffee[] }) {
  const groups = useMemo(() => groupByOrigin(list), [list]);

  return (
    <ShopCanvas>
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

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((g) => (
            <CoffeeCard key={g.key} group={g} />
          ))}
        </div>
      </div>
    </ShopCanvas>
  );
}
