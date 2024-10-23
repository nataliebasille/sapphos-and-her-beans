import { useMemo } from "react";
import { useProduct } from "../products";
import { useCartSelector, type CartStoreData } from "./cart-provider";

export function useCartItem(id: number) {
  const product = useProduct(id);
  const item = useCartSelector((s) => s.cart[id]);

  return useMemo(
    () => (item ? { ...item, product, unavailable: !!product } : null),
    [item, product],
  );
}

export function cartQuantity(state: CartStoreData) {
  return Object.values(state.cart).reduce(
    (acc, item) => acc + item.quantity,
    0,
  );
}
