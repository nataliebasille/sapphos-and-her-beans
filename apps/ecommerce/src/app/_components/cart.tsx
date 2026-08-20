"use client";

import Link from "next/link";
import { memo, useCallback, useMemo, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { COFFEE_PALETTES } from "~/app/shop/_components/coffee-palette";
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
import { Close } from "./icons/close";

export function Cart() {
  const closeCart = useCloseCart();
  const quantity = useCartQuantity();
  const isDisabled = useCartIsDisabled();
  const isOpen = useCartSelector((state) => state.opened) && !isDisabled;
  const cartRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(cartRef, closeCart);

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="bg-primary-950/45 fixed inset-0 z-100"
          aria-label="Close shopping bag"
          onClick={closeCart}
        />
      )}
      <aside
        ref={cartRef}
        className={twMerge(
          "border-primary-900/20 bg-surface-50 fixed inset-y-0 right-0 z-101 flex w-full max-w-xl translate-x-full flex-col border-l transition-transform duration-300",
          isOpen && "translate-x-0 shadow-[-18px_0_60px_rgba(0,31,54,0.18)]",
        )}
        aria-hidden={!isOpen}
      >
        <CartHeader onClose={closeCart} />
        {quantity === 0 ?
          <EmptyBag />
        : <CartItemList />}
      </aside>
    </>
  );
}

function CartHeader({ onClose }: { onClose: () => void }) {
  return (
    <header className="border-primary-900 bg-primary-600 text-on-primary-600 border-b px-7 py-4">
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="shrink-0 text-2xl font-semibold tracking-wider">
            Your bag
          </span>
        </div>
        <button
          type="button"
          className="shrink-0 p-0.5 transition-opacity hover:opacity-70"
          onClick={onClose}
          aria-label="Close shopping bag"
        >
          <Close className="size-7.5" />
        </button>
      </div>
      <span className="mt-1 hidden min-w-15 flex-1 items-center gap-2.5 opacity-70 sm:flex">
        <span className="h-px flex-1 bg-current" />
        <span className="bg-accent-500 size-2 rotate-45" />
        <span className="h-px flex-1 bg-current" />
      </span>
      <span className="font-primary text-md my-0 leading-9.5 tracking-wide">
        Ready when you are
      </span>
    </header>
  );
}

const CartItemList = memo(function CartItemList() {
  const cart = useCartSelector((state) => state.cart);
  const cartItems = useMemo(() => Object.entries(cart), [cart]);
  const itemCount = useMemo(
    () => cartItems.reduce((total, [, item]) => total + item.quantity, 0),
    [cartItems],
  );
  const total = useCartTotalFormatted();
  const closeCart = useCloseCart();

  return (
    <>
      <div className="flex-1 overflow-auto px-7 pt-6">
        <p className="border-primary-900/20 text-primary-800 border-b pb-3.5 text-[10px] font-semibold tracking-[0.22em] uppercase">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </p>
        <div className="divide-primary-900/15 border-primary-900/15 divide-y border-b">
          {cartItems.map(([id, item], index) => (
            <CartItemDisplay key={id} id={id} index={index} {...item} />
          ))}
        </div>
      </div>
      <footer className="border-primary-900/15 bg-surface-50 border-t px-7 py-6">
        <div className="text-primary-900 flex items-end justify-between gap-6">
          <span className="text-[11px] font-bold tracking-[0.22em] uppercase">
            Subtotal
          </span>
          <span className="font-primary text-[26px] leading-none">{total}</span>
        </div>
        <Link
          href="/checkout/cart"
          className="btn-solid/primary btn-size-lg mt-5 flex w-full items-center justify-center font-bold tracking-[0.24em] uppercase"
          onClick={closeCart}
        >
          Checkout
        </Link>
      </footer>
    </>
  );
});

const CartItemDisplay = memo(function CartItemDisplay({
  id,
  index,
}: CartItem & { id: string; index: number }) {
  const item = useCartItem(id);
  const setQuantity = useSetCartItemQuantity();
  const removeItem = useRemoveCartItem();

  const changeQuantity = useCallback(
    (quantity: number) => {
      if (quantity <= 0) removeItem(id);
      else setQuantity(id, quantity);
    },
    [id, removeItem, setQuantity],
  );

  if (!item?.product) return null;

  const { product } = item;
  const palette = COFFEE_PALETTES[product.color];
  const nameParts = product.name.split(" - ");
  const coffeeName =
    nameParts.length >= 3 ? nameParts.slice(1, -1).join(" - ") : product.name;
  const lineTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.price * item.quantity);

  return (
    <article className="py-5">
      <input type="hidden" name={`items.${index}.id`} value={id} />
      <input
        type="hidden"
        name={`items.${index}.quantity`}
        value={item.quantity}
      />
      <p
        className={twMerge(
          "text-[10px] font-bold tracking-[0.2em] uppercase",
          palette.textMuted,
        )}
      >
        {product.country} <span className="px-1.25 opacity-50">·</span>{" "}
        {product.processing ?? "Coffee"}
      </p>
      <div className="text-primary-900 mt-2.5 grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-5">
        <span className="font-primary min-w-0 text-[22px] leading-6.75 font-semibold tracking-[-0.02em]">
          {product.country} — {coffeeName}
        </span>
        <span className="font-primary shrink-0 text-[22px] leading-6.75">
          {lineTotal}
        </span>
      </div>
      <div className="mt-1.75 flex items-center justify-between gap-5">
        <span className="text-primary-700 text-[13px]">
          {product.size} / Whole Bean
        </span>
        <span className="flex items-center gap-2.5">
          <button
            type="button"
            className="btn-ghost/secondary btn-size-sm font-semibold"
            onClick={() => removeItem(id)}
          >
            Remove
          </button>
          <span className="border-primary-600/25 text-primary-900 inline-flex h-6.5 overflow-hidden rounded-full border">
            <button
              type="button"
              className="hover:bg-accent-100 w-7 text-xs"
              onClick={() => changeQuantity(item.quantity - 1)}
              aria-label={`Remove one ${product.name}`}
            >
              −
            </button>
            <span className="border-primary-600/25 flex w-7 items-center justify-center border-x text-[10px] font-bold">
              {item.quantity}
            </span>
            <button
              type="button"
              className="hover:bg-accent-100 w-7 text-xs"
              onClick={() => changeQuantity(item.quantity + 1)}
              aria-label={`Add one ${product.name}`}
            >
              +
            </button>
          </span>
        </span>
      </div>
    </article>
  );
});

function EmptyBag() {
  return (
    <div className="text-primary-900 flex flex-1 items-center justify-center px-7 text-center">
      <div>
        <p className="text-secondary-700 text-[10px] font-semibold tracking-[0.24em] uppercase">
          Your bag
        </p>
        <h3 className="font-primary mt-2.5 text-3xl">Ready for coffee.</h3>
        <p className="text-primary-700 mt-2 text-[13px]">
          Pick a coffee passport to get started.
        </p>
      </div>
    </div>
  );
}
