"use client";

import { createStore } from "../_creator/create-store";
import type { Coffee, Product } from "./queries";

export type ProductsStoreData = {
  coffees: Coffee[];
  products: Product[];
};

export const { Provider: ProductsProvider, useSelector: useProductsSelector } =
  createStore<ProductsStoreData>({
    coffees: [],
    products: [],
  });
