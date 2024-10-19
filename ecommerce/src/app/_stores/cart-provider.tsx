"use client";

import { useCallback } from "react";
import { createStore } from "../_components/stores/create-store";
import { useLocalStorageState } from "../_hooks/useLocalStorageState";
import { useStore } from "../_hooks/useStore";
import { useProductListStore } from "./product-list-provider";

export type CartItem = {
  id: number;
  quantity: number;
};

type CartStoreData = CartItem[];

const {
  Provider: InternalCartProvider,
  useStore: useCartStore,
  useStoreApi: useCartStoreApi,
} = createStore<CartStoreData>([]);
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const products = useProductListStore((s) => s.products);
  const [cart, setCart] = useLocalStorageState<CartStoreData>("cart", []);
  const onSet = useCallback(
    (value: CartStoreData) => {
      setCart(value);
      return value;
    },
    [setCart],
  );

  return (
    <InternalCartProvider onSet={onSet} initialValue={cart}>
      {children}
    </InternalCartProvider>
  );
};

export { useCartStore };

export function useAddToCart() {
  const store = useCartStoreApi();
  return useCallback(
    (item: CartItem) => {
      store.set([...store.get(), item]);
    },
    [store],
  );
}
