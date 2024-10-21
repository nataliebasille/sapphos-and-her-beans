import { useCallback } from "react";
import { useProductsSelector } from "./products-provider";

export const useProductList = () => {
  return useProductsSelector((s) => s.products);
};

export const useProduct = (id: number) => {
  return useProductsSelector(
    useCallback(({ products }) => products.find((x) => x.id === id), [id]),
  );
};
