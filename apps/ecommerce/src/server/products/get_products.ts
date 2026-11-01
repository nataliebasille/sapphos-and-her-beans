import "server-only";
import { unstable_cache } from "next/cache";
import { stripe } from "~/server/+utils/stripe";
import { products } from "@models";

export type Product_v2 = {
  id: string;
  name: string | null;
  price: number;
  sizeOunces?: never;
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
    // When Stripe isn't configured (local/preview without a key), fall back to
    // the repo's seed catalog so the storefront still renders.
    if (!process.env.STRIPE_KEY) {
      return sortCoffees(fallbackProducts());
    }

    let list;
    try {
      list = await stripe.products.list({
        active: true,
        limit: 100,
        expand: ["data.default_price"],
      });
    } catch (error) {
      if (shouldUseFallbackProducts()) {
        console.warn(
          "Unable to load products from Stripe; using seed catalog.",
          error,
        );
        return sortCoffees(fallbackProducts());
      }

      throw error;
    }

    const variants = list.data.map((p) => {
      const price =
        ((p.default_price as typeof p.default_price & object)?.unit_amount ??
          0) / 100;

      const fermentation = normalizeFermentation(p.metadata.fermentation);
      return {
        type: "coffee",
        id: p.id,
        name: p.metadata.product_name ?? legacyCoffeeName(p.name),
        deprecated_stripe_name: p.name,
        price: price,
        active: p.active,
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
    });

    return sortCoffees(
      groupStripeVariants(
        list.data.map((p, i) => ({
          coffeeId: p.metadata.product_id ?? legacyCoffeeId(p.name),
          variant: variants[i]!,
        })),
      ),
    );
  },
  ["products"],
  {
    revalidate: 1,
    tags: ["products"],
  },
);

type CatalogCoffee = products.ProductWithVariants<products.Product>;

/** Coffees ordered by country of origin. */
function sortCoffees(coffees: CatalogCoffee[]): CatalogCoffee[] {
  return [...coffees].sort((a, b) =>
    (a.country ?? "").localeCompare(b.country ?? ""),
  );
}

/** Every purchasable size as a full product, keyed by its Stripe product id. */
export async function getProductVariants(): Promise<products.Product[]> {
  return (await getProducts()).flatMap((coffee) =>
    products.resolveVariants(coffee),
  );
}

/** Only coffees and sizes flagged active in the seed catalog. */
function fallbackProducts(): CatalogCoffee[] {
  return products.PRODUCTS.map((coffee): CatalogCoffee => ({
    ...coffee,
    variants: coffee.variants.filter((variant) => variant.active),
  })).filter((coffee) => coffee.variants.length > 0);
}

/** Stripe stores one product per size; collapse them back into coffees. */
function groupStripeVariants(
  rows: { coffeeId: string; variant: products.Product }[],
): CatalogCoffee[] {
  const coffees = new Map<string, CatalogCoffee>();
  for (const { coffeeId, variant } of rows) {
    const { type: _, ...overrides } = variant;
    const existing = coffees.get(coffeeId);
    if (existing) {
      coffees.set(coffeeId, {
        ...existing,
        variants: [...existing.variants, overrides],
      });
    } else {
      coffees.set(coffeeId, {
        ...variant,
        id: coffeeId,
        variants: [overrides],
      });
    }
  }
  return [...coffees.values()];
}

// Stripe products seeded before `product_id`/`product_name` metadata existed are
// named "Origin - Coffee name - Size".
function legacyCoffeeId(stripeName: string) {
  const parts = stripeName.split(" - ");
  return parts.length >= 2 ? parts.slice(0, -1).join(" - ") : stripeName;
}

function legacyCoffeeName(stripeName: string) {
  const parts = stripeName.split(" - ");
  return parts.length >= 3 ? parts.slice(1, -1).join(" - ") : stripeName;
}

function shouldUseFallbackProducts() {
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.DEPLOYMENT_TYPE !== "PRODUCTION"
  );
}

function normalizeFermentation(fermentation: string | false | undefined) {
  if (!fermentation) return undefined;

  if (fermentation.endsWith("hours"))
    return fermentation as products.Product["fermentation"];

  const parsed = safeParse<products.Product["fermentation"]>(fermentation);
  if (parsed) return parsed;

  return {
    type: "cofermentation",
    ingredient: fermentation,
  } satisfies products.Product["fermentation"];
}

function safeParse<T>(value: string): T | undefined {
  try {
    return JSON.parse(value) as T;
  } catch {
    return undefined;
  }
}
