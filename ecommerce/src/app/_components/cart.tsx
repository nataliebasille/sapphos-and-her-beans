"use client";

import Image from "next/image";
import { memo, useCallback } from "react";
import { twMerge } from "tailwind-merge";
import {
  useCartItem,
  useCloseCart,
  useSetCartItemQuantity,
} from "../_stores/cart";
import {
  type CartItem,
  cartQuantity,
  useCartSelector,
} from "../_stores/cart/cart-provider";
import { Close } from "./icons/close";
import { QuantitySelector } from "./quantity-selector";
import { Cart as CartIcon } from "./icons/cart";

export const Cart = () => {
  const isOpen = useCartSelector((s) => s.opened);
  return (
    <>
      {isOpen && (
        <div className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-black/40" />
      )}
      <div
        className={twMerge(
          "fixed bottom-0 right-0 top-0 z-[100] w-full translate-x-full bg-[#F7DCDF] text-black transition-all duration-300 md:w-3/5 md:px-4",
          isOpen && "translate-x-0 shadow-lg shadow-primary-900",
        )}
      >
        <CartItemList />
      </div>
    </>
  );
};

const CartItemList = memo(function CartItemList() {
  const quantity = useCartSelector(cartQuantity);
  const cart = useCartSelector((s) => s.cart);
  const closeCart = useCloseCart();
  return (
    <>
      <div className="mb-0 flex items-center border-b-[1px] border-slate-800/30 px-4 py-4 text-2xl">
        <CartIcon className="mr-2 size-8" />
        <div className="-mb-[2px] self-end">Your shopping bag ({quantity})</div>
        <Close className="ml-auto size-8 cursor-pointer" onClick={closeCart} />
      </div>
      <div className="grid grid-cols-[6rem_1fr] gap-4 p-2 md:grid-cols-[12rem_1fr]">
        {Object.entries(cart).map(([id, item]) => {
          return <CartItemDisplay key={id} id={id} {...item} />;
        })}
      </div>
    </>
  );
});

const CartItemDisplay = memo(function CartItem({
  id,
}: CartItem & { id: string }) {
  const item = useCartItem(+id);
  const setQuantity = useSetCartItemQuantity();
  const handleQuantityChange = useCallback(
    (quantity: number) => {
      setQuantity(+id, quantity);
    },
    [id, setQuantity],
  );

  return item ?
      <div className="card col-span-2 grid h-fit grid-cols-subgrid bg-surface-900/30 p-2">
        <div className="relative">
          <Image
            alt={item.product?.name ?? ""}
            src={item.product?.image ?? ""}
            fill
            objectFit="cover"
          />
        </div>
        <div className="flex flex-col">
          <div className="font-bold uppercase md:text-2xl">
            {item.product?.name}
          </div>
          <div className="mt-2 text-sm md:text-lg">{item.product?.country}</div>
          <div className="mt-2 text-xs uppercase">
            {item.product?.processing}
          </div>
          <div className="text-sm md:text-base">
            {item.product?.tastingNotes}
          </div>
          <div className="mt-auto pt-1">
            <QuantitySelector
              value={item.quantity}
              onChange={handleQuantityChange}
            />
          </div>
        </div>
      </div>
    : null;
});
