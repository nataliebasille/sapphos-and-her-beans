"use client";

import { createStore } from "../_creator/create-store";
import type { LegacyProduct, Product } from "./queries";

export type ProductsStoreData = {
  products: (Product | LegacyProduct)[];
};

export const { Provider: ProductsProvider, useSelector: useProductsSelector } =
  createStore<ProductsStoreData>({
    products: [],
  });
