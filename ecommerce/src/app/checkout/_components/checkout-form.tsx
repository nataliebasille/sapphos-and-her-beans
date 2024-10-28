"use client";

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { initiateCheckoutSession } from "../_actions/initiate_checkout_session";
import { updateCheckoutSessionShipping } from "../_actions/update_checkout_session_shipping";

type CheckoutItem = { id: string; quantity: number };

type CheckoutFormProps = {
  items: CheckoutItem[] | (() => Promise<CheckoutItem[]>);
  className?: string;
  onComplete?: () => void;
};

export function CheckoutForm({
  items: itemsFetcher,
  className,
  onComplete,
}: CheckoutFormProps) {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ?? "",
    {
      betas: ["embedded_checkout_byol_beta_1"],
    },
  );
  return (
    <EmbeddedCheckoutProvider
      stripe={stripePromise}
      options={{
        fetchClientSecret: async () => {
          const items = await (typeof itemsFetcher === "function" ?
            itemsFetcher()
          : Promise.resolve(itemsFetcher));
          const response = await initiateCheckoutSession({
            items,
          });

          return response.value ?? "";
        },
        onShippingDetailsChange: async (details) => {
          const result = await updateCheckoutSessionShipping(details);

          return result.type === "ok" ?
              result.value
            : {
                type: "reject",
                errorMessage: "Something went wrong. Please try again.",
              };
        },
        onComplete,
      }}
    >
      <EmbeddedCheckout className={className} />
    </EmbeddedCheckoutProvider>
  );
}
