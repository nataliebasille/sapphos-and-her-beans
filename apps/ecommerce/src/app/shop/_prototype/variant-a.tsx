"use client";

/**
 * PROTOTYPE — throwaway. Variant A: the coffee-label card, in a grid.
 * The original product-label look (MedievalSharp origin motif, size|price +
 * score badges, spec grid, traceable footer) re-tinted onto Winter Frost/navy.
 */

import { useMemo, useState } from "react";
import {
  accentFor,
  Eyebrow,
  fermentationInfo,
  type OriginGroup,
  OriginMotif,
  PriceTag,
  priceRange,
  ShopCanvas,
  ScoreBadge,
  SizeAddRow,
  SpecDetails,
  groupByOrigin,
  tint,
  type Coffee,
} from "./shared";

export const VARIANT_A_NAME = "Coffee label";

function LabelCard({
  group,
  detailsOpen,
  onToggleDetails,
}: {
  group: OriginGroup;
  detailsOpen: boolean;
  onToggleDetails: () => void;
}) {
  const accent = accentFor(group.color);
  const ferment = fermentationInfo(group.fermentation);

  return (
    <article
      className="flex h-full flex-col overflow-hidden rounded-2xl border-2 bg-white shadow-sm"
      style={{ borderColor: accent }}
    >
      {/* accent label header */}
      <div
        className="flex flex-col gap-1.5 px-4 pt-3.5 pb-4"
        style={{ backgroundColor: tint(accent, 0.4) }}
      >
        <div className="flex items-start justify-between">
          <PriceTag text={priceRange(group.sizes)} />
          {group.score ? <ScoreBadge score={group.score} /> : null}
        </div>
        <OriginMotif
          origin={group.origin}
          label={group.label}
          size="sm"
          className="mt-1"
        />
        {group.processing || ferment?.kicker ? (
          <div className="flex flex-col items-center leading-tight">
            {ferment?.kicker ? (
              <span className="text-[10px] font-semibold tracking-[0.2em] text-[#001F36]/55 uppercase">
                {ferment.kicker}
              </span>
            ) : null}
            {group.processing ? (
              <span className="text-sm font-bold tracking-[0.2em] text-[#001F36]/80 uppercase">
                {group.processing}
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="text-center text-[15px] leading-snug font-bold text-[#001F36] italic">
          {group.notes.join(", ")}
        </p>

        <div className="mt-auto flex flex-col gap-2.5 pt-1">
          <SizeAddRow sizes={group.sizes} />
          <SpecDetails
            group={group}
            accent={accent}
            open={detailsOpen}
            onToggle={onToggleDetails}
          />
        </div>
      </div>
    </article>
  );
}

export function VariantA({ products: list }: { products: Coffee[] }) {
  const groups = useMemo(() => groupByOrigin(list), [list]);
  const [detailsOpen, setDetailsOpen] = useState(false);

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
            <LabelCard
              key={g.key}
              group={g}
              detailsOpen={detailsOpen}
              onToggleDetails={() => setDetailsOpen((o) => !o)}
            />
          ))}
        </div>
      </div>
    </ShopCanvas>
  );
}
