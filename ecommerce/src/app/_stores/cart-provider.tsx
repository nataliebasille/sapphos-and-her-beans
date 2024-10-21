"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocalStorageState } from "../_hooks/useLocalStorageState";
import { createStore } from "./creator/create-store";
import { useProductListStore } from "./product-list-provider";

export type CartItem = {
  quantity: number;
};

type CartStoreData = { cart: Record<number, CartItem>; opened: boolean };

const IS_SERVER = typeof window === "undefined";
const {
  Provider: InternalCartProvider,
  useStore: useCartStore,
  useStoreApi: useCartStoreApi,
} = createStore<CartStoreData>({
  cart: {},
  opened: false,
});
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const products = useProductListStore((s) => s.products);
  const [cartItems, setCartItems] = useLocalStorageState<CartStoreData["cart"]>(
    "cart-items",
    {},
  );

  const onSet = useCallback(
    (value: CartStoreData) => {
      setCartItems(value.cart);
      return value;
    },
    [setCartItems],
  );

  return (
    <InternalCartProvider
      onSet={onSet}
      initialValue={{ cart: cartItems, opened: false }}
    >
      <LoadCart>{children}</LoadCart>
    </InternalCartProvider>
  );
};

// Fix for hydration issue. Since localStorage is not available on the server,
// the initial value is always empty. This causes the cart to be empty on the
// when the page loads. This component loads the cart items in to
// the store on the client after the initial hydration phase.
function LoadCart({ children }: { children: React.ReactNode }) {
  const [clientHydrationDone, setClientHydrationDone] = useState(false);
  const itemsHaveBeenSet = useRef(false);
  const doubleUseEffectPassResolved = useRef(false);
  const [cartItems] = useLocalStorageState<CartStoreData["cart"]>(
    "cart-items",
    {},
  );

  const { set: setCart } = useCartStoreApi();

  useEffect(() => {
    if (IS_SERVER) {
      return;
    }

    if (clientHydrationDone && !itemsHaveBeenSet.current) {
      itemsHaveBeenSet.current = true;
      setCart({ cart: cartItems });
    }
  }, [cartItems, setCart, clientHydrationDone]);

  useEffect(() => {
    if (IS_SERVER) {
      return;
    }

    if (doubleUseEffectPassResolved.current) {
      setTimeout(() => setClientHydrationDone(true), 0);
    }
    doubleUseEffectPassResolved.current = true;
  }, []);

  return <>{children}</>;
}

export { useCartStore };

export function useAddToCart() {
  const store = useCartStoreApi();
  return useCallback(
    (productId: number, item: CartItem) => {
      const storeValue = store.get();
      const currentItem = storeValue.cart[productId] ?? { quantity: 0 };
      const updatedItem = {
        ...currentItem,
        quantity: currentItem.quantity + item.quantity,
      };
      currentItem.quantity += item.quantity;
      store.set({
        cart: {
          ...storeValue.cart,
          [productId]: updatedItem,
        },
      });
    },
    [store],
  );
}

export function useOpenCart() {
  const store = useCartStoreApi();

  return useCallback(() => {
    store.set({ opened: true });
  }, [store]);
}

export function useCloseCart() {
  const store = useCartStoreApi();

  return useCallback(() => {
    store.set({ opened: false });
  }, [store]);
}

export function cartQuantity(state: CartStoreData) {
  return Object.values(state.cart).reduce(
    (acc, item) => acc + item.quantity,
    0,
  );
}
