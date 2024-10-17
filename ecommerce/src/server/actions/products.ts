import "server-only";
import { unstable_cache } from "next/cache";
import { db, schema } from "@db";
import { and, eq } from "drizzle-orm";

export type Product = Awaited<ReturnType<typeof getProducts>>[number];

export const getProducts = unstable_cache(
  async () => {
    const products = (
      await db
        .select()
        .from(schema.productVersions)
        .innerJoin(
          schema.products,
          and(
            eq(schema.productVersions.productId, schema.products.id),
            eq(schema.products.publishedVersionId, schema.productVersions.id),
          ),
        )
    ).map(({ product_version }) => {
      product_version.image =
        product_version.image ?? "/images/placeholder coffee bag.jpg";
      return product_version;
    });
    return Promise.resolve(products);
  },
  ["products"],
  {
    tags: ["products"],
  },
);
