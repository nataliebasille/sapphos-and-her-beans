import { PaperAirplaneSVG } from "@natcore/design-system-core/src/icons/paper-airplane";
import { Button } from "~/lib/client/ui/button";

import { unstable_cache } from "next/cache";
import { Suspense } from "react";
import { protectedRpcClient } from "~/server/client/rpc-client";
import { db } from "@db";
import { products, productVersions } from "@db/schema";
import { and, eq, isNull, max, ne, or, sql } from "drizzle-orm";
import { PublishButtonView } from "./view";
import { LoadingIndicator } from "~/lib/client/ui/loading-indicator";

const getPublishableItemsCached = unstable_cache(
  async () => {
    const latestUpdatedAt = db
      .select({
        latest_updated_at: max(productVersions.updatedAt).as(
          "latest_updated_at",
        ),
        version_id: productVersions.id,
      })
      .from(productVersions)
      .groupBy(productVersions.id)
      .as("latestUpdatedAt");

    return db
      .select({
        name: productVersions.name,
        price: productVersions.price,
        tastingNotes: productVersions.tastingNotes,
        story: productVersions.story,
        image: productVersions.image,
        sizeOunces: productVersions.sizeOunces,
        isNew: sql<boolean>`${products.publishedVersionId} is null`.as("isNew"),
      })
      .from(productVersions)
      .innerJoin(
        latestUpdatedAt,
        and(
          eq(productVersions.updatedAt, latestUpdatedAt.latest_updated_at),
          eq(productVersions.id, latestUpdatedAt.version_id),
        ),
      )
      .innerJoin(products, eq(productVersions.productId, products.id))
      .where(sql<boolean>`${products.publishedVersionId} is null`);
  },
  ["publishable"],
  {
    tags: ["publishable"],
  },
);

const getPublishableItems = async () => {
  return await protectedRpcClient.action(async function () {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return await getPublishableItemsCached();
  })();
};

async function PublishButtonActionable() {
  const publishableItems = await getPublishableItems();
  return (
    <PublishButtonView
      disabled={
        publishableItems.type !== "ok" || publishableItems.value.length === 0
      }
    >
      <PaperAirplaneSVG className="size-5" />
    </PublishButtonView>
  );
}

export function PublishButton() {
  return (
    <Suspense
      key={Math.random()}
      fallback={
        <PublishButtonView disabled>
          <LoadingIndicator size={20} width={4} />
        </PublishButtonView>
      }
    >
      <PublishButtonActionable />
    </Suspense>
  );
}
