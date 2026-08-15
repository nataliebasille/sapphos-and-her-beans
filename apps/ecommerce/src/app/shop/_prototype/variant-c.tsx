"use client";

/** PROTOTYPE — throwaway. Variant C: filter-rail + minimal grouped gallery. */

import { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { type products } from "@models";
import { AddToCartButton, CheckboxField, COLORS, sizeLabel } from "./shared";

export const VARIANT_C_NAME = "Filter rail";

type OriginCard = {
  key: string;
  country?: string;
  farm: string;
  color: products.Product["color"];
  tastingNotes?: string;
  processing?: string;
  region?: string;
  isDecaf: boolean;
  sizes: products.Product[];
};

function toCards(list: products.Product[]): OriginCard[] {
  const map = new Map<string, OriginCard>();
  for (const p of list) {
    const key = `${p.country ?? ""}|${p.farm}`;
    let card = map.get(key);
    if (!card) {
      card = {
        key,
        country: p.country,
        farm: p.farm,
        color: p.color,
        tastingNotes: p.tastingNotes,
        processing: p.processing,
        region: p.region,
        isDecaf: p.isDecaf,
        sizes: [],
      };
      map.set(key, card);
    }
    card.sizes.push(p);
  }
  return [...map.values()];
}

function FilterGroup({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: string[];
  selected: Set<string>;
  onToggle: (v: string) => void;
}) {
  return (
    <div>
      <h3 className="mb-3 font-mono text-[11px] font-bold tracking-widest text-primary-700 uppercase">
        {title}
      </h3>
      <ul className="flex flex-col gap-2.5">
        {options.map((opt) => (
          <li key={opt}>
            <CheckboxField
              checked={selected.has(opt)}
              onChange={() => onToggle(opt)}
              label={<span className="capitalize">{opt}</span>}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function GalleryCard({ card }: { card: OriginCard }) {
  const c = COLORS[card.color];
  const [selected, setSelected] = useState(card.sizes[0]!);
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-primary-950/10 bg-surface-50 shadow-sm transition-shadow hover:shadow-md">
      <div className={twMerge("flex items-start justify-between p-5", c.bg100)}>
        <div>
          <h3 className="text-2xl font-bold tracking-wide text-primary-950 uppercase">
            {card.country}
          </h3>
          <p className="text-sm text-primary-800">{card.farm}</p>
        </div>
        <span
          className={twMerge(
            "rounded-full px-3 py-1 text-[11px] font-bold tracking-wide uppercase",
            c.bg900,
            c.text50,
          )}
        >
          {card.processing}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <p className="text-lg leading-snug font-semibold text-primary-900 italic">
          {card.tastingNotes}
        </p>

        <div className="mt-auto flex flex-wrap gap-1.5">
          {card.sizes.map((s) => {
            const active = s.id === selected.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelected(s)}
                className={twMerge(
                  "rounded-md border px-2.5 py-1 text-xs font-semibold tracking-wide uppercase transition-colors",
                  active ?
                    twMerge(c.bg900, c.text50, c.border900)
                  : "border-primary-950/20 bg-transparent text-primary-800",
                )}
              >
                {sizeLabel(s.size)}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between border-t border-primary-950/10 pt-4">
          <span className="text-2xl font-bold text-primary-950">
            ${selected.price}
          </span>
          <AddToCartButton coffee={selected} compact />
        </div>
      </div>
    </div>
  );
}

export function VariantC({ products: list }: { products: products.Product[] }) {
  const cards = useMemo(() => toCards(list), [list]);

  const processes = useMemo(
    () =>
      [...new Set(list.map((p) => p.processing).filter(Boolean))] as string[],
    [list],
  );
  const sizes = useMemo(
    () => [...new Set(list.map((p) => p.size))],
    [list],
  );

  const [selProcess, setSelProcess] = useState<Set<string>>(new Set());
  const [selSize, setSelSize] = useState<Set<string>>(new Set());
  const [decafOnly, setDecafOnly] = useState(false);

  const toggle =
    (setter: React.Dispatch<React.SetStateAction<Set<string>>>) =>
    (v: string) =>
      setter((prev) => {
        const next = new Set(prev);
        next.has(v) ? next.delete(v) : next.add(v);
        return next;
      });

  const filtered = useMemo(
    () =>
      cards.filter((card) => {
        if (decafOnly && !card.isDecaf) return false;
        if (selProcess.size && !selProcess.has(card.processing ?? ""))
          return false;
        if (
          selSize.size &&
          !card.sizes.some((s) => selSize.has(s.size))
        )
          return false;
        return true;
      }),
    [cards, decafOnly, selProcess, selSize],
  );

  const byCountry = useMemo(() => {
    const map = new Map<string, OriginCard[]>();
    for (const card of filtered) {
      const key = card.country ?? "Other";
      const arr = map.get(key) ?? [];
      arr.push(card);
      map.set(key, arr);
    }
    return [...map.entries()];
  }, [filtered]);

  const clearAll = () => {
    setSelProcess(new Set());
    setSelSize(new Set());
    setDecafOnly(false);
  };

  const hasFilters = selProcess.size || selSize.size || decafOnly;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
      <div className="grid gap-8 md:grid-cols-[220px_1fr]">
        {/* Filter rail */}
        <aside className="md:sticky md:top-24 md:h-fit">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-wide text-primary-950 uppercase">
              Filters
            </h2>
            {hasFilters ? (
              <button
                type="button"
                onClick={clearAll}
                className="text-xs font-semibold tracking-wide text-primary-700 uppercase underline"
              >
                Clear
              </button>
            ) : null}
          </div>
          <div className="flex flex-col gap-7">
            <FilterGroup
              title="Process"
              options={processes}
              selected={selProcess}
              onToggle={toggle(setSelProcess)}
            />
            <FilterGroup
              title="Size"
              options={sizes.map((s) => s)}
              selected={selSize}
              onToggle={toggle(setSelSize)}
            />
            <div>
              <h3 className="mb-3 font-mono text-[11px] font-bold tracking-widest text-primary-700 uppercase">
                Roast
              </h3>
              <CheckboxField
                checked={decafOnly}
                onChange={setDecafOnly}
                label="Decaf only"
              />
            </div>
          </div>
        </aside>

        {/* Gallery */}
        <div>
          <header className="mb-8 border-b border-primary-950/20 pb-4">
            <h1 className="text-4xl font-bold tracking-wide text-primary-950 uppercase">
              Browse coffee
            </h1>
            <p className="mt-1 text-primary-800">
              {filtered.length} origins
            </p>
          </header>

          {byCountry.length === 0 ? (
            <p className="py-16 text-center text-lg text-primary-700">
              No coffees match those filters.
            </p>
          ) : (
            <div className="flex flex-col gap-10">
              {byCountry.map(([country, group]) => (
                <section key={country}>
                  <h2 className="mb-4 flex items-center gap-3 text-sm font-bold tracking-[0.3em] text-primary-700 uppercase">
                    {country}
                    <span className="h-px flex-1 bg-primary-950/15" />
                  </h2>
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {group.map((card) => (
                      <GalleryCard key={card.key} card={card} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
