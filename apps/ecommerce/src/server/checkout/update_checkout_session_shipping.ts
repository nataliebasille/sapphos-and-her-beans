"use server";

import "server-only";
import { initActionFactory } from "@action-rpc";
import * as Sentry from "@sentry/nextjs";
import { shippo } from "@shippo";
import type { StripeEmbeddedCheckoutShippingDetailsChangeEvent } from "@stripe/stripe-js";
import type {
  AddressCreateRequest,
  ParcelCreateFromTemplateRequest,
  ParcelCreateRequest,
} from "shippo";
import { isProduct } from "~/app/_stores/products";
import { type Stripe, stripe } from "~/server/+utils/stripe";
import {
  getProducts,
  type LegacyProduct,
  type Product,
} from "~/server/products/get_products";

const addressFrom = {
  name: "Sappho and her beans",
  email: "samantha.basille@gmail.com",
  phone: "(419) 673-5073",
  country: "US",
  state: "OH",
  city: "Cleveland",
  street1: "2808 Church Ave",
  zip: "44113",
} satisfies AddressCreateRequest;

const MIN_SINGLE_SERVE_FOR_INDIVIDUAL_PACKAGE = 20;
const SINGLE_SERVE_WEIGHT_GRAMS = 14;
const MAX_PACKAGE_WEIGHT_GRAMS = 1700;

export const updateCheckoutSessionShipping = initActionFactory().action(
  async (input: StripeEmbeddedCheckoutShippingDetailsChangeEvent) => {
    const { checkoutSessionId, shippingDetails } = input;
    const lineItems = await stripe.checkout.sessions
      .listLineItems(checkoutSessionId)
      .autoPagingToArray({ limit: 10 });

    const addressTo: AddressCreateRequest = {
      country: "US",
      name: input.shippingDetails.name ?? undefined,
      state: input.shippingDetails.address.state ?? undefined,
      city: input.shippingDetails.address.city ?? undefined,
      street1: input.shippingDetails.address.line1 ?? undefined,
      zip: input.shippingDetails.address.postal_code ?? undefined,
    };

    const products = (await getProducts()).reduce((acc, product) => {
      acc.set(product.id, product);
      return acc;
    }, new Map<string, Product | LegacyProduct>());

    const [singleServeLineItems, nonSingleServeLineItems] = lineItems.reduce(
      (acc, item) => {
        const product = products.get(item.price!.product as string);

        if (product && isProduct(product) && product.size === "singleserve") {
          acc[0].push(item);
        } else {
          const size = getSizeInGrams(product);

          if (size) {
            acc[1][size]?.push(item);
          }
        }
        return acc;
      },
      [
        [],
        {
          "250": [],
          "100": [],
        },
      ] as [Stripe.LineItem[], Record<"250" | "100", Stripe.LineItem[]>],
    );

    const numberOf250g = nonSingleServeLineItems["250"].reduce(
      (acc, item) => acc + (item?.quantity ?? 0),
      0,
    );
    const numberOf100g = nonSingleServeLineItems["100"].reduce(
      (acc, item) => acc + (item?.quantity ?? 0),
      0,
    );
    const numberOfNonSingleServeItems = numberOf250g + numberOf100g;
    const numberOfSingleServeItems = singleServeLineItems.reduce(
      (acc, item) => acc + (item?.quantity ?? 0),
      0,
    );

    const singleServePackaging =
      // If there are enough single serve items to ship them individually,
      // or if there are no non-single-serve items at all, ship single-serve items individually
      (
        singleServeLineItems.length >=
          MIN_SINGLE_SERVE_FOR_INDIVIDUAL_PACKAGE ||
        numberOfNonSingleServeItems === 0
      ) ?
        [
          {
            massUnit: "g",
            weight: `${singleServeLineItems.length * SINGLE_SERVE_WEIGHT_GRAMS}`,
            template: "USPS_SmallFlatRateEnvelope",
          } satisfies ParcelCreateFromTemplateRequest,
        ]
      : [];

    const numberOf250gPerPackage = Math.floor(MAX_PACKAGE_WEIGHT_GRAMS / 250);

    const packages: ParcelCreateRequest[] = [];

    if (numberOfNonSingleServeItems > 0) {
      let current250gCount = numberOf250g;
      let current100gCount = numberOf100g;

      while (current250gCount > 0 || current100gCount > 0) {
        const numberOf250gForThisPackage = Math.min(
          current250gCount,
          numberOf250gPerPackage,
        );

        const numberOf100gForThisPackage = Math.min(
          current100gCount,
          Math.floor(
            (MAX_PACKAGE_WEIGHT_GRAMS - numberOf250gForThisPackage * 250) / 100,
          ),
        );

        current250gCount -= numberOf250gForThisPackage;
        current100gCount -= numberOf100gForThisPackage;

        packages.push({
          length: "10",
          width: "6",
          height: "6",
          distanceUnit: "in",
          weight: `${numberOf250gForThisPackage * 250 + numberOf100gForThisPackage * 100}`,
          massUnit: "g",
        });
      }
    }

    const shippingOptions = await shippo.shipments.create({
      addressFrom,
      addressTo,
      parcels: [...singleServePackaging, ...packages],
    });

    const uspsShippingRate =
      shippingOptions.rates.find(
        (x) =>
          x.provider === "USPS" && x.servicelevel.token === "usps_priority",
      ) ??
      shippingOptions.rates.find((x) => x.attributes.includes("BESTVALUE")) ??
      shippingOptions.rates[0];

    if (!uspsShippingRate) {
      Sentry.captureException(
        new Error(
          `Unable to find shipping rate for ${JSON.stringify(addressTo)}`,
        ),
      );

      return {
        type: "reject" as const,
        errorMessage: "Unable to find shipping rate for this address",
      };
    }

    await stripe.checkout.sessions.update(checkoutSessionId, {
      collected_information: {
        // Stripe's typings seem to be wrong between the types for the
        // shipping_details and collected_information properties
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
        shipping_details: shippingDetails as any,
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: Math.floor(parseFloat(uspsShippingRate.amount) * 100),
              currency: uspsShippingRate?.currency,
            },
            display_name: uspsShippingRate.servicelevel.name ?? "Shipping",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 3,
              },
            },
            metadata: {
              shippo_shipping_rate_id: uspsShippingRate.objectId,
            },
          },
        },
      ],
    });

    return { type: "accept" } as const;
  },
);

function getSizeInGrams(product: Product | LegacyProduct | undefined) {
  if (!product || !isProduct(product)) {
    return undefined;
  }

  if (product.size === "singleserve") {
    return undefined;
  } else if (product.size.endsWith("g")) {
    return `${parseInt(product.size.slice(0, -1), 10) === 100 ? 100 : 250}` as const; // get the numeric part
  } else {
    return "250" as const;
  }
}
