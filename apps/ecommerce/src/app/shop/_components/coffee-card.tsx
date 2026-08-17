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
          "block bg-gradient-to-b p-4 text-center transition-opacity hover:opacity-95",
          palette.panel,
          palette.gradientFrom,
          palette.gradientTo,
          palette.panelText,
        )}
      >
        {/* Processing eyebrow, above the rule. */}
        <p className="text-center text-[10px] font-semibold tracking-[0.25em] uppercase opacity-80">
          {group.processing}
        </p>

        {/* Top rule — score circle sits centered in the line, like the diamond. */}
        <Divider className="my-3 opacity-80">
          {group.score ?
            <span
              className={twMerge(
                "flex size-11 shrink-0 rotate-45 items-center justify-center rounded-[3px] opacity-100",
                palette.accentBg,
                palette.accentText,
              )}
            >
              <span className="flex -rotate-45 flex-col items-center justify-center leading-none">
                <span className="text-sm font-bold">{group.score}</span>
                <span className="text-[8px] tracking-widest">pts</span>
              </span>
            </span>
          : undefined}
        </Divider>

        <h3
          className={twMerge(
            "text-4xl leading-none tracking-wide uppercase",
            BrandingStylizedFont.className,
          )}
        >
          {group.origin}
        </h3>
        <p className="mt-1.5 text-xs tracking-[0.2em] uppercase opacity-90">
          {group.label}
        </p>
      </Link>

      {/* Body — flavor chips + one-click per-size add */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap justify-center gap-1.5">
          {group.notes.map((note) => (
            <span
              key={note}
              className={twMerge(
                "rounded-full px-3 py-0.5 text-xs font-medium",
                palette.chipBg,
                palette.chipText,
              )}
            >
              {note}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-1.5">
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

function Divider({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={twMerge("flex items-center gap-3", className)}>
      <span className="h-px flex-1 bg-current opacity-40" />
      {children ?? <span className="size-1.5 rotate-45 bg-current" />}
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
      {added ?
        <Check className="size-4" />
      : <Plus className="size-4" />}
      <span>{sizeLabel(coffee.size)}</span>
      <span className="opacity-60">·</span>
      <span>{added ? "Added" : `$${coffee.price}`}</span>
    </button>
  );
}
