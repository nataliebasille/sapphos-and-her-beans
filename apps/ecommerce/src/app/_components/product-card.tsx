"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Check } from "~/app/_components/icons/check";
import { Plus } from "~/app/_components/icons/plus";
import { useAddToCart } from "~/app/_stores/cart";
import { type Product } from "~/server/products/get_products";

export const ProductCard = ({
  id,
  name,
  tastingNotes,
  sizeOunces,
  price,
  processing,
  country,
  image,
  isDecaf,
}: Product) => {
  const addToCart = useAddToCart();
  const [added, setAdded] = useState(false);
  const handleAddToCart = useCallback(() => {
    addToCart(id, {
      quantity: 1,
    });
    setAdded(true);
  }, [addToCart, id]);

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
  }, [setAdded, added]);

  return (
    <div className="cursor-pointer rounded-md">
      <div className="flex flex-col bg-secondary-700 p-3 uppercase tracking-wider text-secondary-contrast-700 md:flex-row md:items-center">
        {name}
        <span className="normal-case md:ml-auto md:text-lg">
          {sizeOunces}oz - ${price}
        </span>
      </div>

      <div className="relative mb-3 aspect-square w-full md:h-96">
        <Image
          src={image}
          alt={name ?? ""}
          className="object-cover"
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        />

        <div className="absolute bottom-0 left-0 right-0 p-3 tracking-wide">
          <div className="card card-primary card-ghost mb-4 !text-white shadow-2xl shadow-primary-800/50 backdrop-blur">
            <div className="card-content">
              <div className="mb-3 text-xl">{country}</div>
              <div className="text-xs uppercase">{processing}</div>
              {tastingNotes}
            </div>
          </div>

          {isDecaf && (
            <div className="absolute right-8 top-6 rounded-full border-[1px] border-surface-500 bg-primary-800/60 px-6 py-2 text-sm font-bold uppercase text-primary-contrast-800">
              decaf
            </div>
          )}

          <button
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
    </div>
  );
};
