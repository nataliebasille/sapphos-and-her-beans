"use client";

/**
 * Shop catalog card — an accent "poster" tile carrying the coffee-label motifs
 * in navy, with the price/size actions on a white "label sticker" panel.
 */

import {
  accentFor,
  type OriginGroup,
  OriginMotif,
  PriceTag,
  priceRange,
  ProcessLine,
  ScoreBadge,
  SizeAddRow,
  SpecDetails,
} from "./coffee-label";

export function CoffeeCard({
  group,
  detailsOpen,
  onToggleDetails,
}: {
  group: OriginGroup;
  detailsOpen: boolean;
  onToggleDetails: () => void;
}) {
  const accent = accentFor(group.color);

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
      <div className="-mt-1">
        <ProcessLine group={group} />
      </div>

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
