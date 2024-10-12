import { db } from "@db";
import { products, productVersions } from "@db/schema";
import { eq, and, sql, max, ne, or, isNull } from "drizzle-orm";

export type ProductListItem = Awaited<ReturnType<typeof listProducts>>[number];
export const listProducts = async () => {
  const latestUpdatedAt = db
    .select({
      latest_updated_at: max(productVersions.updatedAt).as("latest_updated_at"),
      version_id: productVersions.id,
    })
    .from(productVersions)
    .groupBy(productVersions.id)
    .as("latestUpdatedAt");

  const latestProducts = await db
    .select({
      id: productVersions.id,
      name: productVersions.name,
      price: productVersions.price,
      tastingNotes: productVersions.tastingNotes,
      story: productVersions.story,
      image: productVersions.image,
      sizeOunces: productVersions.sizeOunces,
      isNew: sql<boolean>`${products.publishedVersionId} is null`.as("isNew"),
      hasUnpublishedChanges: or(
        isNull(products.publishedVersionId),
        ne(products.publishedVersionId, productVersions.id),
      )!.as<boolean>("hasUnpublishedChanges"),
    })
    .from(productVersions)
    .innerJoin(
      latestUpdatedAt,
      and(
        eq(productVersions.updatedAt, latestUpdatedAt.latest_updated_at),
        eq(productVersions.id, latestUpdatedAt.version_id),
      ),
    )
    .innerJoin(products, eq(productVersions.productId, products.id));

  return latestProducts;
};

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
