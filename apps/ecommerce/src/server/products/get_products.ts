import "server-only";
import { unstable_cache } from "next/cache";
import { stripe } from "~/server/+utils/stripe";

export type LegacyProduct = {
  id: string;
  color?: never;
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
  isDecaf: boolean;
};

export type Product = {
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

const MEXICO = {
  id: "1000",
  name: "Mexico - Red de Totutla - 250g",
  price: 24,
  size: "250g",
  tastingNotes:
    "Almond, chocolate covered white cherry, chardonnay, raisin, lemon",
  processing: "Washed",
  country: "Mexico",
  region: "Totutla, Puebla",
  lot: "Totutla Community",
  isDecaf: false,
  color: "cyan",
  farm: "Red de Totutla",
  traceable: "11 families",
  altitude: "1200 - 1450",
  varietals: "Typica, Bourbon, Caturra",
  fermentation: false,
} satisfies Product;

const COFERMENTED_WINE_YEAST_LYNCHEE = {
  id: "2000",
  name: "Colombia - Co-fermented with Wine Yeast / Lychee - 250g",
  price: 35,
  country: "Colombia",
  color: "purple",
  farm: "Jairo Arcila",
  tastingNotes: "Sweet lynchee, tropical fruits, brown sugar, lime",
  processing: "Washed",
  lot: "Santa Monica",
  region: "Quindio",
  varietals: "CASTILLO",
  size: "250g",
  traceable: "Jairo Arcila",
  altitude: "1450-1500 meters",
  fermentation: "Wine Yeast / Lychee",
  isDecaf: false,
  featured: true,
} satisfies Product;

const ETHIOPIA_YIRGACHEFF_BANKO_GOTITI = {
  id: "3000",
  name: "Ethiopia Yirgacheffe - Banko Gotiti Gr 1 - 250g",
  country: "Ethiopia Yirgacheffe",
  color: "emerald",
  farm: "Banko Gotiti Gr 1",
  tastingNotes: "Jasmine, Lavender, Fresh rue, Rosemary",
  processing: "Natural",
  lot: "100",
  region: "Banko Gotiti, Yirgacheffe",
  varietals: "Heirloom",
  price: 27,
  size: "250g",
  traceable: "320 farmers",
  altitude: "2059 meters",
  score: 91.5,
  fermentation: false,
  isDecaf: false,
  featured: true,
} satisfies Product;

const KENYA_NYERI_NYERI_GICHICHI_AA = {
  id: "4000",
  country: "Kenya",
  name: "Kenya - Nyeri Gichichi AA - 250g",
  price: 27,
  score: 91,
  color: "amber",
  farm: "Gichichi AA",
  lot: "19",
  size: "250g",
  region: "Gichichi, Nyeri County",
  processing: "Washed",
  varietals: "Bourbon",
  traceable: "477 Farms",
  altitude: "1800 meters",
  tastingNotes: "Sugar cane, Dried ginger, Green tea, Lime zest",
  featured: false,
  fermentation: false,
  isDecaf: false,
} satisfies Product;

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
      return p.metadata.label_color ?
          ({
            id: p.id,
            name: p.name,
            price: price,
            color: p.metadata.label_color as Product["color"],
            size: p.metadata.size ?? "",
            region: p.metadata.region,
            farm: p.metadata.farm ?? "",
            traceable: p.metadata.traceable ?? "",
            altitude: p.metadata.altitude,
            varietals: p.metadata.varietals,
            fermentation: p.metadata.fermentation ?? false,
            score: p.metadata.score ? Number(p.metadata.score) : undefined,
            tastingNotes: p.metadata.tasting_notes,
            processing: p.metadata.processing,
            country: p.metadata.country,
            lot: p.metadata.lot,
            featured: p.metadata.featured === "true",
            isDecaf: p.metadata.decaf === "true",
          } satisfies Product)
        : ({
            id: p.id,
            name: p.name,
            price: price,
            sizeOunces: p.metadata.size_ounces ?? "",
            image: p.images[0] ?? "/images/placeholder coffee bag.jpg",
            tastingNotes: p.metadata.tasting_notes,
            processing: p.metadata.processing,
            country: p.metadata.country,
            region: p.metadata.region,
            lot: p.metadata.lot,
            story: p.metadata.story,
            featured: p.metadata.featured === "true",
            isDecaf: p.metadata.decaf === "true",
          } satisfies LegacyProduct);
    }) satisfies (Product | LegacyProduct)[];
  },
  ["products"],
  {
    revalidate: 1,
    tags: ["products"],
  },
);
