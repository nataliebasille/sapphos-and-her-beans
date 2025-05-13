import { Stripe } from "stripe";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

type Product = {
  id: number;
  name: string;
  price: number;
  size: number;
  decaf?: true;
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

const PRODUCTS = [
  {
    id: 7,
    name: "Totutla Community",
    price: 24,
    size: 10,
    tastingNotes: "almond, chocolate covered cherry, chardonnay, raisin, lemon",
    processing: "Washed",
    country: "Mexico",
    region: "Totutla, Puebla",
    lot: "Totutla Community Washed",
    image:
      "https://utfs.io/a/ns7k7p5vvb/4rrGfGgcbsJmZPWe0EftobfiQs8TNFHMUpy0q539rwlgcXW4",
    story: `Alfredo Vega Romero, age 34 (2024) has grown coffee his entire life. But he only recently took an interest in the
possibilities of specialty coffee when he took an interest in fermentation. This led Alfredo to begin experimenting,
roasting, and cupping his coffee – with his family and neighbors. This coffee klatch grew over time to more motivated
farmers from the area. In 2024 they joined the GCP program en masse, bringing their coffee to export for the first time.
Their next move is to form into a cooperative, to be called ‘Cozoltepetl’ (Nahuatl for Crevices Mountain) in honor of a
secret shrine to home of the rain god in the Nahua tradition.`,
    featured: true,
  },
  {
    id: 4,
    name: "Ethiopian Nguisse Nare",
    price: 26,
    size: 12,
    tastingNotes: "Lavendar, plum, peach, rose water",
    processing: "Natural",
    country: "Ethiopia",
    region: "Sidama Bensa Bombe",
    lot: "Nguisse Nare, Bombe, Natural, Grade 1",
    image:
      "https://utfs.io/a/ns7k7p5vvb/4rrGfGgcbsJmKP3m3b5emFDR76qGtiaw89OurNXQlhInVvHA",
    story: `Sitting atop a ridge at 2300 MASL in Bombe, Nguisse Nare's 10 hectare farm “Setame” is planted with variety 74158
intercropped with taro and sweet potato. With his two other farms—one in Kokose, one in Tiburo—he produces natural and
anaerobic coffees using his own cherry as well as cherry collected from around 60 of his neighbors. When we visited in
December, we spoke with Thomas Tosha, the farm manager at Setame, as well
as Demisse Turuma, the Industry Manager (the term of choice for the resident postharvest processing expert) while
touring Nguisse's drying station and farm. Over a
traditional meal of enset, we learned that Nguisse bought the farm four years ago, with a strict focus on quality. He floats
his cherry before drying them slowly on raised beds over 20 days.`,
    featured: true,
  },

  {
    id: 5,
    name: "Ethiopian Duromina Cooperative",
    decaf: true,
    price: 23,
    size: 12,
    tastingNotes: "chocolate babka aroma, mint, caramel, cherries",
    processing: "Washed",
    country: "Ethiopia",
    region: "Limu, Agaro",
    lot: "Duromina Cooperative Decaf",
    image:
      "https://utfs.io/a/ns7k7p5vvb/4rrGfGgcbsJm4CktK0gcbsJmSXVFtRMuW6ODhg4Exfqr71n8",
    story: `Established in 2010, 'Duromina' means 'become wealthy', and this is a smallholder cooperative who knows how to share
the wealth. First focusing on quality improvements, which earned them a name, then on an organic certification for
additional premiums, the cooperative is now focusing on community by building schools, roads, connections for
electricity and safe drinking water.
In 2009 Technoserve began working in Ethiopia, on a two-fold mission to (1) improve the value (quality) of coffees
produced and (2) to make sure the farmers of that coffee were receiving a higher percentage of the value they were
creating. Since 2009, 60+ washing stations have been created, alongside the ongoing field-work and support of
Technoserve's Jimma staff. The approach has been successful by all accounts. Farmers own their own equipment
(financed and paid down over time), they negotiate their selling prices, and pay a small commission for processing and
export (5% commission + costs). With the quality support and feedback from the Technoserve cuppers in Jimma, they
grow better coffee and keep more of the value of that coffee.
This was the work that attracted us to Western Ethiopia and that introduced us to Moata (then a Field Trainer and QC
manager for TNS). We still believe it was some of the most effective coffee work we've seen. In 2015 the funding for this
work ended and the project came to a conclusion. While many of the washing stations that were created had attracted
private specialty buyers - the coops were being mismanaged by the Oromia Union, who was only begrudgingly following
through on the original agreement it struck with these new businesses. The result was that there was great coffee coming
from these coops (Biftu, Duromina, Yukro, Nano Challa) but they were very hard for buyers to get (Ormoia Union was not
responsive), often delayed in milling and shipping, and the coops themselves were not at the table to negotiate their own
deals. The following year, they left Oromia Union, and founded the Kata Maduga Union, which was anchored by these very
successful coops.
Certainly, this was a delicate time and a real test. These farmers were at the top of their game from a processing point of
view, but running an exporter is a different ball game altogether. Furthermore, if this new Union failed, the 90 million dollar
grant and almost a decade worth of work, might be materially harmed, then disappear. It didn't fail. It's grown over the
years, it published its second payments, it has heavily reinvested in the communities that it represents and is managed by
farmers and coop leaders from the area who serve with integrity.
Kata Maduga and the coops it represents are a textbook illustration of smallholder success in specialty. Every year we
wish we could find more customers for these delicate, sweet cups - knowing the rich legacy and courageous past of these
producers who took their futures into their own hands.`,
  },

  {
    id: 6,
    name: "Brazil Marcelo Assis",
    price: 22,
    size: 10,
    tastingNotes: "Grapefruit, lemon liquor, cherry, chocolate",
    processing: "Natural",
    country: "Brazil",
    region: "Cerrado Mineiro, Campos Altos",
    lot: "Marcelo Assis, Fazenda Bioma Red Catuai Natural PB Lot 58",
    image:
      "https://utfs.io/a/ns7k7p5vvb/4rrGfGgcbsJmMt3lqew0WcO1YtquLMAkCBDXKiaU6PzJRp4x",
    story: `Bioma Café's is a partnership between Marcelo Nogueira Assis and Flavio Marcio Silva dating back to 2001. Flavio came
from managing the family businesses, and Marcelo was a recent graduate in the technical school of agriculture. By 2010
the two were ready to found their first coffee farm - dedicated 100% to specialty production - in Campos Altos region,
Minas Gerais. The time between was spent evaluating each piece of land that they would later buy - a scientific search
for the perfect terroir. A 1200m high plateau in Cerrado Mineiro was eventually selected, 229 hectares divided into six
zones. Olhos D'agua is the central plot, where the processing happens. For 2023, Bioma Cafe experimented with pyramid
drying on their patios in small lots, making use of wild yeasts from Selvatech.`,
    featured: true,
  },
] satisfies Product[];

async function main() {
  const stripe = new Stripe(process.env.STRIPE_KEY!);

  const existingProducts = await stripe.products.list({
    active: true,
    expand: ["data.default_price"],
  });

  console.log("existingProducts", JSON.stringify(existingProducts, null, 2));

  const existingStripeNamesToIdsMap = existingProducts.data.reduce(
    (acc, product) => {
      acc[product.name] = product.id;
      return acc;
    },
    {} as Record<string, string>
  );
  const activeProductsNamesSet = new Set(PRODUCTS.map((p) => p.name));

  for (const product of PRODUCTS) {
    const id = existingStripeNamesToIdsMap[product.name];
    const stripePrice = product.price * 100;
    const body = {
      name: product.name,
      description: `${product.size}oz - ${product.tastingNotes}`,
      images: [product.image],
      shippable: true,
      expand: ["default_price"],
      ...(!id && {
        default_price_data: {
          currency: "USD",
          unit_amount: stripePrice,
        },
      }),
      metadata: {
        product_type: "coffee",
        country: product.country,
        size_ounces: product.size + "",
        ...(product.region && { region: product.region }),
        lot: product.lot,
        processing: product.processing,
        decaf: `${product.decaf ?? false}`,
        tasting_notes: product.tastingNotes,
        ...(product.featured && { featured: `${product.featured}` }),
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
        currency: "USD",
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

    console.log("response", JSON.stringify(response, null, 2));
  }

  const inactiveProductStripeIds = Object.entries(existingStripeNamesToIdsMap)
    .filter(([name]) => !activeProductsNamesSet.has(name))
    .map(([_, id]) => id);

  for (const productId of inactiveProductStripeIds) {
    await stripe.products.update(productId, { active: false });
  }
}

main();
