"use client";

import { useContext, useRef } from "react";
import { type Product } from "~/server/actions/products";
import { createStore } from "../_components/stores/create-store";

type ProductListStoreData = {
  products: Product[];
};

export const { Provider: ProductListProvider, useStore: useProductListStore } =
  createStore<ProductListStoreData>({
    products: [],
  });
