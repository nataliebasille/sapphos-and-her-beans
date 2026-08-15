"use client";

/**
 * PROTOTYPE — throwaway. Variant C: accent poster gallery.
 * Each tile is flooded with the coffee's muted accent; the label motifs sit in
 * navy on top, and the spec/actions ride on a white "label sticker" panel.
 */

import { useMemo } from "react";
import {
  AddButton,
  accentFor,
  Eyebrow,
  FROST,
  fermentationInfo,
  type OriginGroup,
  OriginMotif,
  ScoreBadge,
  ShopCanvas,
  SizePills,
  SizePriceBadge,
  SpecGrid,
  TraceableFooter,
  groupByOrigin,
  useSizeSelection,
  type Coffee,
} from "./shared";

export const VARIANT_C_NAME = "Accent poster";

function PosterTile({ group }: { group: OriginGroup }) {
  const accent = accentFor(group.color);
  const { selected, setSelected } = useSizeSelection(group);
  const ferment = fermentationInfo(group.fermentation);

  return (
    <article
      className="flex flex-col gap-3 rounded-2xl p-4"
      style={{ backgroundColor: accent }}
    >
      <div className="flex items-start justify-between">
        <SizePriceBadge
          size={selected.size}
          price={selected.price}
          accent={FROST}
        />
        {group.score ? <ScoreBadge score={group.score} /> : null}
      </div>

      <OriginMotif origin={group.origin} label={group.label} size="sm" />

      <p className="text-center text-[15px] leading-snug font-bold text-[#001F36] italic">
        {ferment?.kicker ? (
          <span className="mr-1.5 text-[11px] font-semibold tracking-[0.18em] text-[#001F36]/60 not-italic uppercase">
            {ferment.kicker}
          </span>
        ) : null}
        {group.notes.join(", ")}
      </p>

      {/* white "label sticker" panel */}
      <div className="mt-auto flex flex-col gap-2.5 rounded-xl bg-white/85 p-3 backdrop-blur-sm">
        <SpecGrid group={group} accent={accent} />
        <SizePills group={group} selected={selected} onSelect={setSelected} />
        <div className="flex items-center justify-between">
          <span className="font-primary text-xl font-semibold text-[#001F36]">
            ${selected.price}
          </span>
          <AddButton coffee={selected} size="sm" />
        </div>
        <TraceableFooter traceable={group.traceable} className="text-right" />
      </div>
    </article>
  );
}

export function VariantC({ products: list }: { products: Coffee[] }) {
  const groups = useMemo(() => groupByOrigin(list), [list]);

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
            <PosterTile key={g.key} group={g} />
          ))}
        </div>
      </div>
    </ShopCanvas>
  );
}
