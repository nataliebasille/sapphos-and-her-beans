"use client";

import { useCartStore } from "../_stores/cart-provider";

export const Cart = () => {
  const cart = useCartStore();
  return <div></div>;
};
