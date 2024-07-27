"use client";

import { useCartStore } from "../_stores/cart-provider";

export const Cart = () => {
  const cart = useCartStore((s) => s.cart);
  console.log(cart);
  return <div></div>;
};
