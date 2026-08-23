"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { Spinner } from "~/app/_components/spinner";
import { useCartQuantity, useEmptyCart } from "~/app/_stores/cart";
import { useCartStoreApi } from "~/app/_stores/cart/cart-provider";
import { useCartSelector } from "~/app/_stores/cart";
import { useProductList } from "~/app/_stores/products";
import { CheckoutForm } from "../_components/checkout-form";
import {
  createCompletedOrderSnapshot,
  saveCompletedOrder,
} from "../receipt/_components/completed-order-storage";

export default function CheckoutCartPage() {
  const fetchItems = useCheckoutItemsFetcher();
  const emptyCart = useEmptyCart();
  const router = useRouter();
  const cartStore = useCartStoreApi();
  const products = useProductList();
  const hydrated = useCartSelector((state) => state.hydrated);
  const quantity = useCartQuantity();

  const completeCheckout = useCallback(() => {
    const { cart } = cartStore.get();
    saveCompletedOrder(createCompletedOrderSnapshot({ cart, products }));
    emptyCart();
    router.push("/checkout/receipt");
  }, [cartStore, emptyCart, products, router]);

  if (!hydrated) {
    return (
      <CheckoutShell>
        <div className="border-primary-500/10 flex min-h-72 items-center justify-center rounded-2xl border bg-white shadow-[0_1px_3px_rgba(0,31,54,0.06)]">
          <Spinner />
        </div>
      </CheckoutShell>
    );
  }

  if (quantity === 0) {
    return (
      <CheckoutShell>
        <section className="mx-auto max-w-xl px-6 pt-12 text-center md:pt-16">
          <span className="bg-surface-500/70 text-primary-800 mx-auto flex size-11 items-center justify-center rounded-full">
            <BagIcon className="size-5" />
          </span>
          <div className="mt-5">
            <span className="text-accent-700 text-[0.72rem] font-semibold tracking-[0.28em] uppercase">
              Checkout
            </span>
            <h1 className="font-primary text-primary-800 mt-3 text-2xl leading-tight font-semibold tracking-tight sm:whitespace-nowrap md:text-3xl">
              Your bag is empty.
            </h1>
            <p className="text-primary-800/65 mx-auto mt-3 max-w-sm text-sm leading-relaxed">
              Choose a coffee first, then checkout will open here when your bag
              is ready.
            </p>
          </div>
          <Link
            href="/shop"
            className="text-on-primary-500 bg-primary-500 mt-7 inline-flex rounded-full px-7 py-3 text-sm font-semibold tracking-[0.14em] uppercase transition-transform hover:-translate-y-0.5"
          >
            Shop Coffee
          </Link>
        </section>
      </CheckoutShell>
    );
  }

  return (
    <CheckoutShell>
      <header className="pt-6 pb-5 text-center md:pt-8 md:pb-6">
        <span className="text-accent-700 text-[0.72rem] font-semibold tracking-[0.28em] uppercase">
          Secure Checkout
        </span>
        <h1 className="font-primary text-primary-800 mt-2 text-3xl leading-tight font-semibold tracking-tight md:text-[2.4rem]">
          Almost yours.
        </h1>
      </header>

      <section
        aria-label="Stripe checkout"
        className="border-primary-500/10 min-h-[520px] rounded-3xl border bg-white p-4 shadow-[0_1px_3px_rgba(0,31,54,0.06)] md:p-6"
      >
        <CheckoutForm items={fetchItems} onComplete={completeCheckout} />
      </section>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {REASSURANCE.map(({ title, body, Icon }) => (
          <div key={title} className="flex items-start gap-3">
            <span className="bg-surface-500/60 text-primary-800 flex size-9 shrink-0 items-center justify-center rounded-full">
              <Icon className="size-4.5" />
            </span>
            <span>
              <span className="text-primary-800 block text-sm font-semibold">
                {title}
              </span>
              <span className="text-primary-800/60 block text-[13px] leading-snug">
                {body}
              </span>
            </span>
          </div>
        ))}
      </div>
    </CheckoutShell>
  );
}

function CheckoutShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface-50 -mt-[calc(89px+1.5rem)] min-h-dvh w-full pt-[89px]">
      <div className="mx-auto max-w-2xl px-4 pb-24 md:px-6">{children}</div>
    </div>
  );
}

function useCheckoutItemsFetcher() {
  const cartStore = useCartStoreApi();

  return useCallback(async () => {
    const cartItems = await Promise.resolve().then(() => {
      const value = cartStore.get();

      if (value.hydrated) {
        return value.cart;
      }

      return new Promise<typeof value.cart>((resolve) => {
        const unsubscribe = cartStore.subscribe((value) => {
          if (value.hydrated) {
            resolve(value.cart);
            unsubscribe();
          }
        });
      });
    });

    return Object.entries(cartItems).map(([id, item]) => ({
      id,
      quantity: item.quantity,
    }));
  }, [cartStore]);
}

const REASSURANCE = [
  {
    title: "Direct trade",
    body: "Single origins traceable to the people who grew them.",
    Icon: HandshakeIcon,
  },
  {
    title: "LGBTQ+ owned",
    body: "Specialty coffee rooted in community and belonging.",
    Icon: HeartIcon,
  },
  {
    title: "Secure checkout",
    body: "Payments encrypted and processed by Stripe.",
    Icon: LockIcon,
  },
] as const;

function HandshakeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m11 17 2 2a1 1 0 1 0 3-3" />
      <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.9-3.9a2 2 0 0 0-2.8 0l-.4.4a2 2 0 0 1-2.8 0l-.4-.4a2 2 0 0 0-2.8 0L3 12" />
      <path d="M15 6.5 13 8" />
      <path d="m18 15 3-3" />
      <path d="M3 12 6 9l3 1" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 21s-6.5-4.35-9-8.5C1.4 9.9 2.6 6.5 5.8 6.1 7.7 5.9 9.3 6.9 10 8.3l2 4 2-4c.7-1.4 2.3-2.4 4.2-2.2 3.2.4 4.4 3.8 2.8 6.4C18.5 16.65 12 21 12 21Z" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function BagIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6.5 8h11l1 12h-13l1-12Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}
