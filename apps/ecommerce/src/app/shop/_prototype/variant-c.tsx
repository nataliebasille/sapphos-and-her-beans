"use client";

/**
 * PROTOTYPE — throwaway. Variant C: accent gallery.
 * Each tile is flooded with the coffee's muted brand accent (navy type on top),
 * a graphic "wall of labels" — bold but on-brand (no saturated color, no photos).
 */

import { useMemo } from "react";
import { twMerge } from "tailwind-merge";
import {
  AddButton,
  accentFor,
  Eyebrow,
  type OriginGroup,
  ShopCanvas,
  groupByOrigin,
  sizeLabel,
  useSizeSelection,
  type Coffee,
} from "./shared";

export const VARIANT_C_NAME = "Accent gallery";

function GalleryTile({ group }: { group: OriginGroup }) {
  const accent = accentFor(group.color);
  const { selected, setSelected } = useSizeSelection(group);

  return (
    <article
      className="flex min-h-[320px] flex-col justify-between rounded-2xl p-6 md:p-7"
      style={{ backgroundColor: accent }}
    >
      <div className="flex items-start justify-between">
        <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-[#001F36]/60 uppercase">
          {group.processing}
        </p>
        {group.score ? (
          <span className="font-primary text-sm font-semibold text-[#001F36]/75">
            {group.score} pts
          </span>
        ) : null}
      </div>

      <div className="py-6">
        <h3 className="font-primary text-3xl leading-[1.05] font-semibold text-[#001F36] md:text-4xl">
          {group.origin}
        </h3>
        <p className="mt-1 text-sm font-medium text-[#001F36]/70">
          {group.label}
        </p>
        <p className="mt-4 max-w-xs text-[15px] leading-snug text-[#001F36]/80 italic">
          {group.notes.join(", ")}
        </p>
      </div>

      <div>
        <div className="mb-4 flex flex-wrap gap-1.5">
          {group.sizes.map((s) => {
            const active = s.id === selected.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelected(s)}
                className={twMerge(
                  "rounded-full border px-3 py-1 text-xs font-semibold tracking-wide transition-colors",
                  active
                    ? "border-[#001F36] bg-[#001F36] text-[#FAF9F8]"
                    : "border-[#001F36]/30 text-[#001F36]/80 hover:border-[#001F36]/60",
                )}
              >
                {sizeLabel(s.size)}
              </button>
            );
          })}
        </div>
        <div className="flex items-center justify-between border-t border-[#001F36]/15 pt-4">
          <span className="font-primary text-2xl font-semibold text-[#001F36]">
            ${selected.price}
          </span>
          <AddButton coffee={selected} size="sm" />
        </div>
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
            <GalleryTile key={g.key} group={g} />
          ))}
        </div>
      </div>
    </ShopCanvas>
  );
}
