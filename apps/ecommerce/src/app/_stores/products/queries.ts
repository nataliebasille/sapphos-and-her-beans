import { useCallback } from "react";
import { useProductsSelector } from "./products-provider";
import { products } from "@models";

export type Product = products.Product;

export const useProductList = () => {
  return useProductsSelector((s) => s.products);
};

export const useProduct = (id: string) => {
  return useProductsSelector(
    useCallback(({ products }) => products.find((x) => x.id === id), [id]),
  );
};
