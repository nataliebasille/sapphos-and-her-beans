import "server-only";
import { stripe } from "~/server/+utils/stripe";
import { unstable_cache } from "next/cache";

export type Product = {
  id: string;
  name: string | null;
  price: number;
  sizeOunces: string;
  image: string;
  tastingNotes?: string;
  processing?: string;
  country?: string;
  region?: string;
  lot?: string;
  story?: string;
  featured?: boolean;
};

export const getProducts = unstable_cache(
  async () => {
    const products = await stripe.products.list({
      active: true,
      expand: ["data.default_price"],
    });

    return products.data.map(
      (p) =>
        ({
          id: p.id,
          name: p.name,
          price:
            ((p.default_price as typeof p.default_price & object)
              ?.unit_amount ?? 0) / 100,
          sizeOunces: p.metadata.size_ounces ?? "",
          image: p.images[0] ?? "/images/placeholder coffee bag.jpg",
          tastingNotes: p.metadata.tasting_notes,
          processing: p.metadata.processing,
          country: p.metadata.country,
          region: p.metadata.region,
          lot: p.metadata.lot,
          story: p.metadata.story,
          featured: p.metadata.featured === "true",
        }) satisfies Product,
    );
  },
  ["products"],
  {
    tags: ["products"],
  },
);
