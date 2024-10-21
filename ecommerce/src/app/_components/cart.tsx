"use client";

import { twMerge } from "tailwind-merge";
import {
  CartItem,
  cartQuantity,
  useCartStore,
  useCloseCart,
} from "../_stores/cart-provider";
import { memo } from "react";
import { Heading } from "./heading";
import { Close } from "./icons/close";
import { useProductListStore } from "../_stores/product-list-provider";

export const Cart = () => {
  const [isOpen] = useCartStore((s) => s.opened);
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
  const [quantity] = useCartStore(cartQuantity);
  const [cart] = useCartStore((s) => s.cart);
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
  const [product] = useProductListStore(({ products }) =>
    products.find((x) => x.id === +id),
  );
  return <div>{product?.name}</div>;
});
