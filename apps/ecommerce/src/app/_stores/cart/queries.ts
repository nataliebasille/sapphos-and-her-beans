import { usePathname } from "next/navigation";
import { useMemo } from "react";
import type { Product } from "~/app/_stores/products";
import { useProduct, useProductsSelector } from "../products";
import { type CartStoreData, useCartSelector } from "./cart-provider";

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

export function useCartIsDisabled() {
  const path = usePathname();
  return path.includes("/checkout");
}

export function cartQuantity(state: CartStoreData) {
  return Object.values(state.cart).reduce(
    (acc, item) => acc + item.quantity,
    0,
  );
}

export function cartTotal(
  { cart }: CartStoreData,
  products: Record<string, Pick<Product, "price">>,
) {
  return Object.entries(cart).reduce(
    (acc, [productId, item]) =>
      acc + item.quantity * (products[productId]?.price ?? 0),
    0,
  );
}
