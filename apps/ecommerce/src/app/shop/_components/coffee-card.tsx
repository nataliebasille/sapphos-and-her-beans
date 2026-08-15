"use client";

/**
 * Shop catalog card — a "mini passport" that echoes the individual coffee page:
 * a gradient origin panel (MedievalSharp country, diamond dividers, score) over
 * a light body with flavor chips and one-click per-size add. The panel links
 * through to the full coffee passport at /shop/[id].
 */

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Check } from "~/app/_components/icons/check";
import { Plus } from "~/app/_components/icons/plus";
import { useAddToCart } from "~/app/_stores/cart";
import { BrandingStylizedFont } from "~/app/fonts";
import { type Coffee, type OriginGroup, sizeLabel } from "./catalog-data";
import { COFFEE_PALETTES, type CoffeePalette } from "./coffee-palette";

function Diamond({ className }: { className?: string }) {
  return (
    <div className={twMerge("flex items-center gap-3", className)}>
      <span className="h-px flex-1 bg-current opacity-40" />
      <span className="size-1.5 rotate-45 bg-current" />
      <span className="h-px flex-1 bg-current opacity-40" />
    </div>
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
        added && "!bg-[#3f8f6b] !text-white",
      )}
    >
      {added ? <Check className="size-4" /> : <Plus className="size-4" />}
      <span>{sizeLabel(coffee.size)}</span>
      <span className="opacity-60">·</span>
      <span>{added ? "Added" : `$${coffee.price}`}</span>
    </button>
  );
}

export function CoffeeCard({ group }: { group: OriginGroup }) {
  const palette = COFFEE_PALETTES[group.color];
  const href = `/shop/${group.sizes[0]!.id}`;

  return (
    <article
      className={twMerge(
        "flex h-full flex-col overflow-hidden rounded-2xl border-2",
        palette.surface,
        palette.borderStrong,
      )}
    >
      {/* Passport panel — links to the full coffee page */}
      <Link
        href={href}
        aria-label={`View ${group.origin} — ${group.label}`}
        className={twMerge(
          "block bg-gradient-to-b p-5 text-center transition-opacity hover:opacity-95",
          palette.panel,
          palette.gradientFrom,
          palette.gradientTo,
          palette.panelText,
        )}
      >
        <div className="flex items-center justify-between text-[10px] tracking-[0.25em] uppercase opacity-80">
          <span>{group.processing}</span>
          {group.score ? (
            <span
              className={twMerge(
                "flex size-12 shrink-0 flex-col items-center justify-center rounded-full leading-none",
                palette.accentBg,
                palette.accentText,
              )}
            >
              <span className="text-sm font-bold tracking-normal">
                {group.score}
              </span>
              <span className="text-[8px] tracking-widest">pts</span>
            </span>
          ) : null}
        </div>

        <Diamond className="my-4 opacity-80" />

        <h3
          className={twMerge(
            "text-4xl leading-none tracking-wide uppercase",
            BrandingStylizedFont.className,
          )}
        >
          {group.origin}
        </h3>
        <p className="mt-2 text-xs tracking-[0.2em] uppercase opacity-90">
          {group.label}
        </p>

        <Diamond className="my-4 opacity-80" />

        <p className="text-sm leading-snug font-medium italic opacity-95">
          {group.notes.join(", ")}
        </p>
      </Link>

      {/* Body — flavor chips + one-click per-size add */}
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex flex-wrap justify-center gap-2">
          {group.notes.map((note) => (
            <span
              key={note}
              className={twMerge(
                "rounded-full px-3 py-1 text-xs font-medium",
                palette.chipBg,
                palette.chipText,
              )}
            >
              {note}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-wrap justify-center gap-2">
          {group.sizes.map((s) => (
            <SizeAdd key={s.id} coffee={s} palette={palette} />
          ))}
        </div>

        <p
          className={twMerge(
            "text-center font-serif text-xs font-bold tracking-wider italic",
            palette.textMuted,
          )}
        >
          Traceable to {group.traceable}
        </p>
      </div>
    </article>
  );
}
