"use client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Check } from "~/app/_components/icons/check";
import { Plus } from "~/app/_components/icons/plus";
import { useCartStore } from "~/app/_stores/cart-provider";
import { type Product } from "~/server/actions/products";

export const ProductCard = ({
  id,
  name,
  tastingNotes,
  sizeOunces,
  price,
  processing,
  country,
  image,
}: Product) => {
  const { addToCart } = useCartStore();
  const [added, setAdded] = useState(false);
  const handleAddToCart = useCallback(() => {
    addToCart({
      id,
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
      <div className="flex items-center bg-secondary-700 p-3 uppercase tracking-wider text-secondary-contrast-700">
        {name}
        <span className="ml-auto text-lg">
          {sizeOunces} oz - ${price}
        </span>
      </div>

      <div className="relative mb-3 aspect-square h-96 w-full">
        <Image src={image} alt={name ?? ""} className="object-cover" fill />

        <div className="absolute bottom-0 left-0 right-0 p-3 tracking-wide">
          <div className="card card-primary card-ghost mb-4 !text-white shadow-2xl shadow-primary-800/50 backdrop-blur">
            <div className="card-content">
              <div className="text-xl">{country}</div>
              {tastingNotes}
              <div className="mt-2 text-sm uppercase">{processing}</div>
            </div>
          </div>

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
