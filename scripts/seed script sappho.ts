import dotenv from "dotenv";
import { Stripe } from "stripe";
import { products } from "../lib/models";

dotenv.config({ path: ".env" });

async function listAllActiveProducts(
  stripe: Stripe,
): Promise<Stripe.Product[]> {
  const all: Stripe.Product[] = [];
  let startingAfter: string | undefined;
  for (;;) {
    const page = await stripe.products.list({
      active: true,
      limit: 100,
      expand: ["data.default_price"],
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    });
    all.push(...page.data);
    if (!page.has_more) break;
    startingAfter = page.data[page.data.length - 1]!.id;
  }
  return all;
}

async function main() {
  const stripe = new Stripe(process.env.STRIPE_KEY!);

  const existingProducts = await listAllActiveProducts(stripe);

  console.log(`existingProducts: ${existingProducts.length} active`);

  const existingStripeNamesToIdsMap = existingProducts.reduce(
    (acc, product) => {
      acc[product.name] = product.id;
      return acc;
    },
    {} as Record<string, string>,
  );
  const activeVariants = products.PRODUCTS.flatMap((coffee) =>
    products
      .resolveVariants(coffee)
      .map((product) => ({ coffeeId: coffee.id, product })),
  ).filter(({ product }) => product.active);

  const sizeLabel = (size: products.Product["size"]) =>
    size === "singleserve" ? "Single Serve" : size;

  const stripeName = (product: products.Product) =>
    product.deprecated_stripe_name ??
    [product.country, product.name, sizeLabel(product.size)]
      .filter(Boolean)
      .join(" - ");

  const activeProductsNamesSet = new Set(
    activeVariants.map(({ product }) => stripeName(product)),
  );

  for (const { coffeeId, product } of [...activeVariants].reverse()) {
    const name = stripeName(product);
    const id = existingStripeNamesToIdsMap[name];
    const stripePrice = product.price * 100;
    const body = {
      name,
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
        product_id: coffeeId,
        product_name: product.name,
        country: product.country ?? "",
        ...(product.region && { region: product.region }),
        lot: product.lot ?? "",
        processing: product.processing ?? "",
        decaf: `${product.isDecaf ?? false}`,
        tasting_notes: product.tastingNotes ?? "",
        ...("featured" in product && product.featured ?
          { featured: `${product.featured}` }
        : {}),
        ...(product.type === "coffee" ?
          {
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

    const response = await (id ?
      stripe.products.update(id, body)
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
        },
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
