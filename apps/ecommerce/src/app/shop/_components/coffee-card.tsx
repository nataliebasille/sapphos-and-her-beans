"use client";

/**
 * Shop catalog card — a "mini passport" that echoes the individual coffee page:
 * a gradient origin panel (MedievalSharp country, diamond dividers, score) over
 * a light body with flavor chips and one-click per-size add. The panel links
 * through to the full coffee passport at /shop/[id].
 */

import { useCallback, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Check } from "~/app/_components/icons/check";
import { Plus } from "~/app/_components/icons/plus";
import { useAddToCart } from "~/app/_stores/cart";
import { type Coffee, type OriginGroup, sizeLabel } from "./catalog-data";
import {
  CoffeeCardBody,
  CoffeeCardFooterRow,
  CoffeeCardPassport,
  CoffeeCardShell,
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
        href={href}
        ariaLabel={`View ${group.origin} — ${group.label}`}
        palette={palette}
        processing={group.processing}
        score={group.score}
        origin={group.origin}
        label={group.label}
      />

      {/* Body — flavor chips + one-click per-size add */}
      <CoffeeCardBody>
        <CoffeeTastingNotes notes={group.notes} palette={palette} />

        <div className="flex flex-wrap content-end justify-center gap-1.5">
          {group.sizes.map((s) => (
            <SizeAdd key={s.id} coffee={s} palette={palette} />
          ))}
        </div>

        <CoffeeCardFooterRow>
          <CoffeeTraceability traceable={group.traceable} palette={palette} />
        </CoffeeCardFooterRow>
      </CoffeeCardBody>
    </CoffeeCardShell>
  );
}

function SizeAdd({
  coffee,
  palette,
}: {
  coffee: Coffee;
  palette: CoffeePalette;
}) {
  const addToCart = useAddToCart();
  const [added, setAdded] = useState(false);

  const handleAdd = useCallback(() => {
    addToCart(`${coffee.id}`, { quantity: 1 });
    setAdded(true);
  }, [addToCart, coffee.id]);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 2000);
    return () => clearTimeout(t);
  }, [added]);

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={added}
      aria-label={`Add ${sizeLabel(coffee.size)} to cart`}
      className={twMerge(
        "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold tracking-wide uppercase transition-opacity hover:opacity-90",
        palette.panel,
        palette.panelText,
        added && "!bg-success-500 !text-surface-50",
      )}
    >
      {added ?
        <Check className="size-4" />
      : <Plus className="size-4" />}
      <span>{sizeLabel(coffee.size)}</span>
      <span className="opacity-60">·</span>
      <span>{added ? "Added" : `$${coffee.price}`}</span>
    </button>
  );
}
