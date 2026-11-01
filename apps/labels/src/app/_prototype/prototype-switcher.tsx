"use client";
// PROTOTYPE — floating variant switcher (←/→ keys) + coffee picker. Hidden in production and when printing.
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";

type Props = {
  variants: { key: string; name: string }[];
  current: string;
  coffees: string[];
  currentCoffee: string;
};

export function PrototypeSwitcher({
  variants,
  current,
  coffees,
  currentCoffee,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(key, value);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams],
  );

  const index = Math.max(
    0,
    variants.findIndex((v) => v.key === current),
  );
  const cycle = useCallback(
    (delta: number) =>
      setParam(
        "variant",
        variants[(index + delta + variants.length) % variants.length].key,
      ),
    [index, variants, setParam],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, select, [contenteditable]")) return;
      if (e.key === "ArrowLeft") cycle(-1);
      if (e.key === "ArrowRight") cycle(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cycle]);

  if (process.env.NODE_ENV === "production") return null;

  const btn = "rounded-full px-3 py-1 text-lg leading-none hover:bg-white/15";

  return (
    <>
      <div className="fixed bottom-5 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-2 rounded-full bg-black px-2 py-1.5 font-sans text-sm text-white shadow-2xl ring-2 ring-fuchsia-400 print:hidden">
        <button
          type="button"
          className={btn}
          onClick={() => cycle(-1)}
          aria-label="Previous variant"
        >
          ←
        </button>
        <span className="min-w-48 text-center font-semibold">
          {variants[index].key} — {variants[index].name}
        </span>
        <button
          type="button"
          className={btn}
          onClick={() => cycle(1)}
          aria-label="Next variant"
        >
          →
        </button>
      </div>

      <label className="fixed right-4 top-4 z-[100] flex items-center gap-2 rounded-full bg-black px-3 py-1.5 font-sans text-xs text-white shadow-2xl ring-2 ring-fuchsia-400 print:hidden">
        Coffee
        <select
          className="rounded bg-neutral-800 px-1 py-0.5"
          value={currentCoffee}
          onChange={(e) => setParam("coffee", e.target.value)}
        >
          <option value="all">— All coffees —</option>
          {coffees.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
    </>
  );
}
