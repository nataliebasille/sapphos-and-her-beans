import Link from "next/link";
import { listProducts } from "~/server/products/queries";
import { ProductCard } from "./_components/product-card";

export default async function ProductsPage() {
  const products = await listProducts();
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {products.map((value) => (
        <ProductCard key={value.id} className="h-96" product={value} />
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
