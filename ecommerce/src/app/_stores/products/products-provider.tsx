"use client";

import { type Product } from "~/server/actions/products";
import { createStore } from "../_creator/create-store";

export type ProductsStoreData = {
  products: Product[];
};

export const { Provider: ProductsProvider, useSelector: useProductsSelector } =
  createStore<ProductsStoreData>({
    products: [],
  });
