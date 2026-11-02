"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

/** Picks which coffee's label to show; hidden when printing. */
export function CoffeePicker({
  coffees,
  current,
}: {
  coffees: string[];
  current: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const select = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") params.delete("coffee");
    else params.set("coffee", value);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  return (
    <label className="fixed right-4 top-4 z-[100] flex flex-row items-center gap-2 rounded-full bg-black px-3 py-1.5 font-sans text-xs text-white shadow-2xl ring-2 ring-fuchsia-400 print:hidden">
      Coffee
      <select
        className="appearance-auto rounded-sm border-0 bg-neutral-800 bg-none px-1 py-0.5 text-white"
        value={current}
        onChange={(e) => select(e.target.value)}
      >
        <option className={optionClass} value="all">
          — All coffees —
        </option>
        {coffees.map((c) => (
          <option className={optionClass} key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </label>
  );
}

// Overrides Natcore's base option:hover / option:checked colours, which are meant for light selects.
const optionClass =
  "bg-neutral-800 text-white hover:bg-neutral-600 hover:text-white checked:bg-neutral-700 checked:text-white";
