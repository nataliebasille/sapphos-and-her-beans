"use server";

import "server-only";
import { initActionFactory } from "@action-rpc";
import { stripe, type Stripe } from "~/server/+utils/stripe";
import { shippo } from "@shippo";
import { type StripeEmbeddedCheckoutShippingDetailsChangeEvent } from "@stripe/stripe-js";
import { type ParcelCreateRequest, type AddressCreateRequest } from "shippo";
import { getProducts, type Product } from "~/server/products/get_products";
import * as Sentry from "@sentry/nextjs";

const addressFrom = {
  name: "Sappho and her beans",
  email: "samantha.basille@gmail.com",
  phone: "(419) 673-5073",
  country: "US",
  state: "OH",
  city: "Akron",
  street1: "21 Furnace St",
  zip: "44308",
} satisfies AddressCreateRequest;

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

    const packages = lineItems.reduce((resultArray, item, index) => {
      const chunkIndex = Math.floor(
        index / 5 /*5 is the number of items per package*/,
      );

      if (!resultArray[chunkIndex]) {
        resultArray[chunkIndex] = []; // start a new chunk
      }

      resultArray[chunkIndex].push(item);

      return resultArray;
    }, [] as Stripe.LineItem[][]);

    const products = (await getProducts()).reduce((acc, product) => {
      acc.set(product.id, product);
      return acc;
    }, new Map<string, Product>());

    const shippingOptions = await shippo.shipments.create({
      addressFrom,
      addressTo,
      parcels: packages.map(
        (items) =>
          ({
            length: "10",
            width: "6",
            height: "6",
            distanceUnit: "in",
            weight:
              items.reduce((acc, item) => {
                const product = products.get(item.price!.product as string);

                return acc + parseInt(product?.sizeOunces ?? "0", 10);
              }, 0) + "",
            massUnit: "oz",
          }) satisfies ParcelCreateRequest,
      ),
    });

    const uspsShippingRate = shippingOptions.rates.find(
      (x) => x.provider === "USPS" && x.servicelevel.token === "usps_priority",
    );

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
