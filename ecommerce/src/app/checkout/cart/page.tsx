"use client";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { PageContainer } from "~/app/_components/page-container";
import { useCartSelector } from "~/app/_stores/cart";
import { initiateCheckout } from "~/server/checkout/actions";

export default function CheckoutCartPage() {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ?? "",
  );
  const cart = useCartSelector((s) => s.cart);
  return (
    <EmbeddedCheckoutProvider
      stripe={stripePromise}
      options={{
        fetchClientSecret: async () => {
          const response = await initiateCheckout({
            items: Object.entries(cart).map(([id, item]) => ({
              id,
              quantity: item.quantity,
            })),
          });

          return response.value ?? "";
        },
      }}
    >
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
}
