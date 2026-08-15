"use client";

/** PROTOTYPE — throwaway. Variant B: dense spec-sheet / comparison table. */

import { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { type products } from "@models";
import { AddToCartButton, CheckboxField, COLORS, sizeLabel } from "./shared";

export const VARIANT_B_NAME = "Spec sheet";

type SortKey = "country" | "price" | "process";

const SIZE_FILTERS = ["all", "250g", "100g", "singleserve"] as const;
type SizeFilter = (typeof SIZE_FILTERS)[number];

function ColumnHeader({
  label,
  sortKey,
  active,
  dir,
  onSort,
  className,
}: {
  label: string;
  sortKey?: SortKey;
  active?: boolean;
  dir?: "asc" | "desc";
  onSort?: (k: SortKey) => void;
  className?: string;
}) {
  return (
    <th
      scope="col"
      className={twMerge(
        "px-4 py-3 text-left font-mono text-[11px] font-bold tracking-widest text-primary-50/80 uppercase",
        sortKey && "cursor-pointer select-none hover:text-primary-50",
        className,
      )}
      onClick={sortKey && onSort ? () => onSort(sortKey) : undefined}
    >
      {label}
      {active && <span className="ml-1">{dir === "asc" ? "▲" : "▼"}</span>}
    </th>
  );
}

export function VariantB({ products: list }: { products: products.Product[] }) {
  const [sizeFilter, setSizeFilter] = useState<SizeFilter>("all");
  const [decafOnly, setDecafOnly] = useState(false);
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({
    key: "country",
    dir: "asc",
  });

  const rows = useMemo(() => {
    let r = list.filter((p) => {
      if (sizeFilter !== "all" && p.size !== sizeFilter) return false;
      if (decafOnly && !p.isDecaf) return false;
      return true;
    });
    r = [...r].sort((a, b) => {
      const mult = sort.dir === "asc" ? 1 : -1;
      if (sort.key === "price") return (a.price - b.price) * mult;
      if (sort.key === "process")
        return (a.processing ?? "").localeCompare(b.processing ?? "") * mult;
      return (a.country ?? "").localeCompare(b.country ?? "") * mult;
    });
    return r;
  }, [list, sizeFilter, decafOnly, sort]);

  const toggleSort = (key: SortKey) =>
    setSort((s) =>
      s.key === key ?
        { key, dir: s.dir === "asc" ? "desc" : "asc" }
      : { key, dir: "asc" },
    );

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 md:px-8">
      <div className="mb-6 flex flex-col gap-4 border-b border-primary-950/20 pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-wide text-primary-950 uppercase">
            Coffee index
          </h1>
          <p className="mt-1 text-primary-800">
            {rows.length} lots · sort and filter to compare
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex overflow-hidden rounded-full border border-primary-950/30">
            {SIZE_FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setSizeFilter(f)}
                className={twMerge(
                  "px-4 py-1.5 text-sm font-semibold tracking-wide uppercase transition-colors",
                  sizeFilter === f ?
                    "bg-primary-950 text-surface-50"
                  : "bg-transparent text-primary-900 hover:bg-primary-950/10",
                )}
              >
                {f === "all" ? "all sizes" : sizeLabel(f)}
              </button>
            ))}
          </div>
          <CheckboxField
            checked={decafOnly}
            onChange={setDecafOnly}
            label="Decaf"
            className="font-semibold tracking-wide text-primary-900 uppercase"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-primary-950/15 shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-primary-950">
            <tr>
              <ColumnHeader
                label="Origin"
                sortKey="country"
                active={sort.key === "country"}
                dir={sort.dir}
                onSort={toggleSort}
              />
              <ColumnHeader label="Farm / Lot" />
              <ColumnHeader
                label="Process"
                sortKey="process"
                active={sort.key === "process"}
                dir={sort.dir}
                onSort={toggleSort}
              />
              <ColumnHeader label="Tasting notes" className="min-w-[220px]" />
              <ColumnHeader label="Size" />
              <ColumnHeader
                label="Price"
                sortKey="price"
                active={sort.key === "price"}
                dir={sort.dir}
                onSort={toggleSort}
                className="text-right"
              />
              <ColumnHeader label="" className="text-right" />
            </tr>
          </thead>
          <tbody>
            {rows.map((p, i) => {
              const c = COLORS[p.color];
              return (
                <tr
                  key={p.id}
                  className={twMerge(
                    "border-t border-primary-950/10 align-middle transition-colors hover:bg-primary-950/[0.04]",
                    i % 2 === 1 && "bg-surface-50/60",
                  )}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className={twMerge(
                          "inline-block size-3 shrink-0 rounded-full",
                          c.bg900,
                        )}
                      />
                      <span className="font-bold tracking-wide text-primary-950 uppercase">
                        {p.country}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-primary-900">
                    <div className="font-semibold">{p.farm}</div>
                    <div className="text-xs text-primary-700">{p.region}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={twMerge(
                        "rounded px-2 py-0.5 text-xs font-semibold tracking-wide uppercase",
                        c.bg100,
                        c.text900,
                      )}
                    >
                      {p.processing}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-primary-900 italic">
                    {p.tastingNotes}
                  </td>
                  <td className="px-4 py-3 font-mono font-semibold tracking-wide text-primary-950 uppercase">
                    {sizeLabel(p.size)}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-primary-950">
                    ${p.price}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <AddToCartButton coffee={p} compact />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
