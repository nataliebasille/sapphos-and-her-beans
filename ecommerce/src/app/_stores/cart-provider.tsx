"use client";

import { createContext, useContext, useRef } from "react";
import { create } from "zustand";
import { useProductListStore } from "./product-list-provider";

export type CartItem = {
  id: number;
  quantity: number;
};

type CartStoreApi = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
};

const createCartStore = create<CartStoreApi>();
const CartStoreContext = createContext<ReturnType<
  typeof createCartStore
> | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const products = useProductListStore((s) => s.products);
  const storeRef = useRef<ReturnType<typeof createCartStore> | null>(null);

  if (storeRef.current === null) {
    storeRef.current = createCartStore((set) => ({
      cart: [],
      addToCart: (item: CartItem) =>
        set((s) => ({
          cart: [...s.cart, item],
        })),
    }));
  }

  return (
    <CartStoreContext.Provider value={storeRef.current}>
      {children}
    </CartStoreContext.Provider>
  );
};

export function useCartStore(): CartStoreApi;
export function useCartStore<U>(selector: (state: CartStoreApi) => U): U;
export function useCartStore<U>(selector?: (state: CartStoreApi) => U) {
  const store = useContext(CartStoreContext);

  if (store === null) {
    throw new Error("useCartStore must be used within a CartProvider");
  }

  return selector ? store(selector) : store();
}
