import { db } from "@db";
import { productVersions } from "@db/schema";
import { and, eq, max } from "drizzle-orm";
import Link from "next/link";
import { getProduct } from "~/server/products/queries";

export default async function ProductsPage() {
  // const latestUpdatedAt = db
  //   .select({
  //     latest_updated_at: max(productVersions.updatedAt).as("latest_updated_at"),
  //     version_id: productVersions.id,
  //   })
  //   .from(productVersions)
  //   .groupBy(productVersions.id)
  //   .as("latestUpdatedAt");

  // const latestProductVersions = await db
  //   .select({
  //     id: productVersions.id,
  //     name: productVersions.name,
  //     price: productVersions.price,
  //     tastingNotes: productVersions.tastingNotes,
  //   })
  //   .from(productVersions)
  //   .innerJoin(
  //     latestUpdatedAt,
  //     and(
  //       eq(productVersions.updatedAt, latestUpdatedAt.latest_updated_at),
  //       eq(productVersions.id, latestUpdatedAt.version_id),
  //     ),
  //   );

  const latestProductVersions = [await getProduct(0)];

  return (
    <div className="grid h-80 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {latestProductVersions.map((value) => (
        <div key={value?.id} className="card card-secondary card-soft">
          <div className="card-content"></div>
        </div>
      ))}
      <Link
        href="/products/add"
        className="btn-primary btn btn-outline card card-secondary card-ghost flex items-center justify-center border-dashed font-bold uppercase opacity-80 hover:!bg-secondary-base hover:!text-secondary-contrast-base"
        prefetch
      >
        + Add product
      </Link>
    </div>
  );
}
