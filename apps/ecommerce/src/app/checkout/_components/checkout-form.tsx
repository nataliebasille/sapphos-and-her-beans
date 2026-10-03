"use client";

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useCallback, useEffect, useRef, useState } from "react";
import { ShoppingBagEmpty } from "~/app/_components/shopping-bag-empty";
import { Spinner } from "~/app/_components/spinner";
import { initiateCheckoutSession } from "../../../server/checkout/initiate_checkout_session";
import { updateCheckoutSessionShipping } from "../../../server/checkout/update_checkout_session_shipping";
import { identifyUserAfterCheckout } from "../../../server/checkout/identify_user_after_checkout";

type CheckoutItem = { id: string; quantity: number };

type CheckoutFormProps = {
  items: CheckoutItem[] | (() => Promise<CheckoutItem[]>);
  className?: string;
  onComplete?: (details: { checkoutSessionId: string | null }) => void;
};

export function CheckoutForm({
  items: itemsFetcher,
  className,
  onComplete,
}: CheckoutFormProps) {
  const sessionIdRef = useRef<string | null>(null);
  const itemsFetcherRef = useRef(itemsFetcher);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [items, setItems] = useState(
    typeof itemsFetcher === "function" ? ("loading" as const) : itemsFetcher,
  );

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ?? "",
    {
      betas: ["embedded_checkout_byol_beta_1"],
    },
  );

  const handleOnComplete = useCallback(() => {
    if (sessionIdRef.current) {
      void identifyUserAfterCheckout({
        checkoutSessionId: sessionIdRef.current,
      }).then((result) => {
        if (result.value) {
          window.heap.identify(result.value);
        }
      });
    }

    onComplete?.({ checkoutSessionId: sessionIdRef.current });
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
            setCheckoutError(null);
            const response = await initiateCheckoutSession({
              items,
            });

            if (response.type === "ok" && response.value) {
              sessionIdRef.current = response.value.checkoutSessionId;
              return response.value.clientSecret ?? "";
            }

            const message =
              response.type === "error" ?
                (response.value.message ??
                "Checkout could not start. Please try again.")
              : "Stripe did not return a checkout session secret. Please try again.";
            setCheckoutError(message);
            throw new Error(message);
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
        {checkoutError ?
          <CheckoutError message={checkoutError} />
        : <EmbeddedCheckout className={className} />}
      </EmbeddedCheckoutProvider>
    : <ShoppingBagEmpty />
  );
}

function CheckoutError({ message }: { message: string }) {
  return (
    <div className="flex min-h-[360px] items-center justify-center px-4 text-center">
      <div className="max-w-sm">
        <p className="text-danger-700 text-[0.72rem] font-semibold tracking-[0.22em] uppercase">
          Checkout unavailable
        </p>
        <h2 className="font-primary text-primary-800 mt-3 text-2xl font-semibold">
          Stripe could not start.
        </h2>
        <p className="text-primary-800/65 mt-3 text-sm leading-relaxed">
          {message}
        </p>
      </div>
    </div>
  );
}
