"use client";
import { useCartStoreApi } from "~/app/_stores/cart/cart-provider";
import { CheckoutForm } from "../_components/checkout-form";
import { useEmptyCart } from "~/app/_stores/cart";
import { Heading } from "~/app/_components/heading";

export default function CheckoutCartPage() {
  const cartStore = useCartStoreApi();
  const emptyCart = useEmptyCart();
  return (
    <div className="px-4 md:px-10">
      <div className="mb-5 border-b-[1px] border-black/30 md:col-span-2 md:mb-10">
        <Heading
          level={3}
          className="mb-0 text-center uppercase tracking-wide md:text-left"
        >
          Checkout
        </Heading>
      </div>

      <CheckoutForm
        items={async () => {
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
        }}
        onComplete={emptyCart}
      />
    </div>
  );
}
