import { useCallback } from "react";
import type { LegacyProduct, Product } from "~/server/products/get_products";
import { useProductsSelector } from "./products-provider";

export type { LegacyProduct, Product } from "~/server/products/get_products";

export const useProductList = () => {
  return useProductsSelector((s) => s.products);
};

export const useProduct = (id: string) => {
  return useProductsSelector(
    useCallback(({ products }) => products.find((x) => x.id === id), [id]),
  );
};

export const isLegacyProduct = (
  product: Product | LegacyProduct,
): product is LegacyProduct => {
  return (product as Product).color === undefined;
};

export const isProduct = (
  product: Product | LegacyProduct,
): product is Product => {
  return !isLegacyProduct(product);
};
