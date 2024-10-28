"use client";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useCartSelector } from "~/app/_stores/cart";
import { initiateCheckoutSession } from "../_actions/initiate_checkout_session";
import { updateCheckoutSessionShipping } from "../_actions/update_checkout_session_shipping";

export default function CheckoutCartPage() {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ?? "",
    {
      betas: ["embedded_checkout_byol_beta_1"],
    },
  );
  const cart = useCartSelector((s) => s.cart);
  return (
    <EmbeddedCheckoutProvider
      stripe={stripePromise}
      options={{
        fetchClientSecret: async () => {
          const response = await initiateCheckoutSession({
            items: Object.entries(cart).map(([id, item]) => ({
              id,
              quantity: item.quantity,
            })),
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
      }}
    >
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}
