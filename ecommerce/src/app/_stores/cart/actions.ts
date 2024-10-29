import { useCallback } from "react";
import { type CartItem, useCartStoreApi } from "./cart-provider";

export function useAddToCart() {
  const store = useCartStoreApi();
  return useCallback(
    (productId: string, item: CartItem) => {
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
    (id: string, quantity: number) => {
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

export function useRemoveCartItem() {
  const store = useCartStoreApi();

  return useCallback(
    (id: number) => {
      const storeValue = store.get();
      const currentItem = storeValue.cart[id];
      if (!currentItem) {
        return;
      }
      const { [id]: _, ...cart } = storeValue.cart;
      store.set({
        cart,
      });
    },
    [store],
  );
}

export function useEmptyCart() {
  const store = useCartStoreApi();

  return useCallback(() => {
    store.set({ cart: {} });
  }, [store]);
}
