"use client";

import { Suspense } from "react";
import { CoffeeListPrototype } from "./_prototype/prototype-switcher";

// PROTOTYPE — throwaway coffee-list redesign.
// Four layouts on this same route, switchable via `?variant=` and the floating
// bottom bar: current · A (Editorial) · B (Spec sheet) · C (Filter rail).
export default function ShopPage() {
  return (
    <Suspense>
      <CoffeeListPrototype />
    </Suspense>
  );
}
