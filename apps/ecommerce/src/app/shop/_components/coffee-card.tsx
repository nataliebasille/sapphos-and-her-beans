"use client";

/**
 * Shop catalog card — a "mini passport" that echoes the individual coffee page:
 * a gradient origin panel (MedievalSharp country, diamond dividers, score) over
 * a light body with flavor chips and one-click per-size add. A dedicated
 * action row links through to the full coffee passport at /shop/[id].
 */

import { Fragment, useCallback, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Check } from "~/app/_components/icons/check";
import { Plus } from "~/app/_components/icons/plus";
import { useAddToCart } from "~/app/_stores/cart";
import { type OriginGroup, sizeLabel } from "./catalog-data";
import {
  CoffeeCardBody,
  CoffeeCardDivider,
  CoffeeCardFooterRow,
  CoffeeCardHeader,
  CoffeeCardShell,
  CoffeeCardViewBar,
  CoffeeScoreDiamond,
  CoffeeTastingNotes,
  CoffeeTraceability,
} from "./coffee-card-layout";
import { COFFEE_PALETTES, type CoffeePalette } from "./coffee-palette";
import { BrandingStylizedFont } from "~/app/fonts";
import { Bubbles } from "~/app/_components/icons/bubbles";
import { FlaskRound } from "~/app/_components/icons/flask-round";

export function CoffeeCard({
  group,
  className,
}: {
  group: OriginGroup;
  className?: string;
}) {
  const palette = COFFEE_PALETTES[group.color];
  const diamondSize = group?.score ? "size-11" : "";
  const withDiamondPaddingBottom = group?.score ? "" : "";
  const withDiamondPaddingTop =
    group?.score ?
      "pt-[calc(var(--spacing)*11*sqrt(2)/2+var(--spacing)*2)]"
    : "";
  const href = `/shop/${group.sizes[0]!.id}`;

  return (
    <CoffeeCardShell
      palette={palette}
      className={twMerge(
        "row-span-9 grid grid-rows-subgrid gap-y-0 [align-content:start]",
        className,
      )}
    >
      <CoffeeCardHeader
        palette={palette}
        className="row-span-3 grid grid-cols-[1fr_auto] grid-rows-subgrid [align-items:start]"
      >
        <div className="pr-2">
          <h2
            className={twMerge(
              "text-sm! tracking-widest! mb-1 self-start uppercase opacity-80",
            )}
          >
            {group.origin}
          </h2>

          <h1
            className={twMerge(
              "text-balance",
              getProcessingTextClasses(group.label),
              BrandingStylizedFont.className,
            )}
          >
            {group.label}
          </h1>
        </div>

        <div className="flex text-xl">
          <CoffeeScoreDiamond
            score={group?.score}
            className={twMerge(
              "place-self-center",
              !group?.score && "invisible",
              palette.accentBg,
              palette.accentText,
            )}
          />
        </div>

        <div className="col-span-2">
          {group.fermentation && (
            <div className="border-400 mt-3 flex rounded-lg border p-2">
              <span className="flex items-center">
                {(
                  typeof group.fermentation === "object" &&
                  group.fermentation.type === "anaerobic"
                ) ?
                  <FlaskRound className="size-6" />
                : <Bubbles className="size-6" />}
              </span>
              <span className="divider-v mx-2" />
              <span className="flex flex-1 flex-col">
                <span className="text-200 text-[.625rem] uppercase tracking-widest">
                  {(
                    typeof group.fermentation === "object" &&
                    group.fermentation.type === "anaerobic"
                  ) ?
                    "Anaerobic"
                  : (
                    typeof group.fermentation === "object" &&
                    group.fermentation.type === "cofermentation"
                  ) ?
                    "Co-Fermentation"
                  : "Fermentation"}
                </span>

                <span className="font-semibold">
                  {(
                    typeof group.fermentation === "object" &&
                    group.fermentation.type === "anaerobic"
                  ) ?
                    group.fermentation.duration
                  : (
                    typeof group.fermentation === "object" &&
                    group.fermentation.type === "cofermentation"
                  ) ?
                    group.fermentation.ingredient
                  : group.fermentation}
                </span>
              </span>
            </div>
          )}
        </div>
      </CoffeeCardHeader>

      <CoffeeCardBody className="row-span-4 grid flex-1 grow grid-rows-subgrid">
        <InfoSubsection title="Tasting Notes">
          <ul className="font-tertiary mt-2 flex flex-wrap justify-center gap-y-2 space-x-2 text-xs">
            {group.notes.map((note, index) => {
              return (
                <Fragment key={index}>
                  <li>{note}</li>
                  {group.notes.length - 1 !== index && (
                    <li className="opacity-50">✦</li>
                  )}
                </Fragment>
              );
            })}
          </ul>
        </InfoSubsection>

        <InfoSubsection title="Processing" className="mt-2">
          <div className="flex justify-center">{group.processing}</div>
        </InfoSubsection>

        <InfoSubsection title="Traceable to" className="mt-2">
          <div className="flex justify-center">{group.traceable}</div>
        </InfoSubsection>

        <SizePicker group={group} className="mt-6 self-end" />
      </CoffeeCardBody>

      <CoffeeCardViewBar
        href={href}
        ariaLabel={`View ${group.origin} — ${group.label}`}
      />
    </CoffeeCardShell>
  );
}

function InfoSubsection({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={twMerge("flex flex-col", className)}>
      <span
        className={twMerge(
          "divider text-900 before:bg-900 after:bg-900 text-nowrap text-[.5rem] font-semibold uppercase tracking-widest before:h-[.5px] after:h-[.5px]",
          className,
        )}
      >
        {title}
      </span>

      <div className="text-900 mt-1 text-xs font-semibold tracking-wider">
        {children}
      </div>
    </div>
  );
}

function SizePicker({
  group,
  className,
}: {
  group: OriginGroup;
  className?: string;
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
        "border-900 flex flex-col self-start overflow-hidden rounded-xl border-2",
        className,
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
                i > 0 && "border-900 border-l-2",
                active ? "bg-200 text-950" : "text-950 hover:opacity-70",
              )}
            >
              <span className="text-sm font-extrabold uppercase tracking-wide">
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
          "border-900 bg-900 text-50 flex w-full items-center justify-center gap-2 whitespace-nowrap border-t-2 px-5 py-3 text-sm font-extrabold uppercase tracking-[0.12em] transition-[filter] hover:brightness-110",
          added && "bg-success-500! text-surface-50!",
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

const PROCESSING_TEXT_SIZES = [
  { maxLength: 16, className: "text-2xl! tracking-widest!" },
  { maxLength: 28, className: "text-xl! tracking-wider!" },
  { maxLength: 44, className: "text-lg! tracking-wider!" },
] as const;

const PROCESSING_TEXT_SIZE_FALLBACK = "text-base! tracking-wider!";

function getProcessingTextClasses(processing?: string) {
  const length = processing?.length ?? 0;
  return (
    PROCESSING_TEXT_SIZES.find(({ maxLength }) => length <= maxLength)
      ?.className ?? PROCESSING_TEXT_SIZE_FALLBACK
  );
}
