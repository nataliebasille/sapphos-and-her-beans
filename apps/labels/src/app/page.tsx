import { Suspense } from "react";
import { CoffeeLabel } from "./_components/coffee-label";
import {
  ACTIVE_COFFEE_KEYS,
  type CoffeeKey,
  getCoffee,
} from "./_components/coffee-label-data";
import { CoffeePicker } from "./_components/coffee-picker";

/**
 * Printable labels for every active coffee. Pick one coffee with the selector
 * (or `?coffee=<PRODUCT_KEY>`, e.g. `?coffee=MEXICO`). Each label prints on its own 4x6in page.
 */
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ coffee?: string }>;
}) {
  const { coffee } = await searchParams;
  const selected =
    ACTIVE_COFFEE_KEYS.includes(coffee as CoffeeKey) ?
      (coffee as CoffeeKey)
    : undefined;
  const keys = selected ? [selected] : ACTIVE_COFFEE_KEYS;

  return (
    <main className="flex min-h-full flex-wrap items-start justify-center gap-16 bg-neutral-200 p-16 pt-20 print:block print:bg-white print:p-0">
      <h1 className="sr-only">Coffee labels</h1>
      <Suspense>
        <CoffeePicker
          current={selected ?? "all"}
          coffees={ACTIVE_COFFEE_KEYS}
        />
      </Suspense>
      {keys.map((key) => (
        <CoffeeLabel key={key} coffee={getCoffee(key)} />
      ))}
    </main>
  );
}
