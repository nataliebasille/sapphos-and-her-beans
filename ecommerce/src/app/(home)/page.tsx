import Image from "next/image";
import { getProducts } from "~/server/actions/products";
import { Heading } from "../_components/heading";
import { ProductCard } from "../_components/product-card";
import Link from "next/link";

export default async function HomePage() {
  const products = (await getProducts()).filter((x) => x.featured);
  return (
    <main className="flex flex-col text-white">
      <div className="relative h-[92dvh] w-full">
        <Image
          className="object-cover brightness-50"
          src="/images/beans.jpg"
          alt="Sappho and her beans"
          fill
          priority
        />
        <Image
          className="object-contain"
          src="/images/sappho no background.png"
          alt="Sappho"
          fill
          priority
        />
      </div>

      <div className="relative grid grid-cols-1 flex-row-reverse bg-primary-base !pb-12 tracking-widest text-primary-contrast-base sm:px-20 md:grid-cols-[3fr_2fr] md:gap-4 md:py-4">
        <div className="row-start-2 flex min-w-0 flex-col gap-10 p-0 pb-8 font-thin sm:px-8 md:row-start-1 md:mr-24 md:p-0 md:pt-14 xl:mr-40">
          <span className="flex flex-col items-center justify-center text-center text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
            <span className="text-nowrap">Unique coffee</span>
            <span className="divider divider-secondary w-1/3 !self-center text-sm !font-thin text-white xl:text-base">
              AND
            </span>
            <span>Uncompromised quality</span>
          </span>
          <span className="px-12 !leading-loose sm:p-0 md:text-base md:leading-loose lg:text-xl xl:text-2xl">
            We are a specialty roaster focused on relational coffee. We&apos;re
            constantly talking to new people and making friends, looking for
            that next special harvest. We currently have producing partners in
            Brazil, Ethiopia and Nicaragua where we source direct trade coffee.
          </span>
        </div>
        <div className="px-8 sm:p-0">
          <div className="relative top-[-50px] row-start-1 h-96 overflow-hidden rounded-3xl md:h-full md:w-auto">
            <Image
              src="/images/owner.png"
              alt="Owner"
              fill
              className="object-cover md:object-[25%_bottom]"
              priority
            />
          </div>
        </div>
      </div>

      <div className="bg-surface-base p-8 text-surface-contrast-base">
        <div className="mb-5 flex items-center border-b-[1px] border-black/30 md:col-span-2 md:mb-10">
          <Heading level={3} className="mb-0 uppercase tracking-wide">
            Featured
          </Heading>

          <Link
            href="/shop"
            className="btn-primary btn btn-outline btn-lg mb-2 ml-auto uppercase"
          >
            Shop All
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-20 md:gap-y-12 lg:grid-cols-3 lg:gap-x-8 xl:gap-x-20">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
            // <div
            //   key={product.id}
            //   className="overflow-hidden rounded-2xl shadow-xl shadow-primary-700/25"
            // >
            //   <div className="relative aspect-square h-96 w-full">
            //     <Image
            //       src={product.image}
            //       alt={product.name ?? ""}
            //       fill
            //       className="object-cover"
            //       priority
            //     />
            //   </div>

            //   <div className="text-nowrap bg-secondary-700 p-4 text-xl uppercase text-secondary-contrast-700">
            //     {product.name}
            //   </div>
            // </div>
          ))}
        </div>
      </div>
    </main>
  );
}
