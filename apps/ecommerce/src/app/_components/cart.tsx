"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useCallback, useMemo, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { useOnClickOutside } from "../_hooks/useOnClickOutside";
import {
  useCartIsDisabled,
  useCartItem,
  useCartQuantity,
  useCartTotalFormatted,
  useCloseCart,
  useRemoveCartItem,
  useSetCartItemQuantity,
} from "../_stores/cart";
import { type CartItem, useCartSelector } from "../_stores/cart/cart-provider";
import { isLegacyProduct } from "../_stores/products";
import { CartIcon } from "./cart-icon";
import { ArrowRightIcon } from "./icons/arrow-right";
import { Close } from "./icons/close";
import { QuantitySelector } from "./quantity-selector";
import { ShoppingBagEmpty } from "./shopping-bag-empty";

export const Cart = () => {
  const closeCart = useCloseCart();
  const quantity = useCartQuantity();
  const isDisabled = useCartIsDisabled();
  const isOpen = useCartSelector((s) => s.opened) && !isDisabled;

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
            <ShoppingBagEmpty />
          : <CartItemList />}
        </div>
      </div>
    </>
  );
};

const CartItemList = memo(function CartItemList() {
  const cart = useCartSelector((s) => s.cart);
  const cartItems = useMemo(() => Object.entries(cart), [cart]);
  const total = useCartTotalFormatted();
  const closeCart = useCloseCart();

  const handleCheckoutClick = useCallback(() => {
    closeCart();
  }, [closeCart]);

  return (
    <>
      <div className="flex-1 overflow-auto bg-surface-900/20 p-2 shadow-inner shadow-primary-50/50">
        <div
          className="grid grid-cols-[6rem_1fr] grid-rows-[min-content] gap-4 md:grid-cols-[12rem_1fr]"
          style={{ gridRow: `span ${cartItems.length}` }}
        >
          {cartItems.map(([id, item], index) => {
            return <CartItemDisplay key={id} index={index} id={id} {...item} />;
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
          className="btn-primary btn flex w-[175px] flex-initial items-center uppercase tracking-wider md:w-auto md:min-w-[200px]"
          onClick={handleCheckoutClick}
        >
          Checkout{" "}
          <ArrowRightIcon className="ml-auto size-6 font-bold md:size-8" />
        </Link>
      </div>
    </>
  );
});

const CartItemDisplay = memo(function CartItem({
  id,
  index,
}: CartItem & { id: string; index: number }) {
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
    removeItem(id);
  }, [id, removeItem]);

  return item ?
      <div className="card col-span-2 grid h-fit grid-cols-subgrid border-surface-800 bg-surface-200 p-2 shadow-sm shadow-primary-50/50">
        <input type="hidden" name={`items.${index}.id`} value={id} />
        <input
          type="hidden"
          name={`items.${index}.quantity`}
          value={item.quantity}
        />
        {item.product?.image && (
          <div className="relative">
            <Image
              alt={item.product?.name ?? ""}
              src={item.product?.image ?? ""}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div
          className={twMerge(
            "flex flex-col",
            !item.product?.image && "col-span-2",
          )}
        >
          <div className="flex flex-col font-bold uppercase md:block md:text-2xl">
            <span>{item.product?.name}</span>
            {item.product && isLegacyProduct(item.product) && (
              <>
                <span className="hidden md:inline">{" - "}</span>
                <span className="normal-case">
                  {item.product &&
                    isLegacyProduct(item.product) &&
                    `${item.product?.sizeOunces}oz`}
                </span>
              </>
            )}
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
            <span className="ml-2 md:text-xl">x ${item.product?.price}</span>
            <button
              type="button"
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
