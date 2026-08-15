"use client";

import { useCallback, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Check } from "~/app/_components/icons/check";
import { Plus } from "~/app/_components/icons/plus";
import { useAddToCart } from "~/app/_stores/cart";
import { BrandingStylizedFont } from "~/app/fonts";
import { type products } from "@models";
import { COFFEE_PALETTES } from "../_components/coffee-palette";

function fermentationLabel(
  fermentation: products.Product["fermentation"],
): string | null {
  if (!fermentation) return null;
  if (typeof fermentation === "string") return fermentation;
  if (fermentation.type === "cofermentation")
    return `Co-fermented · ${fermentation.ingredient}`;
  return fermentation.duration ? `Anaerobic · ${fermentation.duration}` : "Anaerobic";
}

function tastingNotes(coffee: products.Product): string[] {
  if (!coffee.tastingNotes) return [];
  return coffee.tastingNotes
    .split(/[,·]/)
    .map((note) => note.trim())
    .filter(Boolean);
}

function specRows(coffee: products.Product): { label: string; value: string }[] {
  const rows: { label: string; value: string }[] = [];
  const ferment = fermentationLabel(coffee.fermentation);
  if (ferment) rows.push({ label: "Fermentation", value: ferment });
  if (coffee.processing) rows.push({ label: "Process", value: coffee.processing });
  if (coffee.varietals) rows.push({ label: "Varietals", value: coffee.varietals });
  if (coffee.altitude) rows.push({ label: "Altitude", value: coffee.altitude });
  if (coffee.region) rows.push({ label: "Region", value: coffee.region });
  if (coffee.lot) rows.push({ label: "Lot", value: coffee.lot });
  return rows;
}

function Diamond({ className }: { className?: string }) {
  return (
    <div className={twMerge("flex items-center gap-3", className)}>
      <span className="h-px flex-1 bg-current opacity-40" />
      <span className="size-2 rotate-45 bg-current" />
      <span className="h-px flex-1 bg-current opacity-40" />
    </div>
  );
}

function AddToCartButton({
  coffee,
  className,
}: {
  coffee: products.Product;
  className?: string;
}) {
  const addToCart = useAddToCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = useCallback(() => {
    addToCart(`${coffee.id}`, { quantity: 1 });
    setAdded(true);
  }, [addToCart, coffee.id]);

  useEffect(() => {
    if (!added) return;
    const timeout = setTimeout(() => setAdded(false), 2000);
    return () => clearTimeout(timeout);
  }, [added]);

  return (
    <button
      type="button"
      className={twMerge(
        "btn-solid/primary btn-size-lg flex items-center justify-center tracking-wider uppercase",
        added && "!bg-[#4BB543]",
        className,
      )}
      onClick={handleAddToCart}
      disabled={added}
    >
      {added ?
        <>
          <Check className="size-6 pr-2" /> added
        </>
      : <>
          <Plus className="size-6 pr-2" /> add to cart — ${coffee.price}
        </>
      }
    </button>
  );
}

export function CoffeeDetails({ coffee }: { coffee: products.Product }) {
  const palette = COFFEE_PALETTES[coffee.color];
  const notes = tastingNotes(coffee);
  const rows = specRows(coffee);
  const ferment = fermentationLabel(coffee.fermentation);

  return (
    <div className="md:flex md:min-h-dvh">
      {/* Passport panel */}
      <aside
        className={twMerge(
          "flex flex-col justify-center bg-gradient-to-b px-8 py-16 md:sticky md:top-0 md:h-dvh md:w-2/5",
          palette.panel,
          palette.gradientFrom,
          palette.gradientTo,
        )}
      >
        <div
          className={twMerge(
            "mx-auto w-full max-w-sm text-center",
            palette.panelText,
          )}
        >
          <p className="text-xs tracking-[0.4em] uppercase opacity-70">
            Coffee Passport
          </p>
          <Diamond className="my-6 opacity-80" />

          {coffee.score && (
            <div
              className={twMerge(
                "mx-auto mb-6 flex size-24 flex-col items-center justify-center rounded-full",
                palette.accentBg,
                palette.accentText,
              )}
            >
              <span className="text-3xl leading-none font-bold">
                {coffee.score}
              </span>
              <span className="text-[10px] tracking-widest uppercase">pts</span>
            </div>
          )}

          <h1
            className={twMerge(
              "text-5xl leading-none tracking-wide uppercase md:text-6xl",
              BrandingStylizedFont.className,
            )}
          >
            {coffee.country}
          </h1>
          <p className="mt-3 text-lg tracking-widest uppercase opacity-90">
            {coffee.farm}
          </p>

          <Diamond className="my-6 opacity-80" />

          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="opacity-60 uppercase">Region</dt>
              <dd className="text-right font-medium">{coffee.region ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="opacity-60 uppercase">Altitude</dt>
              <dd className="text-right font-medium">{coffee.altitude ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="opacity-60 uppercase">Traceable</dt>
              <dd className="text-right font-medium">{coffee.traceable}</dd>
            </div>
          </dl>
        </div>
      </aside>

      {/* Detail column */}
      <main
        className={twMerge(
          "flex-1 px-8 py-16 pb-28 md:px-14 md:pb-16",
          palette.surface,
        )}
      >
        <div className="mx-auto max-w-2xl">
          <h2 className={twMerge("text-2xl font-bold", palette.textStrong)}>
            {coffee.name}
          </h2>

          {notes.length > 0 && (
            <section className="mt-8">
              <p
                className={twMerge(
                  "mb-3 text-xs tracking-[0.3em] uppercase",
                  palette.textMuted,
                )}
              >
                Flavor
              </p>
              <div className="flex flex-wrap gap-2">
                {notes.map((note) => (
                  <span
                    key={note}
                    className={twMerge(
                      "rounded-full px-4 py-2 text-sm font-medium",
                      palette.chipBg,
                      palette.chipText,
                    )}
                  >
                    {note}
                  </span>
                ))}
              </div>
            </section>
          )}

          {rows.length > 0 && (
            <section className="mt-10">
              <p
                className={twMerge(
                  "mb-3 text-xs tracking-[0.3em] uppercase",
                  palette.textMuted,
                )}
              >
                Details
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {rows.map((row) => (
                  <div
                    key={row.label}
                    className={twMerge(
                      "rounded-xl border p-4",
                      palette.border,
                      palette.chipBg,
                    )}
                  >
                    <p
                      className={twMerge(
                        "text-[10px] tracking-[0.2em] uppercase",
                        palette.textMuted,
                      )}
                    >
                      {row.label}
                    </p>
                    <p
                      className={twMerge("mt-1 font-semibold", palette.textStrong)}
                    >
                      {row.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {ferment && (
            <p className={twMerge("mt-6 text-sm italic", palette.textMuted)}>
              Fermentation — {ferment}
            </p>
          )}

          {/* Buy box — inline on desktop */}
          <section
            className={twMerge(
              "mt-10 hidden items-center justify-between gap-4 rounded-2xl border-2 p-5 md:flex",
              palette.border,
            )}
          >
            <div className={palette.textStrong}>
              <p className="text-xs tracking-widest uppercase opacity-70">
                {coffee.size}
              </p>
              <p className="text-3xl font-bold">${coffee.price}</p>
            </div>
            <AddToCartButton coffee={coffee} className="min-w-[200px]" />
          </section>
        </div>
      </main>

      {/* Mobile-only sticky buy bar — kept in front of the user on landing */}
      <div
        className={twMerge(
          "fixed inset-x-0 bottom-0 z-40 border-t shadow-[0_-4px_20px_rgba(0,0,0,0.12)] md:hidden",
          palette.border,
          palette.surface,
        )}
      >
        <div className="flex items-center justify-between gap-4 px-5 py-3">
          <div className={palette.textStrong}>
            <p className="text-[10px] tracking-widest uppercase opacity-70">
              {coffee.size}
            </p>
            <p className="text-2xl leading-none font-bold">${coffee.price}</p>
          </div>
          <AddToCartButton coffee={coffee} className="flex-1" />
        </div>
      </div>
    </div>
  );
}
