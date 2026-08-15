"use client";

/** PROTOTYPE — throwaway. Variant A: editorial / magazine storytelling layout. */

import { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { type products } from "@models";
import { BrandingStylizedFont } from "~/app/fonts";
import { AddToCartButton, COLORS, sizeLabel } from "./shared";

export const VARIANT_A_NAME = "Editorial";

type Group = {
  key: string;
  country?: string;
  farm: string;
  color: products.Product["color"];
  tastingNotes?: string;
  processing?: string;
  region?: string;
  altitude?: string;
  varietals?: string;
  traceable: string;
  sizes: products.Product[];
};

function groupByOrigin(list: products.Product[]): Group[] {
  const map = new Map<string, Group>();
  for (const p of list) {
    const key = `${p.country ?? ""}|${p.farm}`;
    let g = map.get(key);
    if (!g) {
      g = {
        key,
        country: p.country,
        farm: p.farm,
        color: p.color,
        tastingNotes: p.tastingNotes,
        processing: p.processing,
        region: p.region,
        altitude: p.altitude,
        varietals: p.varietals,
        traceable: p.traceable,
        sizes: [],
      };
      map.set(key, g);
    }
    g.sizes.push(p);
  }
  return [...map.values()];
}

function Fact({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <dt className="font-mono text-[11px] tracking-widest text-primary-700/70 uppercase">
        {label}
      </dt>
      <dd className="text-lg font-semibold text-primary-950">{value}</dd>
    </div>
  );
}

function SizePicker({ group }: { group: Group }) {
  const [selected, setSelected] = useState(group.sizes[0]!);
  const c = COLORS[group.color];
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {group.sizes.map((s) => {
          const active = s.id === selected.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelected(s)}
              className={twMerge(
                "rounded-full border px-4 py-1.5 text-sm font-semibold tracking-wide uppercase transition-colors",
                active ?
                  twMerge(c.bg900, c.text50, c.border900)
                : twMerge("bg-transparent text-primary-900", c.border200),
              )}
            >
              {sizeLabel(s.size)} · ${s.price}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-4">
        <span className="text-3xl font-bold text-primary-950">
          ${selected.price}
        </span>
        <AddToCartButton coffee={selected} className="max-w-[200px]" />
      </div>
    </div>
  );
}

function StoryRow({ group, index }: { group: Group; index: number }) {
  const c = COLORS[group.color];
  const flipped = index % 2 === 1;
  return (
    <article className="grid items-stretch gap-0 overflow-hidden rounded-2xl border border-primary-950/10 bg-surface-50 shadow-sm md:grid-cols-2">
      {/* Poster side */}
      <div
        className={twMerge(
          "relative flex min-h-[280px] flex-col justify-between p-8",
          c.bg900,
          flipped && "md:order-2",
        )}
      >
        <div className={twMerge("text-sm tracking-[0.3em] uppercase", c.text50)}>
          {group.processing}
        </div>
        <div>
          <h2
            className={twMerge(
              "text-5xl leading-none font-bold tracking-wide uppercase md:text-6xl",
              c.text50,
              BrandingStylizedFont.className,
            )}
          >
            {group.country}
          </h2>
          <p className={twMerge("mt-3 text-xl", c.text50, "opacity-80")}>
            {group.farm}
          </p>
        </div>
        <div className={twMerge("text-xs tracking-widest uppercase", c.text50, "opacity-70")}>
          Traceable to {group.traceable}
        </div>
      </div>

      {/* Story side */}
      <div className={twMerge("flex flex-col gap-6 p-8", flipped && "md:order-1")}>
        <p className="text-2xl leading-snug font-semibold text-primary-950 italic">
          &ldquo;{group.tastingNotes}&rdquo;
        </p>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
          <Fact label="Region" value={group.region} />
          <Fact label="Varietals" value={group.varietals} />
          <Fact label="Altitude" value={group.altitude} />
          <Fact label="Process" value={group.processing} />
        </dl>
        <div className="mt-auto border-t border-primary-950/10 pt-6">
          <SizePicker group={group} />
        </div>
      </div>
    </article>
  );
}

export function VariantA({ products: list }: { products: products.Product[] }) {
  const groups = useMemo(() => groupByOrigin(list), [list]);
  const hero = groups[0];
  const rest = groups.slice(1);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 md:px-8">
      <header className="mb-10 text-center">
        <p className="font-mono text-xs tracking-[0.4em] text-primary-700 uppercase">
          Sappho &amp; her beans
        </p>
        <h1 className="mt-2 text-5xl font-bold tracking-wide text-primary-950 uppercase md:text-7xl">
          The Coffee Journal
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-primary-800">
          Single-origin lots, told one story at a time. Relational coffee from
          farmers we know by name.
        </p>
      </header>

      {hero && <HeroStory group={hero} />}

      <div className="mt-12 flex flex-col gap-12">
        {rest.map((g, i) => (
          <StoryRow key={g.key} group={g} index={i} />
        ))}
      </div>
    </div>
  );
}

function HeroStory({ group }: { group: Group }) {
  const c = COLORS[group.color];
  return (
    <article
      className={twMerge(
        "relative overflow-hidden rounded-3xl border-2 p-8 md:p-14",
        c.bg900,
        c.border950,
      )}
    >
      <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end">
        <div>
          <span
            className={twMerge(
              "inline-block rounded-full px-4 py-1 text-xs font-bold tracking-[0.3em] uppercase",
              c.bg200,
              c.text950,
            )}
          >
            Featured lot
          </span>
          <h2
            className={twMerge(
              "mt-6 text-6xl leading-none font-bold tracking-wide uppercase md:text-8xl",
              c.text50,
              BrandingStylizedFont.className,
            )}
          >
            {group.country}
          </h2>
          <p className={twMerge("mt-3 text-2xl", c.text50, "opacity-80")}>
            {group.farm}
          </p>
          <p className={twMerge("mt-6 max-w-md text-2xl leading-snug italic", c.text50)}>
            &ldquo;{group.tastingNotes}&rdquo;
          </p>
        </div>
        <div className="rounded-2xl bg-surface-50/95 p-6 backdrop-blur">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
            <Fact label="Process" value={group.processing} />
            <Fact label="Region" value={group.region} />
            <Fact label="Varietals" value={group.varietals} />
            <Fact label="Altitude" value={group.altitude} />
          </dl>
          <div className="mt-6 border-t border-primary-950/10 pt-6">
            <SizePicker group={group} />
          </div>
        </div>
      </div>
    </article>
  );
}
