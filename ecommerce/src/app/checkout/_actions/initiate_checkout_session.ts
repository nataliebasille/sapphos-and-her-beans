"use server";

import { initActionFactory } from "@action-rpc";
import { stripe } from "@stripe";
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
  async (input: InitiateCheckoutSession) => {
    const activeProducts = await stripe.products
      .list({
        active: true,
      })
      .then((r) => new Map(r.data.map((p) => [p.id, p] as const)));

    const response = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      mode: "payment",
      line_items: input.items.map((item) => ({
        price:
          (activeProducts.get(item.id)!.default_price as string) ?? undefined,
        quantity: item.quantity,
      })),
      redirect_on_completion: "never",
      permissions: {
        update: {
          shipping_details: "server_only",
        },
      },
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
    });

    return response.client_secret;
  },
);
