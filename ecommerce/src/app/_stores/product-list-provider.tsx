"use client";

import { createContext, useContext, useRef } from "react";
import { create } from "zustand";
import { type Product } from "~/server/actions/products";

type ProductListStoreApi = {
  products: Product[];
};

const createProductListStore = create<ProductListStoreApi>();
const ProductListStoreContext = createContext<ReturnType<
  typeof createProductListStore
> | null>(null);

export const ProductListProvider = ({
  children,
  products,
}: {
  children: React.ReactNode;
  products: Product[];
}) => {
  const storeRef = useRef<ReturnType<typeof createProductListStore> | null>(
    null,
  );

  if (storeRef.current === null) {
    storeRef.current = createProductListStore(() => ({ products }));
  }

  return (
    <ProductListStoreContext.Provider value={storeRef.current}>
      {children}
    </ProductListStoreContext.Provider>
  );
};

export function useProductListStore(): ReturnType<
  typeof createProductListStore
>;
export function useProductListStore<U>(
  selector: (state: ProductListStoreApi) => U,
): U;
export function useProductListStore<U>(
  selector?: (state: ProductListStoreApi) => U,
) {
  const store = useContext(ProductListStoreContext);

  if (store === null) {
    throw new Error(
      "useProductListStore must be used within a ProductListProvider",
    );
  }

  return selector ? store(selector) : store();
}
