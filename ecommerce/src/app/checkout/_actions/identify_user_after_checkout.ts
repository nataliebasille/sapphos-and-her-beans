"use server";

import { initActionFactory } from "@action-rpc";
import { stripe } from "@stripe";

export const identifyUserAfterCheckout = initActionFactory().action(
  async (input: { checkoutSessionId: string }) => {
    const response = await stripe.checkout.sessions.retrieve(
      input.checkoutSessionId,
    );

    console.log("response", response);

    return response.customer_details?.email;
  },
);
