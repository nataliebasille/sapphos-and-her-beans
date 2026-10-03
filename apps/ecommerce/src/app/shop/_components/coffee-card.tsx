"use client";

/**
 * Shop catalog card — a "mini passport" that echoes the individual coffee page:
 * a gradient origin panel (MedievalSharp country, diamond dividers, score) over
 * a light body with flavor chips and one-click per-size add. A dedicated
 * action row links through to the full coffee passport at /shop/[id].
 */

import { useCallback, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Check } from "~/app/_components/icons/check";
import { Plus } from "~/app/_components/icons/plus";
import { useAddToCart } from "~/app/_stores/cart";
import { type OriginGroup, sizeLabel } from "./catalog-data";
import {
  CoffeeCardBody,
  CoffeeCardFooterRow,
  CoffeeCardPassport,
  CoffeeCardShell,
  CoffeeCardViewBar,
  CoffeeTastingNotes,
  CoffeeTraceability,
} from "./coffee-card-layout";
import { COFFEE_PALETTES, type CoffeePalette } from "./coffee-palette";

export function CoffeeCard({
  group,
  className,
}: {
  group: OriginGroup;
  className?: string;
}) {
  const palette = COFFEE_PALETTES[group.color];
  const href = `/shop/${group.sizes[0]!.id}`;

  return (
    <CoffeeCardShell palette={palette} className={className}>
      <CoffeeCardPassport
        palette={palette}
        processing={group.processing}
        score={group.score}
        origin={group.origin}
        label={group.label}
      />

      {/* Body — flavor chips + per-size add */}
      <CoffeeCardBody>
        <CoffeeTastingNotes notes={group.notes} palette={palette} />

        <CoffeeCardFooterRow>
          <CoffeeTraceability traceable={group.traceable} palette={palette} />
        </CoffeeCardFooterRow>

        <SizePicker group={group} palette={palette} />
      </CoffeeCardBody>

      {/* Full-width accent bar linking through to the full coffee passport */}
      <CoffeeCardViewBar
        href={href}
        ariaLabel={`View ${group.origin} — ${group.label}`}
        palette={palette}
      />
    </CoffeeCardShell>
  );
}

function SizePicker({
  group,
  palette,
}: {
  group: OriginGroup;
  palette: CoffeePalette;
}) {
  const addToCart = useAddToCart();
  const [selectedId, setSelectedId] = useState(group.sizes[0]!.id);
  const [added, setAdded] = useState(false);

  const selected =
    group.sizes.find((s) => s.id === selectedId) ?? group.sizes[0]!;

  const handleAdd = useCallback(() => {
    addToCart(`${selected.id}`, { quantity: 1 });
    setAdded(true);
  }, [addToCart, selected.id]);

  useEffect(() => {
    setAdded(false);
  }, [selectedId]);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 2000);
    return () => clearTimeout(t);
  }, [added]);

  return (
    <div
      className={twMerge(
        "flex flex-col self-start overflow-hidden rounded-xl border-2",
        palette.border,
      )}
    >
      <div className="flex">
        {group.sizes.map((s, i) => {
          const active = s.id === selectedId;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedId(s.id)}
              aria-pressed={active}
              className={twMerge(
                "flex flex-1 flex-col items-center justify-center gap-0.5 px-3 py-2 text-center leading-none transition-colors",
                i > 0 && twMerge("border-l-2", palette.border),
                active ?
                  twMerge(palette.accentBg, palette.accentText)
                : twMerge(palette.textStrong, "hover:opacity-70"),
              )}
            >
              <span className="text-sm font-extrabold tracking-wide uppercase">
                {sizeLabel(s.size)}
              </span>
              <span className="text-[0.7rem] font-semibold tabular-nums opacity-70">
                ${s.price}
              </span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={added}
        aria-label={
          added ?
            `${sizeLabel(selected.size)} added to cart`
          : `Add ${sizeLabel(selected.size)} to cart`
        }
        className={twMerge(
          "flex w-full items-center justify-center gap-2 border-t-2 px-5 py-3 text-sm font-extrabold tracking-[0.12em] whitespace-nowrap uppercase transition-[filter] hover:brightness-110",
          palette.border,
          palette.panel,
          palette.panelText,
          added && "!bg-success-500 !text-surface-50",
        )}
      >
        {added ?
          <Check className="size-5" />
        : <Plus className="size-5" />}
        <span>{added ? "Added" : "Add"}</span>
        {!added && (
          <>
            <span aria-hidden="true" className="opacity-60">
              ·
            </span>
            <span>{sizeLabel(selected.size)}</span>
            <span aria-hidden="true" className="opacity-60">
              ·
            </span>
            <span className="tabular-nums">${selected.price}</span>
          </>
        )}
      </button>
    </div>
  );
}
