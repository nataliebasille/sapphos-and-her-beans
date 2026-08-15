"use client";

/**
 * PROTOTYPE — throwaway. Variant A: the coffee-label card, in a grid.
 * The original product-label look (MedievalSharp origin motif, size|price +
 * score badges, spec grid, traceable footer) re-tinted onto Winter Frost/navy.
 */

import { useMemo } from "react";
import {
  AddButton,
  accentFor,
  Eyebrow,
  fermentationInfo,
  type OriginGroup,
  OriginMotif,
  ShopCanvas,
  ScoreBadge,
  SizePills,
  SizePriceBadge,
  SpecDetails,
  groupByOrigin,
  tint,
  useSizeSelection,
  type Coffee,
} from "./shared";

export const VARIANT_A_NAME = "Coffee label";

function LabelCard({ group }: { group: OriginGroup }) {
  const accent = accentFor(group.color);
  const { selected, setSelected } = useSizeSelection(group);
  const ferment = fermentationInfo(group.fermentation);

  return (
    <article
      className="flex flex-col overflow-hidden rounded-2xl border-2 bg-white shadow-sm"
      style={{ borderColor: accent }}
    >
      {/* accent label header */}
      <div
        className="flex flex-col gap-1.5 px-4 pt-3.5 pb-4"
        style={{ backgroundColor: tint(accent, 0.4) }}
      >
        <div className="flex items-start justify-between">
          <SizePriceBadge
            size={selected.size}
            price={selected.price}
          />
          {group.score ? <ScoreBadge score={group.score} /> : null}
        </div>
        <OriginMotif
          origin={group.origin}
          label={group.label}
          size="sm"
          className="mt-1"
        />
        {group.processing ? (
          <p className="-mt-0.5 text-center text-sm font-bold tracking-[0.2em] text-[#001F36]/80 uppercase">
            {group.processing}
          </p>
        ) : null}
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="text-center text-[15px] leading-snug font-bold text-[#001F36] italic">
          {ferment?.kicker ? (
            <span className="mr-1.5 text-[11px] font-semibold tracking-[0.18em] text-[#001F36]/55 not-italic uppercase">
              {ferment.kicker}
            </span>
          ) : null}
          {group.notes.join(", ")}
        </p>

        <div className="mt-auto flex flex-col gap-2.5 pt-1">
          <SizePills group={group} selected={selected} onSelect={setSelected} />
          <div className="flex items-center justify-between">
            <span className="font-primary text-xl font-semibold text-[#001F36]">
              ${selected.price}
            </span>
            <AddButton coffee={selected} size="sm" />
          </div>
          <SpecDetails group={group} accent={accent} />
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
            <LabelCard key={g.key} group={g} />
          ))}
        </div>
      </div>
    </ShopCanvas>
  );
}
