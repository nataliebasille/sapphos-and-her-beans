import dotenv from 'dotenv';
import { Stripe } from 'stripe';

dotenv.config({ path: '.env' });

type LegacyProduct = {
  type: 'legacy';
  id: number;
  name: string;
  price: number;
  size: number;
  isDecaf?: true;
  tastingNotes: string;
  country: string;
  region?: string;
  lot: string;
  processing: string;
  story: string;
  image: string;
  featured?: boolean;
  limitedAvailability?: true;
};

export type Product = {
  type: 'coffee';
  id: string;
  name: string;
  price: number;
  // eslint-disable-next-line @typescript-eslint/ban-types
  size: 'singleserve' | (string & {});
  image?: never;
  tastingNotes?: string;
  processing?: string;
  country?: string;
  region?: string;
  lot?: string;
  story?: string;
  featured?: boolean;
  color:
    | 'cyan'
    | 'sky'
    | 'yellow'
    | 'rose'
    | 'slate'
    | 'purple'
    | 'amber'
    | 'emerald';
  isDecaf: boolean;
  farm: string;
  traceable: string;
  altitude?: string;
  varietals?: string;
  fermentation?: string;
  score?: number;
};

const MEXICO = {
  type: 'coffee',
  id: '1000',
  name: 'Mexico - Red de Totutla - 250g',
  price: 24,
  size: '250g',
  tastingNotes:
    'Almond, chocolate covered white cherry, chardonnay, raisin, lemon',
  processing: 'Washed',
  country: 'Mexico',
  region: 'Totutla, Puebla',
  lot: 'Totutla Community',
  isDecaf: false,
  color: 'cyan',
  farm: 'Red de Totutla',
  traceable: '11 families',
  altitude: '1200 - 1450',
  varietals: 'Typica, Bourbon, Caturra',
} satisfies Product;

const COFERMENTED_WINE_YEAST_LYNCHEE = {
  type: 'coffee',
  id: '2000',
  name: 'Colombia - Co-fermented with Wine Yeast / Lychee - 250g',
  price: 35,
  country: 'Colombia',
  color: 'purple',
  farm: 'Jairo Arcila',
  tastingNotes: 'Sweet lynchee, tropical fruits, brown sugar, lime',
  processing: 'Washed',
  lot: 'Santa Monica',
  region: 'Quindio',
  varietals: 'CASTILLO',
  size: '250g',
  traceable: 'Jairo Arcila',
  altitude: '1450-1500 meters',
  fermentation: 'Wine Yeast / Lychee',
  isDecaf: false,
  featured: true,
} satisfies Product;

const ETHIOPIA_YIRGACHEFF_BANKO_GOTITI = {
  type: 'coffee',
  id: '3000',
  name: 'Ethiopia Yirgacheffe - Banko Gotiti Gr 1 - 250g',
  country: 'Ethiopia Yirgacheffe',
  color: 'emerald',
  farm: 'Banko Gotiti Gr 1',
  tastingNotes: 'Jasmine, Lavender, Fresh rue, Rosemary',
  processing: 'Natural',
  lot: '100',
  region: 'Banko Gotiti, Yirgacheffe',
  varietals: 'Heirloom',
  price: 27,
  size: '250g',
  traceable: '320 farmers',
  altitude: '2059 meters',
  score: 91.5,

  isDecaf: false,
  featured: true,
} satisfies Product;

const KENYA_NYERI_NYERI_GICHICHI_AA = {
  type: 'coffee',
  id: '4000',
  country: 'Kenya',
  name: 'Kenya - Nyeri Gichichi AA - 250g',
  price: 27,
  score: 91,
  color: 'amber',
  farm: 'Gichichi AA',
  lot: '19',
  size: '250g',
  region: 'Gichichi, Nyeri County',
  processing: 'Washed',
  varietals: 'Bourbon',
  traceable: '477 Farms',
  altitude: '1800 meters',
  tastingNotes: 'Sugar cane, Dried ginger, Green tea, Lime zest',
  featured: false,

  isDecaf: false,
} satisfies Product;

const PRODUCTS: Product[] = [
  {
    ...MEXICO,
  },
  {
    ...MEXICO,
    id: '1001',
    size: '100g',
    price: 10,
    name: 'Mexico - Red de Totutla - 100g',
  },
  {
    ...MEXICO,
    id: '1002',
    size: 'singleserve',
    price: 3.5,
    featured: true,
    name: 'Mexico - Red de Totutla - Single Serve',
  },
  {
    ...COFERMENTED_WINE_YEAST_LYNCHEE,
  },
  {
    ...COFERMENTED_WINE_YEAST_LYNCHEE,
    id: '2001',
    size: '100g',
    price: 15,
    featured: false,
    name: 'Colombia - Co-fermented with Wine Yeast / Lychee - 100g',
  },

  {
    ...ETHIOPIA_YIRGACHEFF_BANKO_GOTITI,
  },

  {
    ...ETHIOPIA_YIRGACHEFF_BANKO_GOTITI,
    id: '3001',
    size: '100g',
    price: 12,
    featured: false,
    name: 'Ethiopia Yirgacheffe - Banko Gotti Gr 1 - 100g',
  },

  {
    ...KENYA_NYERI_NYERI_GICHICHI_AA,
  },

  {
    ...KENYA_NYERI_NYERI_GICHICHI_AA,
    id: '4001',
    size: '100g',
    price: 12,
    featured: false,
    name: 'Kenya - Nyeri Gichichi AA - 100g',
  },
] satisfies (Product | LegacyProduct)[];

async function main() {
  const stripe = new Stripe(process.env.STRIPE_KEY!);

  const existingProducts = await stripe.products.list({
    active: true,
    expand: ['data.default_price'],
  });

  console.log('existingProducts', JSON.stringify(existingProducts, null, 2));

  const existingStripeNamesToIdsMap = existingProducts.data.reduce(
    (acc, product) => {
      acc[product.name] = product.id;
      return acc;
    },
    {} as Record<string, string>
  );
  const activeProductsNamesSet = new Set(PRODUCTS.map((p) => p.name));

  for (const product of PRODUCTS.reverse()) {
    const id = existingStripeNamesToIdsMap[product.name];
    const stripePrice = product.price * 100;
    const body = {
      name: product.name,
      description: `${typeof product.size === 'number' ? `${product.size}oz` : product.size} - ${product.tastingNotes}`,
      images: 'image' in product && product.image ? [product.image] : [],
      shippable: true,
      expand: ['default_price'],
      ...(!id && {
        default_price_data: {
          currency: 'USD',
          unit_amount: stripePrice,
        },
      }),
      metadata: {
        product_type: 'coffee',
        country: product.country ?? '',
        ...(typeof product.size === 'number'
          ? { size_ounces: `${product.size}` }
          : {}),
        ...(product.region && { region: product.region }),
        lot: product.lot ?? '',
        processing: product.processing ?? '',
        decaf: `${product.isDecaf ?? false}`,
        tasting_notes: product.tastingNotes ?? '',
        ...(product.featured && { featured: `${product.featured}` }),
        ...(product.type === 'coffee'
          ? {
              size: product.size,
              label_color: product.color,
              region: product.region ?? '',
              farm: product.farm,
              traceable: product.traceable,
              ...(product.altitude && { altitude: product.altitude }),
              ...(product.varietals && { varietals: product.varietals }),
              ...('fermentation' in product &&
                product.fermentation && {
                  fermentation: product.fermentation,
                }),
              ...('score' in product &&
                product.score && { score: product.score }),
            }
          : {}),
      },
    };

    const response = await (id
      ? stripe.products.update(id, body)
      : stripe.products.create(body));

    if (
      (response.default_price as typeof response.default_price & object)
        .unit_amount !== stripePrice
    ) {
      const price = await stripe.prices.create({
        product: response.id,
        unit_amount: stripePrice,
        currency: 'USD',
      });

      await stripe.products.update(response.id, {
        default_price: price.id,
      });

      await stripe.prices.update(
        (response.default_price as typeof response.default_price & object).id,
        {
          active: false,
        }
      );
    }

    console.log('response', JSON.stringify(response, null, 2));
  }

  const inactiveProductStripeIds = Object.entries(existingStripeNamesToIdsMap)
    .filter(([name]) => !activeProductsNamesSet.has(name))
    .map(([_, id]) => id);

  for (const productId of inactiveProductStripeIds) {
    await stripe.products.update(productId, { active: false });
  }
}

main();
