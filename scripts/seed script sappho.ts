import dotenv from "dotenv";
import { Stripe } from "stripe";
import { products } from "../lib/models";

dotenv.config({ path: ".env" });

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
  const activeProductsNamesSet = new Set(products.PRODUCTS.map((p) => p.name));

  for (const product of products.PRODUCTS.reverse()) {
    const id = existingStripeNamesToIdsMap[product.name];
    const stripePrice = product.price * 100;
    const body = {
      name: product.name,
      description: `${product.size} - ${product.tastingNotes}`,
      images: [],
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
        country: product.country ?? "",
        ...(product.region && { region: product.region }),
        lot: product.lot ?? "",
        processing: product.processing ?? "",
        decaf: `${product.isDecaf ?? false}`,
        tasting_notes: product.tastingNotes ?? "",
        ...("featured" in product && product.featured
          ? { featured: `${product.featured}` }
          : {}),
        ...(product.type === "coffee"
          ? {
              size: product.size,
              label_color: product.color,
              region: product.region ?? "",
              farm: product.farm,
              traceable: product.traceable,
              ...(product.altitude && { altitude: product.altitude }),
              ...(product.varietals && { varietals: product.varietals }),
              ...("fermentation" in product &&
                product.fermentation && {
                  fermentation: JSON.stringify(product.fermentation),
                }),
              ...("score" in product &&
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
    .filter(([name]) => !activeProductsNamesSet.has(name as any))
    .map(([_, id]) => id);

  for (const productId of inactiveProductStripeIds) {
    await stripe.products.update(productId, { active: false });
  }
}

main();
