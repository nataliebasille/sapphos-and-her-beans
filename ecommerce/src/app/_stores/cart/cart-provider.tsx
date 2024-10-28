"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocalStorageState } from "../../_hooks/useLocalStorageState";
import { createStore } from "../_creator/create-store";
import { useProductList } from "../products/queries";

export type CartItem = {
  quantity: number;
};

export type CartStoreData = {
  cart: Record<string, CartItem>;
  opened: boolean;
  hydrated: boolean;
};

const IS_SERVER = typeof window === "undefined";
const {
  Provider: InternalCartProvider,
  useSelector: useCartSelector,
  useStoreApi: useCartStoreApi,
} = createStore<CartStoreData>({
  cart: {},
  opened: false,
  hydrated: false,
});
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const products = useProductList();
  const productIds = useMemo(
    () => new Set(products.map((p) => p.id)),
    [products],
  );
  const [cartItemsStorage, setCartItemsStorage] = useLocalStorageState<
    CartStoreData["cart"]
  >("cart-items", {});

  const onSet = useCallback(
    (value: CartStoreData) => {
      const newValue = {
        ...value,
        cart: ensureOnlyValidCartItems(value.cart, productIds),
      };
      setCartItemsStorage(newValue.cart);
      return newValue;
    },
    [productIds, setCartItemsStorage],
  );

  return (
    <InternalCartProvider
      onSet={onSet}
      initialValue={{
        cart: ensureOnlyValidCartItems(cartItemsStorage, productIds),
        opened: false,
        hydrated: false,
      }}
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
      setCart({ cart: cartItems, hydrated: true });
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

export { useCartSelector, useCartStoreApi };

export function cartQuantity(state: CartStoreData) {
  return Object.values(state.cart).reduce(
    (acc, item) => acc + item.quantity,
    0,
  );
}

function ensureOnlyValidCartItems(
  cart: CartStoreData["cart"],
  productIds: Set<string>,
) {
  return Object.fromEntries(
    Object.entries(cart).filter(([id]) => productIds.has(id)),
  );
}
