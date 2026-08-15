"use client";

/**
 * Individual coffee page — the same coffee-label design language as the shop
 * catalog card, scaled up: an accent "poster" hero with the diamond-line origin
 * motif, then a white "label sticker" panel with one-click per-size add, the
 * full spec grid, and the producer story.
 */

import Link from "next/link";
import {
  type Coffee,
  type OriginGroup,
  priceRange,
} from "../_components/catalog-data";
import {
  accentFor,
  OriginMotif,
  PriceTag,
  ProcessLine,
  ScoreBadge,
  SizeAddRow,
  SpecGrid,
  TraceableFooter,
} from "../_components/coffee-label";

export function CoffeeDetails({
  group,
  coffee,
}: {
  group: OriginGroup;
  coffee: Coffee;
}) {
  const accent = accentFor(group.color);

  return (
    <div className="-mt-[calc(76px+1.5rem)] min-h-dvh bg-[#FAF9F8] pt-[calc(76px+1.5rem)]">
      <div className="mx-auto max-w-3xl px-6 pb-24 md:px-10">
        <div className="py-6">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-[#001F36]/60 uppercase transition-colors hover:text-[#001F36]"
          >
            <span aria-hidden>&larr;</span> All coffee
          </Link>
        </div>

        {/* Accent poster hero */}
        <article
          className="flex flex-col gap-4 rounded-3xl p-6 md:p-10"
          style={{ backgroundColor: accent }}
        >
          <div className="flex items-start justify-between">
            <PriceTag text={priceRange(group.sizes)} className="text-3xl" />
            {group.score ? <ScoreBadge score={group.score} /> : null}
          </div>

          <OriginMotif
            origin={group.origin}
            label={group.label}
            size="lg"
            className="mt-2"
          />
          <ProcessLine group={group} />

          <p className="mx-auto max-w-lg text-center text-lg leading-snug font-bold text-[#001F36] italic md:text-xl">
            {group.notes.join(", ")}
          </p>
        </article>

        {/* White label-sticker panel */}
        <div className="-mt-6 mx-auto flex w-[92%] flex-col gap-6 rounded-2xl border border-[#001F36]/10 bg-white p-6 shadow-sm md:p-8">
          <div>
            <p className="mb-3 text-[11px] font-semibold tracking-[0.22em] text-[#001F36]/55 uppercase">
              Choose your size
            </p>
            <SizeAddRow sizes={group.sizes} />
          </div>

          <div>
            <p className="mb-3 text-[11px] font-semibold tracking-[0.22em] text-[#001F36]/55 uppercase">
              The details
            </p>
            <SpecGrid group={group} accent={accent} />
          </div>

          {coffee.story ? (
            <div>
              <p className="mb-2 text-[11px] font-semibold tracking-[0.22em] text-[#001F36]/55 uppercase">
                The story
              </p>
              <p className="text-[15px] leading-relaxed text-[#001F36]/80">
                {coffee.story}
              </p>
            </div>
          ) : null}

          <TraceableFooter
            traceable={group.traceable}
            className="border-t border-[#001F36]/10 pt-4 text-right"
          />
        </div>
      </div>
    </div>
  );
}
