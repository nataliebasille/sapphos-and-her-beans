import { useMemo } from "react";
import { useProduct, useProductsSelector } from "../products";
import { useCartSelector, type CartStoreData } from "./cart-provider";
import { type Product } from "~/server/actions/products";

export function useCartItem(id: string) {
  const product = useProduct(id);
  const item = useCartSelector((s) => s.cart[id]);

  return useMemo(
    () => (item ? { ...item, product, unavailable: !!product } : null),
    [item, product],
  );
}

export function useCartQuantity() {
  return useCartSelector(cartQuantity);
}

export function useCartTotal() {
  const products = useProductsSelector((s) => s.products);
  const productsMap = useMemo(
    () =>
      Object.fromEntries(
        products.map((product) => [product.id, product] as const),
      ),
    [products],
  );
  return useCartSelector((s) => cartTotal(s, productsMap));
}

export function useCartTotalFormatted() {
  const total = useCartTotal();
  return useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(total),
    [total],
  );
}

export function cartQuantity(state: CartStoreData) {
  return Object.values(state.cart).reduce(
    (acc, item) => acc + item.quantity,
    0,
  );
}

export function cartTotal(
  { cart }: CartStoreData,
  products: Record<string, Product>,
) {
  return Object.entries(cart).reduce(
    (acc, [productId, item]) =>
      acc + item.quantity * (products[productId]?.price ?? 0),
    0,
  );
}
