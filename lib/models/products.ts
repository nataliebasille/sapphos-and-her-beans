export type Product = {
  type: "coffee";
  id: string;
  name: string;
  price: number;
  size: "singleserve" | (string & {});
  image?: never;
  tastingNotes?: string;
  processing?: string;
  country?: string;
  region?: string;
  lot?: string;
  story?: string;
  featured?: boolean;
  callout?: string;
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

export const MEXICO_250g = {
  type: "coffee",
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
} as const satisfies Product;

export const MEXICO_100g = {
  ...MEXICO_250g,
  id: "1001",
  size: "100g",
  price: 12,
  name: "Mexico - Red de Totutla - 100g",
} as const satisfies Product;

export const MEXICO_SINGLESERVE = {
  ...MEXICO_250g,
  id: "1002",
  size: "singleserve",
  price: 3.5,
  featured: false,
  name: "Mexico - Red de Totutla - Single Serve",
} as const satisfies Product;

export const COFERMENTED_WINE_YEAST_LYCHEE_250g = {
  type: "coffee",
  id: "2000",
  name: "Colombia - Co-fermented with Wine Yeast / Lychee - 250g",
  price: 35,
  country: "Colombia",
  color: "purple",
  farm: "Jairo Arcila",
  tastingNotes: "Sweet lychee, tropical fruits, brown sugar, lime",
  processing: "Washed",
  lot: "9",
  region: "Quindio",
  varietals: "CASTILLO",
  size: "250g",
  traceable: "Jairo Arcila",
  altitude: "1450-1500 meters",
  fermentation: { type: "cofermentation", ingredient: "Wine Yeast / Lychee" },
  isDecaf: false,
  featured: false,
} as const satisfies Product;

export const COFERMENTED_WINE_YEAST_LYCHEE_100g = {
  ...COFERMENTED_WINE_YEAST_LYCHEE_250g,
  id: "2001",
  size: "100g",
  price: 15,
  featured: false,
  name: "Colombia - Co-fermented with Wine Yeast / Lychee - 100g",
} as const satisfies Product;

export const ETHIOPIA_YIRGACHEFF_BANKO_GOTITI_250g = {
  type: "coffee",
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

  isDecaf: false,
  featured: false,
} as const satisfies Product;

export const ETHIOPIA_YIRGACHEFF_BANKO_GOTITI_100g = {
  ...ETHIOPIA_YIRGACHEFF_BANKO_GOTITI_250g,
  id: "3001",
  size: "100g",
  price: 12,
  featured: false,
  name: "Ethiopia Yirgacheffe - Banko Gotti Gr 1 - 100g",
} as const satisfies Product;

export const KENYA_NYERI_NYERI_GICHICHI_AA_250g = {
  type: "coffee",
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
  isDecaf: false,
} as const satisfies Product;

export const KENYA_NYERI_NYERI_GICHICHI_AA_100g = {
  ...KENYA_NYERI_NYERI_GICHICHI_AA_250g,
  id: "4001",
  size: "100g",
  price: 12,
  featured: false,
  name: "Kenya - Nyeri Gichichi AA - 100g",
} as const satisfies Product;

export const ETHIOPIA_GUJI_TUKU_250g = {
  type: "coffee",
  id: "5000",
  name: "Ethiopia - Guji Tuku - 250g",
  price: 30,
  country: "Ethiopia",
  color: "rose",
  farm: "Guji Tuku",
  tastingNotes:
    "blueberry, pomegranate molasses, honeydew melon, and coriander",
  processing: "Natural",
  lot: "100",
  region: "	Gerba Dogo, Bule Hora, Guji Zone",
  varietals: "Heirloom Cultivars",
  size: "250g",
  traceable: "Tuku - Vertically integrated mill",
  altitude: "2125 meters",
  isDecaf: false,
  score: 93.2,
} as const satisfies Product;

export const ETHIOPIA_GUJI_TUKU_100g = {
  ...ETHIOPIA_GUJI_TUKU_250g,
  id: "5001",
  size: "100g",
  price: 14,
  name: "Ethiopia - Guji Tuku - 100g",
} as const satisfies Product;

export const YELLOW_BOURBON_CONCOCTION_250g = {
  type: "coffee",
  id: "6000",
  name: "Nicaragua - Yellow Bourbon Concoction - 250g",
  price: 32,
  score: 90,
  country: "Nicaragua",
  color: "yellow",
  farm: "Finca Idealista",
  lot: "253.5 lbs",
  tastingNotes: "Rose, papaya, white currant",
  processing: "Honey, natural & carbonic maceration natural",
  region: "Matagalpa, Nicaragua",
  varietals: "100% Yellow Bourbon",
  size: "250g",
  traceable: "Benjamin Weiner",
  altitude: "1200 meters",
  isDecaf: false,
  featured: false,
} as const satisfies Product;

export const YELLOW_BOURBON_CONCOCTION_100g = {
  ...YELLOW_BOURBON_CONCOCTION_250g,
  id: "6001",
  size: "100g",
  price: 14,
  featured: false,
  name: "Nicaragua - Yellow Bourbon Concoction - 100g",
} as const satisfies Product;

export const YELLOW_PACAMARA_WASHED_250g = {
  type: "coffee",
  id: "7000",
  name: "Nicaragua - Yellow Pacamara Washed - 250g",
  price: 32,
  score: 89,
  country: "Nicaragua",
  color: "sky",
  farm: "Finca Idealista",
  tastingNotes: "White lifesaver, apple, white sugar",
  processing: "Washed",
  region: "Matagalpa, Nicaragua",
  lot: "202.84 lbs",
  varietals: "Yellow Pacamara",
  size: "250g",
  traceable: "Benjamin Weiner",
  altitude: "1200 meters",
  isDecaf: false,
  featured: false,
  fermentation: "30.84 hours",
} as const satisfies Product;

export const YELLOW_PACAMARA_WASHED_100g = {
  ...YELLOW_PACAMARA_WASHED_250g,
  id: "7001",
  size: "100g",
  price: 14,
  featured: false,
  name: "Nicaragua - Yellow Pacamara Washed - 100g",
} as const satisfies Product;

export const MARACATURRA_MACERATION_GRENADINE_100g = {
  type: "coffee",
  id: "8000",
  name: 'Nicaragua - Maracaturra Maceration "Grenadine" - 100g',
  price: 18,
  score: 94,
  country: "Nicaragua",
  color: "slate",
  farm: "GMCG Member Farmers",
  tastingNotes: "Blackberry preserves, concord grape, rose",
  processing: "Carbonic Maceration Natural",
  region: "Jinotega, Nicaragua",
  lot: "152 lbs",
  varietals: "Maracaturra",
  size: "100g",
  traceable: "Maritza & Francisco",
  altitude: "1350 meters",
  fermentation: { type: "anaerobic", duration: "181 hours" },
  isDecaf: false,
  featured: false,
} as const satisfies Product;

export const MARACATURRA_MACERATION_GRENADINE_250g = {
  ...MARACATURRA_MACERATION_GRENADINE_100g,
  id: "8001",
  size: "250g",
  price: 40,
  name: 'Nicaragua - Maracaturra Maceration "Grenadine" - 250g',
} as const satisfies Product;

export const CASTILLO_WASHED_WINE_YEAST_BLACKBERRY_100g = {
  type: "coffee",
  id: "9000",
  name: "Colombia - Castillo Washed Co-fermented with Wine Yeast + Blackberry - 100g",
  price: 15,
  country: "Colombia",
  color: "violet",
  farm: "Jairo Arcila",
  tastingNotes: "Ripe blackberry, dark chocolate, tangerine, caramel",
  processing: "Washed",
  region: "Armenia, Quindio",
  lot: "< 40 52kg bags",
  varietals: "CASTILLO",
  size: "100g",
  traceable: "Jairo Arcila",
  altitude: "1450-1500 meters",
  fermentation: {
    type: "cofermentation",
    ingredient: "Wine Yeast + Blackberry",
  },
  isDecaf: false,
  featured: false,
} as const satisfies Product;

export const CASTILLO_WASHED_WINE_YEAST_BLACKBERRY_250g = {
  ...CASTILLO_WASHED_WINE_YEAST_BLACKBERRY_100g,
  id: "9001",
  size: "250g",
  price: 35,
  name: "Colombia - Castillo Washed Co-fermented with Wine Yeast + Blackberry - 250g",
} as const satisfies Product;

export const PUMPKIN_SPICE_MACERATION_MADNESS_250g = {
  type: "coffee",
  id: "10000",
  name: "Nicaragua - Pumpkin Spice Maceration Madness - 250g",
  price: 32,
  country: "Nicaragua",
  color: "pumpkin",
  farm: "Finca Idealista",
  tastingNotes: "Pumpkin pie, brown sugar, cinnamon, nutmeg",
  processing: "Carbonic maceration double fermentation with pumpkin spice",
  region: "Matagalpa, Nicaragua",
  lot: "NANO",
  varietals: "Pacamara",
  size: "250g",
  traceable: "Benjamin Weiner",
  altitude: "1200 meters",
  fermentation: { type: "cofermentation", ingredient: "Pumpkin Spice" },
  isDecaf: false,
  featured: false,
} as const satisfies Product;

export const PUMPKIN_SPICE_MACERATION_MADNESS_100g = {
  ...PUMPKIN_SPICE_MACERATION_MADNESS_250g,
  id: "10001",
  size: "100g",
  price: 14,
  name: "Nicaragua - Pumpkin Spice Maceration Madness - 100g",
} as const satisfies Product;

export const JINOTEGA_COMMUNITY_COFFEE_250g = {
  type: "coffee",
  id: "11000",
  name: "Nicaragua - Jinotega Community Coffee - 250g",
  price: 24,
  country: "Nicaragua",
  color: "sky",
  farm: "Jinotega Community Members",
  tastingNotes: "Cherry, apple, cranberry",
  processing: "Washed",
  lot: "Community",
  region: "Jinotega, Nicaragua",
  varietals: "Red & Yellow Caturra, Red & Yellow Catuai, Bourbon, Pache",
  size: "250g",
  traceable: "GMCG Member Farmers",
  altitude: "1300 to 1600 meters",
  fermentation: "18.25 hours",
  story:
    "This popular coffee is a great value option without sacrificing quality!",
  isDecaf: false,
  featured: false,
} as const satisfies Product;

export const JINOTEGA_COMMUNITY_COFFEE_100g = {
  ...JINOTEGA_COMMUNITY_COFFEE_250g,
  id: "11001",
  size: "100g",
  price: 12,
  name: "Nicaragua - Jinotega Community Coffee - 100g",
} as const satisfies Product;

export const THIS_ISNT_SUMATRA_250g = {
  type: "coffee",
  id: "12000",
  name: "Nicaragua - This Isn't Sumatra - 250g",
  price: 24,
  country: "Nicaragua",
  color: "navy",
  farm: "GMGG Farmers",
  tastingNotes: "Pecan, apple sauce, Brazil nut",
  processing: "Washed",
  lot: "Community",
  region: "Jinotega & Matagalpa, Nicaragua",
  varietals:
    "Catuai, Caturra, Caturra Estrella, Pache Colis, Catimor, Parainema, Siquia",
  size: "250g",
  traceable: "GMCG Member Farmers",
  altitude: "1200 to 1400 meters",
  callout: "This isn't sumatra?",
  story:
    "What??? This isn't Sumatra? But it tastes just like it (just cleaner)! By cupping every day lot of picking, we're able to find lots with the taste profile of a clean Sumatra. This is a community lot from a handful of Gold Mountain farmers. We did a bunch of experimenting and even tried wet hulling (as is done in Sumatra). In the end, we found ours tastes cleanest by doing regular dry hulling rather than wet hulling--then we search through 3,000+ coffees for this cup profile. This is a really awesome and more dependable alternative if you're looking for a Sumatra taste profile.",
  isDecaf: false,
  featured: false,
} as const satisfies Product;

export const THIS_ISNT_SUMATRA_100g = {
  ...THIS_ISNT_SUMATRA_250g,
  id: "12001",
  size: "100g",
  price: 12,
  name: "Nicaragua - This Isn't Sumatra - 100g",
} as const satisfies Product;

export const PRODUCTS = [
  // MEXICO_250g,
  MEXICO_100g,
  MEXICO_SINGLESERVE,
  //COFERMENTED_WINE_YEAST_LYCHEE_250g,
  //COFERMENTED_WINE_YEAST_LYCHEE_100g,
  // ETHIOPIA_YIRGACHEFF_BANKO_GOTITI_250g,
  // ETHIOPIA_YIRGACHEFF_BANKO_GOTITI_100g,
  // KENYA_NYERI_NYERI_GICHICHI_AA_250g,
  // KENYA_NYERI_NYERI_GICHICHI_AA_100g,
  CASTILLO_WASHED_WINE_YEAST_BLACKBERRY_250g,
  CASTILLO_WASHED_WINE_YEAST_BLACKBERRY_100g,
  // ETHIOPIA_GUJI_TUKU_250g,
  // ETHIOPIA_GUJI_TUKU_100g,
  YELLOW_BOURBON_CONCOCTION_250g,
  YELLOW_BOURBON_CONCOCTION_100g,
  // YELLOW_PACAMARA_WASHED_250g,
  // YELLOW_PACAMARA_WASHED_100g,
  MARACATURRA_MACERATION_GRENADINE_100g,
  MARACATURRA_MACERATION_GRENADINE_250g,
  PUMPKIN_SPICE_MACERATION_MADNESS_250g,
  PUMPKIN_SPICE_MACERATION_MADNESS_100g,
  JINOTEGA_COMMUNITY_COFFEE_250g,
  JINOTEGA_COMMUNITY_COFFEE_100g,
  THIS_ISNT_SUMATRA_250g,
  THIS_ISNT_SUMATRA_100g,
  CASTILLO_WASHED_WINE_YEAST_BLACKBERRY_100g,
  CASTILLO_WASHED_WINE_YEAST_BLACKBERRY_250g,
] as const satisfies Product[];
