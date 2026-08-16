"use client";

// PROTOTYPE: Three shopping-cart directions, switchable with ?variant=drawer|modal|page.
import { Suspense } from "react";
import { ShoppingCartPrototype } from "./shopping-cart-prototype";

export default function ShoppingCartPrototypePage() {
  return (
    <Suspense>
      <ShoppingCartPrototype />
    </Suspense>
  );
}
