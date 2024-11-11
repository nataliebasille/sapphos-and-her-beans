"use server";
import "server-only";
import { initActionFactory } from "@action-rpc";
import { stripe } from "~/server/+utils/stripe";

export const identifyUserAfterCheckout = initActionFactory().action(
  async (input: { checkoutSessionId: string }) => {
    const response = await stripe.checkout.sessions.retrieve(
      input.checkoutSessionId,
    );

    return response.customer_details?.email;
  },
);
