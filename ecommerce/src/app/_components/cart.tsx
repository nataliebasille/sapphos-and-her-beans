"use client";

import { twMerge } from "tailwind-merge";
import {
  type CartItem,
  cartQuantity,
  useCartSelector,
} from "../_stores/cart/cart-provider";
import { memo } from "react";
import { Heading } from "./heading";
import { Close } from "./icons/close";
import { useProduct } from "../_stores/products/queries";
import { useCloseCart } from "../_stores/cart";

export const Cart = () => {
  const isOpen = useCartSelector((s) => s.opened);
  return (
    <>
      {isOpen && (
        <div className="fixed bottom-0 left-0 right-0 top-0 z-[100] bg-black/40" />
      )}
      <div
        className={twMerge(
          "fixed bottom-0 right-0 top-0 z-[100] w-full translate-x-full bg-[#F7DCDF] px-4 text-black transition-all duration-300 md:w-3/5",
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
      <Heading
        level={4}
        className="mb-0 flex items-center border-b-[1px] border-slate-800/30 py-4"
      >
        Your cart ({quantity})
        <Close className="ml-auto size-12 cursor-pointer" onClick={closeCart} />
      </Heading>
      <div className="flex flex-col">
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
  const product = useProduct(+id);
  return <div>{product?.name}</div>;
});
