"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

/** Picks which coffee's label to show; hidden when printing. */
export function CoffeePicker({
  coffees,
  current,
}: {
  coffees: { key: string; label: string }[];
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
    <label className="fixed right-4 top-4 z-10 flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm shadow-lg print:hidden">
      Coffee
      <select
        className="rounded border border-neutral-300 bg-white px-1 py-0.5"
        value={current}
        onChange={(e) => select(e.target.value)}
      >
        <option value="all">All coffees</option>
        {coffees.map((c) => (
          <option key={c.key} value={c.key}>
            {c.label}
          </option>
        ))}
      </select>
    </label>
  );
}
