"use server";

import "server-only";
import { initActionFactory } from "@action-rpc";
import { stripe, type Stripe } from "~/server/+utils/stripe";
import { z } from "zod";

const initiateCheckoutSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      quantity: z.number(),
    }),
  ),
});

export type InitiateCheckoutSession = z.infer<typeof initiateCheckoutSchema>;

export const initiateCheckoutSession = initActionFactory().action(
  async (input: InitiateCheckoutSession, { error }) => {
    console.log("initiate checkout session", input);
    let activeProducts: Map<string, Stripe.Product>;

    try {
      activeProducts = await stripe.products
        .list({
          active: true,
          limit: 100,
        })
        .then((r) => new Map(r.data.map((p) => [p.id, p] as const)));
    } catch (cause) {
      console.error("Unable to load Stripe products for checkout.", cause);
      return error(
        "stripe_connection_failed",
        "Checkout could not connect to Stripe. In local development, make sure network access to Stripe is available and STRIPE_KEY is configured.",
      );
    }

    const missingProduct = input.items.find(
      (item) => !activeProducts.has(item.id),
    );

    if (missingProduct) {
      return error(
        "stripe_product_not_found",
        "Checkout can only start with products loaded from Stripe. Refresh the shop after Stripe products load, then add the item again.",
      );
    }

    const response = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      mode: "payment",
      allow_promotion_codes: true,
      line_items: input.items.map((item) => ({
        price:
          (activeProducts.get(item.id)!.default_price as string) ?? undefined,
        quantity: item.quantity,
      })),
      redirect_on_completion: "never",
      permissions: {
        update_shipping_details: "server_only",
      },
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
    });

    return {
      checkoutSessionId: response.id,
      clientSecret: response.client_secret,
    };
  },
);
