"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { memo, useCallback, useMemo, useRef } from "react";
import { twMerge } from "tailwind-merge";
import {
  useCartItem,
  useCartQuantity,
  useCartTotalFormatted,
  useCloseCart,
  useRemoveCartItem,
  useSetCartItemQuantity,
} from "../_stores/cart";
import { type CartItem, useCartSelector } from "../_stores/cart/cart-provider";
import { Close } from "./icons/close";
import { QuantitySelector } from "./quantity-selector";
import { CartIcon } from "./cart-icon";
import { useOnClickOutside } from "../_hooks/useOnClickOutside";

export const Cart = () => {
  const closeCart = useCloseCart();
  const quantity = useCartQuantity();
  const isOpen = useCartSelector((s) => s.opened);

  const cartRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(cartRef, closeCart);

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-black/40" />
      )}
      <div
        ref={cartRef}
        className={twMerge(
          "fixed bottom-0 right-0 top-0 z-[100] w-full translate-x-full bg-[#F7DCDF] text-black transition-all duration-300 md:w-3/5",
          isOpen && "translate-x-0 shadow-lg shadow-primary-900",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="mb-0 flex items-center border-b-[1px] border-slate-800/30 px-4 py-4 text-2xl">
            <CartIcon className="mr-2" />
            <div className="-mb-[2px] flex-1 text-nowrap text-center">
              Your shopping bag
            </div>
            <Close
              className="ml-auto size-10 cursor-pointer"
              onClick={closeCart}
            />
          </div>

          {quantity === 0 ?
            <CartEmpty />
          : <CartItemList />}
        </div>
      </div>
    </>
  );
};

const CartEmpty = memo(function CartEmpty() {
  const closeCart = useCloseCart();
  const router = useRouter();
  const handleExplore = useCallback(() => {
    closeCart();
    router.push("/shop");
  }, [router, closeCart]);
  return (
    <div className="flex flex-col items-center justify-center p-5">
      <div className="text-center text-xl opacity-75">
        Your shopping bag is empty
      </div>
      <button
        className="btn-primary btn btn-ghost btn-lg mt-5 uppercase"
        onClick={handleExplore}
      >
        Explore our coffee
      </button>
    </div>
  );
});

const CartItemList = memo(function CartItemList() {
  const cart = useCartSelector((s) => s.cart);
  const cartItems = useMemo(() => Object.entries(cart), [cart]);
  const total = useCartTotalFormatted();
  const closeCart = useCloseCart();
  return (
    <>
      <div className="flex-1 overflow-auto bg-surface-900/20 p-2 shadow-inner shadow-primary-50/50">
        <div
          className="grid grid-cols-[6rem_1fr] grid-rows-[min-content] gap-4 md:grid-cols-[12rem_1fr]"
          style={{ gridRow: `span ${cartItems.length}` }}
        >
          {cartItems.map(([id, item]) => {
            return <CartItemDisplay key={id} id={id} {...item} />;
          })}
        </div>
      </div>
      <div className="flex items-center gap-3 border-b-[1px] border-t-[1px] border-primary-300/50 p-2">
        <div className="mx-auto flex flex-col text-xl">
          <span className="text-sm font-bold uppercase text-surface-contrast-50/50">
            Total
          </span>
          {total}
        </div>
        <Link
          href="/checkout/cart"
          className="btn-primary btn btn-lg flex-initial md:w-auto md:min-w-[250px]"
          prefetch
          onClick={closeCart}
        >
          Checkout {"->"}
        </Link>
      </div>
    </>
  );
});

const CartItemDisplay = memo(function CartItem({
  id,
}: CartItem & { id: string }) {
  const item = useCartItem(id);
  const setQuantity = useSetCartItemQuantity();
  const removeItem = useRemoveCartItem();

  const handleQuantityChange = useCallback(
    (quantity: number) => {
      setQuantity(id, quantity);
    },
    [id, setQuantity],
  );

  const handleRemoveItem = useCallback(() => {
    removeItem(+id);
  }, [id, removeItem]);

  return item ?
      <div className="card col-span-2 grid h-fit grid-cols-subgrid border-surface-800 bg-surface-200 p-2 shadow-sm shadow-primary-50/50">
        <div className="relative">
          <Image
            alt={item.product?.name ?? ""}
            src={item.product?.image ?? ""}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col font-bold uppercase md:block md:text-2xl">
            <span>{item.product?.name}</span>
            <span className="hidden md:inline">{" - "}</span>
            <span className="normal-case">{item.product?.sizeOunces}oz</span>
          </div>
          <div className="mt-2 text-base md:text-lg">
            {item.product?.country}
          </div>
          <div className="mt-2 text-xs uppercase">
            {item.product?.processing}
          </div>
          <div className="text-sm md:text-base">
            {item.product?.tastingNotes}
          </div>
          <div className="mt-auto flex items-center pt-1">
            <QuantitySelector
              value={item.quantity}
              onChange={handleQuantityChange}
            />
            <span className="ml-2 text-xl">x ${item.product?.price}</span>
            <button
              className="btn btn-ghost btn-sm ml-auto"
              onClick={handleRemoveItem}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    : null;
});
