import { useCallback } from "react";
import { type CartItem, useCartStoreApi } from "./cart-provider";

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

export function useSetCartItemQuantity() {
  const store = useCartStoreApi();

  return useCallback(
    (id: number, quantity: number) => {
      const storeValue = store.get();
      const currentItem = storeValue.cart[id] ?? { quantity: 0 };
      const updatedItem = {
        ...currentItem,
        quantity,
      };
      store.set({
        cart: {
          ...storeValue.cart,
          [id]: updatedItem,
        },
      });
    },
    [store],
  );
}
