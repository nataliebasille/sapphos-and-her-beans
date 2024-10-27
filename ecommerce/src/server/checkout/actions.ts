"use server";
"use server";

import { z } from "zod";
import { formAction, initActionFactory } from "@action-rpc";
import { stripe } from "@stripe-client";
import { redirect } from "next/navigation";

const initiateCheckoutSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      quantity: z.number(),
    }),
  ),
});

export type InitiateCheckout = z.infer<typeof initiateCheckoutSchema>;

export const initiateCheckout = initActionFactory().action(
  async (input: InitiateCheckout) => {
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
    });

    console.log(response);

    return response.client_secret;
  },
);
