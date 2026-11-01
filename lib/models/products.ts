export type BaseProduct<TType extends string = string> = {
  type: TType;
  id: string;
  name: string;
  price: number;
  active: boolean;
  image?: never;
  story?: string;
  featured?: boolean;
  callout?: string;
};

export type ProductVariant<TProduct extends BaseProduct> = Partial<
  Omit<TProduct, "type" | "id">
> & {
  id: string;
};

export type ProductWithVariants<TProduct extends BaseProduct> = TProduct & {
  variants: readonly ProductVariant<TProduct>[];
};

export type CoffeeProduct = BaseProduct<"coffee"> & {
  size: "singleserve" | "100g" | "250g" | (string & {});
  deprecated_stripe_name?: string;
  tastingNotes?: string;
  processing?: string;
  country?: string;
  region?: string;
  lot?: string;
  color:
    | "cyan"
    | "sky"
    | "navy"
    | "yellow"
    | "rose"
    | "slate"
    | "purple"
    | "amber"
    | "emerald"
    | "violet"
    | "pumpkin";
  isDecaf: boolean;
  farm: string;
  traceable: string;
  altitude?: string;
  varietals?: string;
  fermentation?:
    | { type: "cofermentation"; ingredient: string }
    | { type: "anaerobic"; duration?: string }
    | `${number} hours`
    | (string & {});
  score?: number;
};

export type Product = CoffeeProduct;

type ResolvedProduct<TCatalogProduct extends ProductWithVariants<Product>> =
  Extract<Product, { type: TCatalogProduct["type"] }>;

export function resolveVariant<
  TCatalogProduct extends ProductWithVariants<Product>,
>(
  product: TCatalogProduct,
  variant: TCatalogProduct["variants"][number],
): ResolvedProduct<TCatalogProduct> {
  const { variants: _, ...base } = product;
  const overrides = Object.fromEntries(
    Object.entries(variant).filter(([, value]) => value !== undefined),
  );
  return {
    ...base,
    ...overrides,
  } as unknown as ResolvedProduct<TCatalogProduct>;
}

export function resolveVariants<
  TCatalogProduct extends ProductWithVariants<Product>,
>(product: TCatalogProduct): ResolvedProduct<TCatalogProduct>[] {
  return product.variants.map((variant) => resolveVariant(product, variant));
}

export const MEXICO = {
  type: "coffee",
  id: "mexico-red-de-totutla",
  name: "Red de Totutla",
  active: true,
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
  variants: [
    {
      id: "1000",
      deprecated_stripe_name: "Mexico - Red de Totutla - 250g",
      size: "250g",
      price: 24,
      active: true,
    },
    {
      id: "1001",
      deprecated_stripe_name: "Mexico - Red de Totutla - 100g",
      size: "100g",
      price: 12,
      active: true,
    },
    {
      id: "1002",
      deprecated_stripe_name: "Mexico - Red de Totutla - Single Serve",
      size: "singleserve",
      price: 3.5,
      active: true,
    },
  ],
} as const satisfies ProductWithVariants<CoffeeProduct>;

export const COFERMENTED_WINE_YEAST_LYCHEE = {
  type: "coffee",
  id: "colombia-co-fermented-with-wine-yeast-lychee",
  name: "Co-fermented with Wine Yeast / Lychee",
  active: false,
  price: 35,
  size: "250g",
  country: "Colombia",
  color: "purple",
  farm: "Jairo Arcila",
  tastingNotes: "Sweet lychee, tropical fruits, brown sugar, lime",
  processing: "Washed",
  lot: "9",
  region: "Quindio",
  varietals: "CASTILLO",
  traceable: "Jairo Arcila",
  altitude: "1450-1500 meters",
  fermentation: {
    type: "cofermentation",
    ingredient: "Wine Yeast / Lychee",
  },
  isDecaf: false,
  featured: false,
  variants: [
    {
      id: "2000",
      deprecated_stripe_name:
        "Colombia - Co-fermented with Wine Yeast / Lychee - 250g",
      size: "250g",
      price: 35,
      active: false,
    },
    {
      id: "2001",
      deprecated_stripe_name:
        "Colombia - Co-fermented with Wine Yeast / Lychee - 100g",
      size: "100g",
      price: 15,
      active: false,
    },
  ],
} as const satisfies ProductWithVariants<CoffeeProduct>;

export const ETHIOPIA_YIRGACHEFF_BANKO_GOTITI = {
  type: "coffee",
  id: "ethiopia-yirgacheffe-banko-gotiti-gr-1",
  name: "Banko Gotiti Gr 1",
  active: false,
  price: 27,
  size: "250g",
  country: "Ethiopia Yirgacheffe",
  color: "emerald",
  farm: "Banko Gotiti Gr 1",
  tastingNotes: "Jasmine, Lavender, Fresh rue, Rosemary",
  processing: "Natural",
  lot: "100",
  region: "Banko Gotiti, Yirgacheffe",
  varietals: "Heirloom",
  traceable: "320 farmers",
  altitude: "2059 meters",
  score: 91.5,
  isDecaf: false,
  featured: false,
  variants: [
    {
      id: "3000",
      deprecated_stripe_name: "Ethiopia Yirgacheffe - Banko Gotiti Gr 1 - 250g",
      size: "250g",
      price: 27,
      active: false,
    },
    {
      id: "3001",
      deprecated_stripe_name: "Ethiopia Yirgacheffe - Banko Gotti Gr 1 - 100g",
      size: "100g",
      price: 12,
      active: false,
    },
  ],
} as const satisfies ProductWithVariants<CoffeeProduct>;

export const KENYA_NYERI_NYERI_GICHICHI_AA = {
  type: "coffee",
  id: "kenya-nyeri-gichichi-aa",
  name: "Nyeri Gichichi AA",
  active: false,
  price: 27,
  size: "250g",
  country: "Kenya",
  score: 91,
  color: "amber",
  farm: "Gichichi AA",
  lot: "19",
  region: "Gichichi, Nyeri County",
  processing: "Washed",
  varietals: "Bourbon",
  traceable: "477 Farms",
  altitude: "1800 meters",
  tastingNotes: "Sugar cane, Dried ginger, Green tea, Lime zest",
  featured: false,
  isDecaf: false,
  variants: [
    {
      id: "4000",
      deprecated_stripe_name: "Kenya - Nyeri Gichichi AA - 250g",
      size: "250g",
      price: 27,
      active: false,
    },
    {
      id: "4001",
      deprecated_stripe_name: "Kenya - Nyeri Gichichi AA - 100g",
      size: "100g",
      price: 12,
      active: false,
    },
  ],
} as const satisfies ProductWithVariants<CoffeeProduct>;

export const ETHIOPIA_GUJI_TUKU = {
  type: "coffee",
  id: "ethiopia-guji-tuku",
  name: "Guji Tuku",
  active: true,
  price: 30,
  size: "250g",
  country: "Ethiopia",
  color: "rose",
  farm: "Guji Tuku",
  tastingNotes:
    "blueberry, pomegranate molasses, honeydew melon, and coriander",
  processing: "Natural",
  lot: "100",
  region: "\tGerba Dogo, Bule Hora, Guji Zone",
  varietals: "Heirloom Cultivars",
  traceable: "Tuku - Vertically integrated mill",
  altitude: "2125 meters",
  isDecaf: false,
  score: 93.2,
  variants: [
    {
      id: "5000",
      deprecated_stripe_name: "Ethiopia - Guji Tuku - 250g",
      size: "250g",
      price: 30,
      active: false,
    },
    {
      id: "5001",
      deprecated_stripe_name: "Ethiopia - Guji Tuku - 100g",
      size: "100g",
      price: 14,
      active: false,
    },
    {
      id: "5002",
      deprecated_stripe_name: "Ethiopia - Guji Tuku - Single Serve",
      size: "singleserve",
      price: 3.5,
      active: true,
    },
  ],
} as const satisfies ProductWithVariants<CoffeeProduct>;

export const YELLOW_BOURBON_CONCOCTION = {
  type: "coffee",
  id: "nicaragua-yellow-bourbon-concoction",
  name: "Yellow Bourbon Concoction",
  active: true,
  price: 32,
  size: "250g",
  score: 90,
  country: "Nicaragua",
  color: "yellow",
  farm: "Finca Idealista",
  lot: "253.5 lbs",
  tastingNotes: "Rose, papaya, white currant",
  processing: "Honey, natural & carbonic maceration natural",
  region: "Matagalpa, Nicaragua",
  varietals: "100% Yellow Bourbon",
  traceable: "Benjamin Weiner",
  altitude: "1200 meters",
  isDecaf: false,
  featured: false,
  variants: [
    {
      id: "6000",
      deprecated_stripe_name: "Nicaragua - Yellow Bourbon Concoction - 250g",
      size: "250g",
      price: 32,
      active: true,
    },
    {
      id: "6001",
      deprecated_stripe_name: "Nicaragua - Yellow Bourbon Concoction - 100g",
      size: "100g",
      price: 14,
      active: true,
    },
  ],
} as const satisfies ProductWithVariants<CoffeeProduct>;

export const YELLOW_PACAMARA_WASHED = {
  type: "coffee",
  id: "nicaragua-yellow-pacamara-washed",
  name: "Yellow Pacamara Washed",
  active: true,
  price: 32,
  size: "250g",
  score: 89,
  country: "Nicaragua",
  color: "sky",
  farm: "Finca Idealista",
  tastingNotes: "White lifesaver, apple, white sugar",
  processing: "Washed",
  region: "Matagalpa, Nicaragua",
  lot: "202.84 lbs",
  varietals: "Yellow Pacamara",
  traceable: "Benjamin Weiner",
  altitude: "1200 meters",
  isDecaf: false,
  featured: false,
  fermentation: "30.84 hours",
  variants: [
    {
      id: "7000",
      deprecated_stripe_name: "Nicaragua - Yellow Pacamara Washed - 250g",
      size: "250g",
      price: 32,
      active: false,
    },
    {
      id: "7001",
      deprecated_stripe_name: "Nicaragua - Yellow Pacamara Washed - 100g",
      size: "100g",
      price: 14,
      active: false,
    },
    {
      id: "7002",
      deprecated_stripe_name:
        "Nicaragua - Yellow Pacamara Washed - Single Serve",
      size: "singleserve",
      price: 3.5,
      active: true,
    },
  ],
} as const satisfies ProductWithVariants<CoffeeProduct>;

export const MARACATURRA_MACERATION_GRENADINE = {
  type: "coffee",
  id: "nicaragua-maracaturra-maceration-grenadine",
  name: 'Maracaturra Maceration "Grenadine"',
  active: true,
  price: 22,
  size: "100g",
  score: 94,
  country: "Nicaragua",
  color: "slate",
  farm: "GMCG Member Farmers",
  tastingNotes: "Blackberry preserves, concord grape, rose",
  processing: "Carbonic Maceration Natural",
  region: "Jinotega, Nicaragua",
  lot: "152 lbs",
  varietals: "Maracaturra",
  traceable: "Maritza & Francisco",
  altitude: "1350 meters",
  fermentation: {
    type: "anaerobic",
    duration: "181 hours",
  },
  isDecaf: false,
  featured: false,
  variants: [
    {
      id: "8000",
      deprecated_stripe_name:
        'Nicaragua - Maracaturra Maceration "Grenadine" - 100g',
      size: "100g",
      price: 22,
      active: true,
    },
    {
      id: "8001",
      deprecated_stripe_name:
        'Nicaragua - Maracaturra Maceration "Grenadine" - 250g',
      size: "250g",
      price: 45,
      active: true,
    },
  ],
} as const satisfies ProductWithVariants<CoffeeProduct>;

export const CASTILLO_WASHED_WINE_YEAST_BLACKBERRY = {
  type: "coffee",
  id: "colombia-castillo-washed-co-fermented-with-wine-yeast-blackberry",
  name: "Castillo Washed",
  active: true,
  price: 18,
  size: "100g",
  country: "Colombia",
  color: "violet",
  farm: "Jairo Arcila",
  tastingNotes: "Ripe blackberry, dark chocolate, tangerine, caramel",
  processing: "Washed",
  region: "Armenia, Quindio",
  lot: "< 40 52kg bags",
  varietals: "CASTILLO",
  traceable: "Jairo Arcila",
  altitude: "1450-1500 meters",
  fermentation: {
    type: "cofermentation",
    ingredient: "Wine Yeast + Blackberry",
  },
  isDecaf: false,
  featured: false,
  variants: [
    {
      id: "9000",
      deprecated_stripe_name:
        "Colombia - Castillo Washed Co-fermented with Wine Yeast + Blackberry - 100g",
      size: "100g",
      price: 18,
      active: true,
    },
    {
      id: "9001",
      deprecated_stripe_name:
        "Colombia - Castillo Washed Co-fermented with Wine Yeast + Blackberry - 250g",
      size: "250g",
      price: 36,
      active: true,
    },
  ],
} as const satisfies ProductWithVariants<CoffeeProduct>;

export const PUMPKIN_SPICE_MACERATION_MADNESS = {
  type: "coffee",
  id: "nicaragua-pumpkin-spice-maceration-madness",
  name: "Pumpkin Spice Maceration Madness",
  active: true,
  price: 45,
  size: "250g",
  country: "Nicaragua",
  color: "pumpkin",
  farm: "Finca Idealista",
  tastingNotes: "Pumpkin pie, brown sugar, cinnamon, nutmeg",
  processing: "Carbonic maceration double fermentation with pumpkin spice",
  region: "Matagalpa, Nicaragua",
  lot: "NANO",
  varietals: "Pacamara",
  traceable: "Benjamin Weiner",
  altitude: "1200 meters",
  fermentation: {
    type: "cofermentation",
    ingredient: "Pumpkin Spice",
  },
  isDecaf: false,
  featured: false,
  variants: [
    {
      id: "10000",
      deprecated_stripe_name:
        "Nicaragua - Pumpkin Spice Maceration Madness - 250g",
      size: "250g",
      price: 45,
      active: true,
    },
    {
      id: "10001",
      deprecated_stripe_name:
        "Nicaragua - Pumpkin Spice Maceration Madness - 100g",
      size: "100g",
      price: 22,
      active: true,
    },
  ],
} as const satisfies ProductWithVariants<CoffeeProduct>;

export const JINOTEGA_COMMUNITY_COFFEE = {
  type: "coffee",
  id: "nicaragua-jinotega-community-coffee",
  name: "Jinotega Community Coffee",
  active: true,
  price: 28,
  size: "250g",
  country: "Nicaragua",
  color: "sky",
  farm: "Jinotega Community Members",
  tastingNotes: "Cherry, apple, cranberry",
  processing: "Washed",
  lot: "Community",
  region: "Jinotega, Nicaragua",
  varietals: "Red & Yellow Caturra, Red & Yellow Catuai, Bourbon, Pache",
  traceable: "GMCG Member Farmers",
  altitude: "1300 to 1600 meters",
  fermentation: "18.25 hours",
  story:
    "This popular coffee is a great value option without sacrificing quality!",
  isDecaf: false,
  featured: false,
  variants: [
    {
      id: "11000",
      deprecated_stripe_name: "Nicaragua - Jinotega Community Coffee - 250g",
      size: "250g",
      price: 28,
      active: true,
    },
    {
      id: "11001",
      deprecated_stripe_name: "Nicaragua - Jinotega Community Coffee - 100g",
      size: "100g",
      price: 14,
      active: true,
    },
  ],
} as const satisfies ProductWithVariants<CoffeeProduct>;

export const THIS_ISNT_SUMATRA = {
  type: "coffee",
  id: "nicaragua-this-isnt-sumatra",
  name: '"This Isn\'t Sumatra"',
  active: true,
  price: 28,
  size: "250g",
  country: "Nicaragua",
  color: "navy",
  farm: "GMGG Farmers",
  tastingNotes: "Pecan, apple sauce, Brazil nut",
  processing: "Washed",
  lot: "Community",
  region: "Jinotega & Matagalpa, Nicaragua",
  varietals:
    "Catuai, Caturra, Caturra Estrella, Pache Colis, Catimor, Parainema, Siquia",
  traceable: "GMCG Member Farmers",
  altitude: "1200 to 1400 meters",
  callout: "This isn't sumatra?",
  story:
    "What??? This isn't Sumatra? But it tastes just like it (just cleaner)! By cupping every day lot of picking, we're able to find lots with the taste profile of a clean Sumatra. This is a community lot from a handful of Gold Mountain farmers. We did a bunch of experimenting and even tried wet hulling (as is done in Sumatra). In the end, we found ours tastes cleanest by doing regular dry hulling rather than wet hulling--then we search through 3,000+ coffees for this cup profile. This is a really awesome and more dependable alternative if you're looking for a Sumatra taste profile.",
  isDecaf: false,
  featured: false,
  variants: [
    {
      id: "12000",
      deprecated_stripe_name: "Nicaragua - This Isn't Sumatra - 250g",
      size: "250g",
      price: 28,
      active: true,
    },
    {
      id: "12001",
      deprecated_stripe_name: "Nicaragua - This Isn't Sumatra - 100g",
      size: "100g",
      price: 14,
      active: true,
    },
  ],
} as const satisfies ProductWithVariants<CoffeeProduct>;

export const PRODUCTS = [
  MEXICO,
  COFERMENTED_WINE_YEAST_LYCHEE,
  ETHIOPIA_YIRGACHEFF_BANKO_GOTITI,
  KENYA_NYERI_NYERI_GICHICHI_AA,
  CASTILLO_WASHED_WINE_YEAST_BLACKBERRY,
  ETHIOPIA_GUJI_TUKU,
  YELLOW_BOURBON_CONCOCTION,
  YELLOW_PACAMARA_WASHED,
  MARACATURRA_MACERATION_GRENADINE,
  PUMPKIN_SPICE_MACERATION_MADNESS,
  JINOTEGA_COMMUNITY_COFFEE,
  THIS_ISNT_SUMATRA,
] as const satisfies ProductWithVariants<Product>[];
