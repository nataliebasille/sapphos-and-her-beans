"use client";

import { type Product } from "~/server/actions/products";
import { createStore } from "./creator/create-store";

type ProductListStoreData = {
  products: Product[];
};

export const { Provider: ProductListProvider, useStore: useProductListStore } =
  createStore<ProductListStoreData>({
    products: [],
  });
