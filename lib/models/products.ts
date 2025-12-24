export type Product = {
  type: "coffee";
  id: string;
  name: string;
  price: number;
  // eslint-disable-next-line @typescript-eslint/ban-types
  size: "singleserve" | (string & {});
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
  fermentation?:
    | { type: "cofermentation"; ingredient: string }
    | { type: "anaerobic"; duration?: string }
    | `${number} hours`;
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
  price: 28,
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
  price: 28,
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
  price: 12,
  featured: false,
  name: "Nicaragua - Yellow Bourbon Concoction - 100g",
} as const satisfies Product;

export const YELLOW_PACAMARA_WASHED_250g = {
  type: "coffee",
  id: "7000",
  name: "Nicaragua - Yellow Pacamara Washed - 250g",
  price: 28,
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

export const PRODUCTS = [
  MEXICO_250g,
  MEXICO_100g,
  MEXICO_SINGLESERVE,
  //COFERMENTED_WINE_YEAST_LYCHEE_250g,
  COFERMENTED_WINE_YEAST_LYCHEE_100g,
  // ETHIOPIA_YIRGACHEFF_BANKO_GOTITI_250g,
  // ETHIOPIA_YIRGACHEFF_BANKO_GOTITI_100g,
  // KENYA_NYERI_NYERI_GICHICHI_AA_250g,
  // KENYA_NYERI_NYERI_GICHICHI_AA_100g,
  ETHIOPIA_GUJI_TUKU_250g,
  ETHIOPIA_GUJI_TUKU_100g,
  YELLOW_BOURBON_CONCOCTION_250g,
  YELLOW_BOURBON_CONCOCTION_100g,
  YELLOW_PACAMARA_WASHED_250g,
  YELLOW_PACAMARA_WASHED_100g,
  MARACATURRA_MACERATION_GRENADINE_100g,
] as const satisfies Product[];
