import { useCallback } from "react";
import { useProductsSelector } from "./products-provider";
import { products } from "@models";

export type Product = products.Product;
export type Coffee = products.ProductWithVariants<Product>;

export const useCoffeeList = () => {
  return useProductsSelector((s) => s.coffees);
};

/** Every purchasable size as a full product. */
export const useProductList = () => {
  return useProductsSelector((s) => s.products);
};

export const useProduct = (id: string) => {
  return useProductsSelector(
    useCallback(({ products }) => products.find((x) => x.id === id), [id]),
  );
};
