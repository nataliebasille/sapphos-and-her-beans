"use client";

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useCallback, useEffect, useRef, useState } from "react";
import { ShoppingBagEmpty } from "~/app/_components/shopping-bag-empty";
import { Spinner } from "~/app/_components/spinner";
import { initiateCheckoutSession } from "../_actions/initiate_checkout_session";
import { updateCheckoutSessionShipping } from "../_actions/update_checkout_session_shipping";
import { identifyUserAfterCheckout } from "../_actions/identify_user_after_checkout";

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
  const sessionIdRef = useRef<string | null>(null);
  const itemsFetcherRef = useRef(itemsFetcher);
  const [items, setItems] = useState(
    typeof itemsFetcher === "function" ? ("loading" as const) : itemsFetcher,
  );

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ?? "",
    {
      betas: ["embedded_checkout_byol_beta_1"],
    },
  );

  const handleOnComplete = useCallback(async () => {
    if (sessionIdRef.current) {
      identifyUserAfterCheckout({
        checkoutSessionId: sessionIdRef.current!,
      }).then((result) => {
        if (result.type === "ok" && result.value) {
          window.heap.identify(result.value);
        }
      });
    }

    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    let isMounted = true;

    const loadIfNeeded = async () => {
      if (typeof itemsFetcherRef.current === "function") {
        const items = await itemsFetcherRef.current();

        if (isMounted) {
          setItems(items);
        }
      }
    };

    void loadIfNeeded();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    items === "loading" ?
      <div className="flex justify-center">
        <Spinner />
      </div>
    : items.length > 0 ?
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{
          fetchClientSecret: async () => {
            const response = await initiateCheckoutSession({
              items,
            });

            return response.value ?? "";
          },
          onShippingDetailsChange: async (details) => {
            sessionIdRef.current = details.checkoutSessionId;
            const result = await updateCheckoutSessionShipping(details);
            return result.type === "ok" ?
                result.value
              : {
                  type: "reject",
                  errorMessage: "Something went wrong. Please try again.",
                };
          },
          onComplete: handleOnComplete,
        }}
      >
        <EmbeddedCheckout className={className} />
      </EmbeddedCheckoutProvider>
    : <ShoppingBagEmpty />
  );
}
