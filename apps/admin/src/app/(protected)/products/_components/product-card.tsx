import { type ProductListItem } from "~/server/products/queries";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { Button } from "~/lib/client/ui/button";

export function ProductCard({
  product,
  className,
}: {
  product: ProductListItem;
  className: string;
}) {
  return (
    <div
      className={twMerge(
        "card-surface card card-soft relative flex flex-col overflow-hidden",
        className,
      )}
    >
      {product.isNew ? (
        <div className="absolute left-[1rem] top-[1rem] z-50 rounded-full border border-surface-800 bg-primary-500 px-4 uppercase text-primary-contrast-500">
          NOT PUBLISHED
        </div>
      ) : (
        false
      )}
      <div className="w-100 relative flex-1">
        <Image
          src={product.image}
          alt={product.name ?? ""}
          className="object-cover"
          fill
        />
      </div>

      <div className="card-content">
        <div className="flex-initial">
          <div className="text-2xl font-bold tracking-wide">{product.name}</div>
          <div className="text-secondary-contrast-base/70">
            ${product.price} - {product.sizeOunces} oz
          </div>
          <div>{product.tastingNotes}</div>
        </div>

        <div className="mt-auto flex border-t border-primary-base/30 pt-2">
          <button className="btn-primary btn btn-sm ml-auto px-3 uppercase">
            Edit
          </button>
          <Button
            variant="danger"
            style="solid"
            size="sm"
            className="ml-2 uppercase"
          >
            Delete
          </Button>
          {/* <button className="btn btn-sm ml-2 bg-red-700 uppercase text-white hover:bg-red-800">
            Delete
          </button> */}
        </div>
      </div>
    </div>
  );
}
