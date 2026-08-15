"use client";

/**
 * PROTOTYPE — throwaway. Variant C: accent poster gallery.
 * Each tile is flooded with the coffee's muted accent; the label motifs sit in
 * navy on top, and the spec/actions ride on a white "label sticker" panel.
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
  ScoreBadge,
  ShopCanvas,
  SizeAddRow,
  SpecDetails,
  groupByOrigin,
  type Coffee,
} from "./shared";

export const VARIANT_C_NAME = "Accent poster";

function PosterTile({
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
      className="flex h-full flex-col gap-3 rounded-2xl p-4"
      style={{ backgroundColor: accent }}
    >
      <div className="flex items-start justify-between">
        <PriceTag text={priceRange(group.sizes)} />
        {group.score ? <ScoreBadge score={group.score} /> : null}
      </div>

      <OriginMotif origin={group.origin} label={group.label} size="sm" />
      {group.processing || ferment?.kicker ? (
        <div className="-mt-2 flex flex-col items-center leading-tight">
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

      <p className="text-center text-[15px] leading-snug font-bold text-[#001F36] italic">
        {group.notes.join(", ")}
      </p>

      {/* white "label sticker" panel */}
      <div className="mt-auto flex flex-col gap-2.5 rounded-xl bg-white/85 p-3 backdrop-blur-sm">
        <SizeAddRow sizes={group.sizes} />
        <SpecDetails
          group={group}
          accent={accent}
          open={detailsOpen}
          onToggle={onToggleDetails}
        />
      </div>
    </article>
  );
}

export function VariantC({ products: list }: { products: Coffee[] }) {
  const groups = useMemo(() => groupByOrigin(list), [list]);
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <ShopCanvas>
      <div className="mx-auto max-w-6xl px-6 pb-24 md:px-10">
        <header className="flex flex-col gap-4 py-10 md:flex-row md:items-end md:justify-between md:py-14">
          <div>
            <Eyebrow className="text-[#EFAA9C]">Shop Coffee</Eyebrow>
            <h1 className="mt-3 font-primary text-4xl leading-tight font-semibold tracking-tight text-[#001F36] md:text-5xl">
              A wall of good coffee.
            </h1>
          </div>
          <p className="max-w-xs text-[15px] leading-relaxed text-[#001F36]/70">
            One label per origin, each traceable to its farmers. Pick a size and
            add it to your bag.
          </p>
        </header>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((g) => (
            <PosterTile
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
