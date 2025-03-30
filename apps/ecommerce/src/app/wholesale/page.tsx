import { twMerge } from "tailwind-merge";
import { Heading } from "../_components/heading";

export default function WholesalesPage() {
  return (
    <div className="px-4 md:px-10">
      <div
        className={twMerge(
          "mb-5 border-b-[1px] border-black/30 md:col-span-2 md:mb-10",
        )}
      >
        <Heading
          level={3}
          className="mb-0 text-center uppercase tracking-wide md:text-left"
        >
          Wholesale
        </Heading>
      </div>

      <div className="text-4xl text-slate-600/80 uppercase tracking-wide text-center">
        Coming soon
      </div>

      {/* <div className="grid gap-4 md:grid-cols-2 md:gap-12 lg:grid-cols-3">
        {products.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div> */}
    </div>
  );
}
