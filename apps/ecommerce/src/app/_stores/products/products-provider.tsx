"use client";

import { createStore } from "../_creator/create-store";
import type { Product } from "./queries";

export type ProductsStoreData = {
  products: Product[];
};

export const { Provider: ProductsProvider, useSelector: useProductsSelector } =
  createStore<ProductsStoreData>({
    products: [],
  });
