import { db } from "@db";
import { products, productVersions } from "@db/schema";
import { eq, and, sql } from "drizzle-orm";

export const getProduct = async (id: number) => {
  const result = await db.query.products.findFirst({
    columns: {},
    where: eq(products.id, id),
    with: {
      publishedVersion: {
        columns: {
          name: true,
          price: true,
          sizeOunces: true,
          tastingNotes: true,
          story: true,
          image: true,
        },
        extras: {
          id: sql<number>`${productVersions.id}`.as("id"),
        },
      },
    },
  });

  return result?.publishedVersion;
};
