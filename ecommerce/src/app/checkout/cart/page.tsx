"use client";
import { useCartStoreApi } from "~/app/_stores/cart/cart-provider";
import { CheckoutForm } from "../_components/checkout-form";

export default function CheckoutCartPage() {
  const cartStore = useCartStoreApi();

  return (
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
    />
  );
}
