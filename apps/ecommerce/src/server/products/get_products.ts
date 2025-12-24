import "server-only";
import { unstable_cache } from "next/cache";
import { stripe } from "~/server/+utils/stripe";
import { products } from "@models";

export type Product_v2 = {
  id: string;
  name: string | null;
  price: number;
  sizeOunces?: never;
  // eslint-disable-next-line @typescript-eslint/ban-types
  size: "singleserve" | `${number}${"g" | "oz"}` | (string & {});
  image?: never;
  tastingNotes?: string;
  processing?: string;
  country?: string;
  region?: string;
  lot?: string;
  story?: string;
  featured?: boolean;
  color:
    | "cyan"
    | "sky"
    | "yellow"
    | "rose"
    | "slate"
    | "purple"
    | "amber"
    | "emerald";
  isDecaf: boolean;
  farm: string;
  traceable: string;
  altitude?: string;
  varietals?: string;
  fermentation: false | string;
  score?: number;
};

export const getProducts = unstable_cache(
  async () => {
    const products = await stripe.products.list({
      active: true,
      limit: 100,
      expand: ["data.default_price"],
    });

    return products.data.map((p) => {
      const price =
        ((p.default_price as typeof p.default_price & object)?.unit_amount ??
          0) / 100;

      const fermentation = normalizeFermentation(p.metadata.fermentation);
      return {
        type: 'coffee',
        id: p.id,
        name: p.name,
        price: price,
        color: p.metadata.label_color as products.Product["color"],
        size: p.metadata.size ?? "",
        region: p.metadata.region,
        farm: p.metadata.farm ?? "",
        traceable: p.metadata.traceable ?? "",
        altitude: p.metadata.altitude,
        varietals: p.metadata.varietals,
        fermentation,
        score: p.metadata.score ? Number(p.metadata.score) : undefined,
        tastingNotes: p.metadata.tasting_notes,
        processing: p.metadata.processing,
        country: p.metadata.country,
        lot: p.metadata.lot,
        featured: p.metadata.featured === "true",
        isDecaf: p.metadata.decaf === "true",
          } satisfies products.Product;
    })
  },
  ["products"],
  {
    revalidate: 1,
    tags: ["products"],
  },
);

function normalizeFermentation(fermentation: string | false | undefined) {
  if(!fermentation) return undefined;

  if(fermentation.endsWith("hours")) return fermentation as products.Product['fermentation'];

  const parsed = safeParse<products.Product['fermentation']>(fermentation);
  if(parsed) return parsed;

  return { type: 'cofermentation',ingredient: fermentation} satisfies products.Product['fermentation'];
}

function safeParse<T>(value: string): T | undefined {
  try {
    return JSON.parse(value) as T;
  } catch {
    return undefined;
  } 
}
