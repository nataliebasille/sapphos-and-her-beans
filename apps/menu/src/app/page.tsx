import { Stripe, stripe } from "@/server/+utils/stripe";
import Image from "next/image";
import { Fragment } from "react/jsx-runtime";

export const revalidate = 60;

export default async function LandingPage() {
  const products = await getProducts();

  return (
    <div className="mx-auto w-full p-6">
      <Image
        src="/images/Sappho no background - cropped.png"
        className="mx-auto"
        alt="Sappho Logo"
        width={200}
        height={200}
      />

      <div className="mt-4">
        {products.map(
          ({ country, farm, lot, tastingNotes, products }, index) => (
            <div key={`${country}-${farm}-${lot}`}>
              <hr className="my-6" />
              <h2 className="text-3xl font-bold tracking-wider">
                {country} {farm}
              </h2>
              <p className="italic text-xl">{tastingNotes}</p>
              <div className="mt-3 grid gap-2 gap-x-4 flex-col grid-cols-2 justify-self-start text-2xl">
                {products.map(({ price, size }) => (
                  <Fragment key={size}>
                    <span className="text-right">
                      {size === "singleserve" ? "Single Serve" : `${size}g`}
                    </span>
                    <span className="font-bold tracking-wider">
                      ${price.toFixed(2)}
                    </span>
                  </Fragment>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

async function getProducts() {
  const stripeProducts = await stripe.products.list({
    active: true,
    expand: ["data.default_price"],
  });

  const productsById = stripeProducts.data.reduce(
    (acc, product) => {
      const key = `${product.metadata.country}-${product.metadata.farm}-${product.metadata.lot}`;

      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(
        product as Stripe.Product & { default_price: Stripe.Price }
      );
      return acc;
    },
    {} as Record<
      string,
      Array<Stripe.Product & { default_price: Stripe.Price }>
    >
  );

  return Object.entries(productsById).map(
    ([, products]) =>
      ({
        country: products[0].metadata.country,
        farm: products[0].metadata.farm,
        lot: products[0].metadata.lot,
        tastingNotes: products[0].metadata.tasting_notes.replace('lynchee', 'lychee'),
        products: products
          .map((product) => ({
            price: (product.default_price.unit_amount ?? 0) / 100,
            size: product.metadata.size.endsWith("g")
              ? parseInt(product.metadata.size)
              : (product.metadata.size as "singleserve"),
          }))
          .sort((a, b) =>
            a.size === "singleserve"
              ? -1
              : b.size === "singleserve"
                ? 1
                : a.size - b.size
          ),
      }) as const
  );
}
