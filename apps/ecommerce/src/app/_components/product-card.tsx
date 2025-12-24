"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Check } from "~/app/_components/icons/check";
import { Plus } from "~/app/_components/icons/plus";
import { useAddToCart } from "~/app/_stores/cart";
import { BrandingStylizedFont } from "../fonts";
import { type products } from "@models";

const COLOR_CLASSES = {
  cyan: {
    bgLight: "bg-cyan-50",
    bgNormal: "bg-cyan-200",
    bgDark: "bg-cyan-900",
    textLight: "text-cyan-50",
    textDark: "text-cyan-900",
    textDarkest: "text-cyan-950",
    border: "border-cyan-900",
    borderDarkest: "border-cyan-950",
  },

  sky: {
    bgLight: "bg-sky-50",
    bgNormal: "bg-sky-200",
    bgDark: "bg-sky-900",
    textLight: "text-sky-50",
    textDark: "text-sky-900",
    textDarkest: "text-sky-950",
    border: "border-sky-900",
    borderDarkest: "border-sky-950",
  },

  yellow: {
    bgLight: "bg-yellow-50",
    bgNormal: "bg-yellow-200",
    bgDark: "bg-yellow-900",
    textLight: "text-yellow-50",
    textDark: "text-yellow-900",
    textDarkest: "text-yellow-950",
    border: "border-yellow-900",
    borderDarkest: "border-yellow-950",
  },

  rose: {
    bgLight: "bg-rose-50",
    bgNormal: "bg-rose-200",
    bgDark: "bg-rose-900",
    textLight: "text-rose-50",
    textDark: "text-rose-900",
    textDarkest: "text-rose-950",
    border: "border-rose-900",
    borderDarkest: "border-rose-950",
  },

  slate: {
    bgLight: "bg-slate-50",
    bgNormal: "bg-slate-200",
    bgDark: "bg-slate-900",
    textLight: "text-slate-50",
    textDark: "text-slate-900",
    textDarkest: "text-slate-950",
    border: "border-slate-900",
    borderDarkest: "border-slate-950",
  },

  purple: {
    bgLight: "bg-purple-50",
    bgNormal: "bg-purple-200",
    bgDark: "bg-purple-900",
    textLight: "text-purple-50",
    textDark: "text-purple-900",
    textDarkest: "text-purple-950",
    border: "border-purple-900",
    borderDarkest: "border-purple-950",
  },

  amber: {
    bgLight: "bg-amber-50",
    bgNormal: "bg-amber-200",
    bgDark: "bg-amber-900",
    textLight: "text-amber-50",
    textDark: "text-amber-900",
    textDarkest: "text-amber-950",
    border: "border-amber-900",
    borderDarkest: "border-amber-950",
  },

  emerald: {
    bgLight: "bg-emerald-50",
    bgNormal: "bg-emerald-200",
    bgDark: "bg-emerald-900",
    textLight: "text-emerald-50",
    textDark: "text-emerald-900",
    textDarkest: "text-emerald-950",
    border: "border-emerald-900",
    borderDarkest: "border-emerald-950",
  },
} as const;

export const ProductCard = (coffee: products.Product) => {
  const addToCart = useAddToCart();
  const [added, setAdded] = useState(false);
  const handleAddToCart = useCallback(() => {
    addToCart(`${coffee.id}`, {
      quantity: 1,
    });
    setAdded(true);
  }, [addToCart, coffee.id]);

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    if (added) {
      timeout = setTimeout(() => {
        setAdded(false);
      }, 2000);
    }

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [added]);

  return (
    <div
      className={twMerge(
        "flex cursor-pointer flex-col overflow-hidden rounded-lg border-2 shadow-md",
        COLOR_CLASSES[coffee.color].bgLight,
        COLOR_CLASSES[coffee.color].borderDarkest,
      )}
    >
      <WebsiteLabel {...coffee} />

      <div className={twMerge("mt-auto p-3")}>
        <button
          type="button"
          className={twMerge(
            "btn-primary btn btn-sm flex w-full items-center justify-center uppercase tracking-wider",
            added && "!bg-[#4BB543]",
          )}
          onClick={handleAddToCart}
          disabled={added}
        >
          {added ?
            <>
              <Check className="size-7 pr-3" /> added
            </>
          : <>
              <Plus className="size-7 pr-3" /> add to cart
            </>
          }
        </button>
      </div>
    </div>
  );
};

function WebsiteLabel(coffee: products.Product) {
  // const isLimitedEdition: boolean =
  //   "limited" in coffee && coffee.limited === true;
  return (
    <div
      className={twMerge(
        "flex w-full flex-col overflow-hidden",
        COLOR_CLASSES[coffee.color].bgLight,
      )}
    >
      <div
        className={twMerge(`relative flex h-3/5 w-full flex-col rounded-xl`)}
      >
        {/* {"score" in coffee && (
          <div
            className={twMerge(
              `absolute left-0 top-0 flex aspect-square w-14 flex-col items-center justify-center rounded-br-xl border-2 border-l-0 border-t-0 font-bold leading-none tracking-wider`,
              COLOR_CLASSES[coffee.color].textDarkest,
              COLOR_CLASSES[coffee.color].borderDarkest,
              COLOR_CLASSES[coffee.color].bgNormal,
              BrandingStylizedFont.className,
            )}
          >
            <span className="text-xl tracking-widest">{coffee.score}</span>{" "}
            <span className="text-[12px] tracking-widest">pts</span>
          </div>
        )} */}

        {coffee.size !== "singleserve" && (
          <div
            className={twMerge(
              `absolute left-0 top-0 flex items-center justify-center rounded-br-lg border-2 border-l-0 border-t-0 px-4 pt-1 text-2xl font-bold tracking-wider`,
              COLOR_CLASSES[coffee.color].textDarkest,
              COLOR_CLASSES[coffee.color].bgNormal,
              COLOR_CLASSES[coffee.color].borderDarkest,
              BrandingStylizedFont.className,
            )}
          >
            <span>{coffee.size}</span>
            <span className="px-2">|</span>
            <span className="tracking-widest">${coffee.price}</span>
          </div>
        )}

        <div className="flex flex-initial">
          {coffee.size === "singleserve" && (
            <div
              style={{ wordSpacing: "100vw" }}
              className={twMerge("flex max-w-24 flex-initial px-3")}
            >
              <span
                className={twMerge(
                  "mx-auto flex flex-col p-2 text-sm font-bold uppercase leading-3 tracking-wider",
                  COLOR_CLASSES[coffee.color].textLight,
                  COLOR_CLASSES[coffee.color].bgDark,
                )}
              >
                <Image
                  alt={coffee.name ?? ""}
                  src={`/images/single server pouch icon.png`}
                  width={96}
                  height={96}
                  className="object-contain pb-2"
                />

                <span className="self-end">single serve coffee bag</span>
              </span>

              <div
                className={twMerge(
                  "ml-2 self-start rounded-b-lg border-2 border-t-0 px-4 pt-1 text-2xl font-bold tracking-wider",
                  COLOR_CLASSES[coffee.color].textDarkest,
                  COLOR_CLASSES[coffee.color].bgNormal,
                  COLOR_CLASSES[coffee.color].borderDarkest,
                  BrandingStylizedFont.className,
                )}
              >
                ${coffee.price}
              </div>
            </div>
          )}

          <div className="flex flex-1 items-center">
            <div
              className={twMerge(
                "flex w-full items-center gap-4 px-2 font-bold tracking-widest",
                coffee.size !== "singleserve" && "mt-[3rem]",
                BrandingStylizedFont.className,
              )}
            >
              <div
                className={twMerge(
                  `relative h-[2px] flex-1`,
                  COLOR_CLASSES[coffee.color].bgDark,
                )}
              >
                <div
                  className={twMerge(
                    `absolute left-1/2 top-[1px] aspect-square w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 border-[2px]`,
                    COLOR_CLASSES[coffee.color].bgLight,
                    COLOR_CLASSES[coffee.color].border,
                  )}
                />
                <div
                  className={twMerge(
                    `absolute left-1/2 top-1/2 aspect-square w-1 -translate-x-1/2 -translate-y-1/2 rotate-45`,
                    COLOR_CLASSES[coffee.color].bgDark,
                  )}
                />
              </div>

              <div className="flex-1">
                <div
                  className={twMerge(
                    `flex max-w-[250px] items-center justify-center text-center font-bold uppercase`,
                    coffee.size !== "singleserve" ? "text-4xl" : "text-3xl",
                    COLOR_CLASSES[coffee.color].textDarkest,
                  )}
                >
                  {coffee.country}
                </div>
                <div
                  className={twMerge(
                    `relative flex flex-initial items-end justify-center text-nowrap text-center font-bold tracking-widest`,
                    coffee.size !== "singleserve" ? "text-2xl" : "text-xl",
                    COLOR_CLASSES[coffee.color].textDarkest,
                  )}
                >
                  {coffee.farm}
                </div>
              </div>

              <div
                className={twMerge(
                  `relative h-[2px] flex-1`,
                  COLOR_CLASSES[coffee.color].bgDark,
                )}
              >
                <div
                  className={twMerge(
                    `absolute left-1/2 top-[1px] aspect-square w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 border-[2px]`,
                    COLOR_CLASSES[coffee.color].bgLight,
                    COLOR_CLASSES[coffee.color].border,
                  )}
                />
                <div
                  className={twMerge(
                    `absolute left-1/2 top-1/2 aspect-square w-1 -translate-x-1/2 -translate-y-1/2 rotate-45`,
                    COLOR_CLASSES[coffee.color].bgDark,
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid flex-1 content-start justify-center">
          <div
            className={twMerge(
              `my-3 flex-1 px-2 text-center`,
              COLOR_CLASSES[coffee.color].textDarkest,
            )}
          >
            {"fermentation" in coffee &&
              coffee.fermentation &&
              typeof coffee.fermentation !== "string" && (
                <div className="mb-[.125rem] text-lg uppercase tracking-widest">
                  {coffee.fermentation.type === "cofermentation"
                    ? "CO-FERMENTED"
                    : "ANAEROBIC"}
                </div>
              )}
            <span className="text-2xl/5 font-bold italic tracking-wide">
              {" "}
              {coffee.tastingNotes}
            </span>
          </div>

          <CoffeeInfo coffee={coffee} />
        </div>

        <div
          className={twMerge(
            `mt-2 flex px-2 pb-1 font-serif text-sm font-bold tracking-wider`,
            COLOR_CLASSES[coffee.color].textDarkest,
          )}
        >
          <span className="ml-auto italic">
            Traceable to <span>{coffee.traceable}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function CoffeeInfo({ coffee }: { coffee: products.Product }) {
  const rowCount = (4 +
    ("altitude" in coffee ? 1 : 0) +
    (coffee.fermentation ? 1 : 0)) as 4 | 5 | 6;

  return (
    <div
      className={twMerge(
        `grid grid-cols-[max-content_1fr] border-y-2 text-base`,
        COLOR_CLASSES[coffee.color].border,
      )}
    >
      <div
        className={twMerge(
          `grid grid-cols-subgrid grid-rows-subgrid gap-[1px] text-right font-mono font-bold uppercase *:flex *:items-center *:justify-end`,
          COLOR_CLASSES[coffee.color].textLight,
          rowCount === 4 && "row-span-4",
          rowCount === 5 && "row-span-5",
          rowCount === 6 && "row-span-6",
        )}
      >
        {coffee.fermentation && (
          <div className={`bg-${coffee.color}-900 pl-1 pr-3`}>Fermentation</div>
        )}
        <div className={`bg-${coffee.color}-900 pl-1 pr-3`}>Process</div>
        <div className={`bg-${coffee.color}-900 pl-1 pr-3`}>Lot</div>
        <div className={`bg-${coffee.color}-900 pl-1 pr-3`}>Region</div>
        <div className={`bg-${coffee.color}-900 pl-1 pr-3`}>Varietals</div>
        {"altitude" in coffee && (
          <div className={`bg-${coffee.color}-900 pl-1 pr-3`}>Altitude</div>
        )}
      </div>

      <div
        className={twMerge(
          `grid grid-cols-subgrid grid-rows-subgrid gap-[1px] font-bold tracking-wider`,
          rowCount === 4 && "row-span-4",
          rowCount === 5 && "row-span-5",
          rowCount === 6 && "row-span-6",
          COLOR_CLASSES[coffee.color].textDarkest,
          COLOR_CLASSES[coffee.color].bgDark,
        )}
      >
        {coffee.fermentation && (
          <div className={`bg-${coffee.color}-50 px-2`}>
            {typeof coffee.fermentation === "string" ?
              coffee.fermentation
            : coffee.fermentation.type === "cofermentation" ?
              coffee.fermentation.ingredient
            : coffee.fermentation.duration ?? "Anaerobic"}
          </div>
        )}
        <div
          className={`bg-${coffee.color}-50 px-2 font-bold uppercase tracking-wider`}
        >
          {coffee.processing}
        </div>
        <div className={`bg-${coffee.color}-50 px-2`}>{coffee.lot}</div>
        <div className={`bg-${coffee.color}-50 px-2`}>{coffee.region}</div>
        <div className={`bg-${coffee.color}-50 px-2`}>{coffee.varietals}</div>
        {"altitude" in coffee && (
          <div className={`bg-${coffee.color}-50 px-2`}>{coffee.altitude}</div>
        )}
      </div>
    </div>
  );
}
