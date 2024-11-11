"use client";

import { type Product } from "~/server/products/get_products";
import { createStore } from "../_creator/create-store";

export type ProductsStoreData = {
  products: Product[];
};

export const { Provider: ProductsProvider, useSelector: useProductsSelector } =
  createStore<ProductsStoreData>({
    products: [],
  });
