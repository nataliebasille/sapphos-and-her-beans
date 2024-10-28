"use server";

import { initActionFactory } from "@action-rpc";
import { stripe } from "@stripe-client";
import { StripeEmbeddedCheckoutShippingDetailsChangeEvent } from "@stripe/stripe-js";

export const updateCheckoutSessionShipping = initActionFactory().action(
  async (input: StripeEmbeddedCheckoutShippingDetailsChangeEvent) => {
    const { checkoutSessionId, shippingDetails } = input;

    await stripe.checkout.sessions.update(checkoutSessionId, {
      collected_information: {
        shipping_details: shippingDetails as any,
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 1500,
              currency: "usd",
            },
            display_name: "Next day air",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 1,
              },
            },
          },
        },
      ],
    });

    return { type: "accept" } as const;
  },
);
