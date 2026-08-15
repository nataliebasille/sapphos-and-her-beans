"use client";

/**
 * PROTOTYPE — throwaway. Variant B: origin index rows with the label look.
 * Full-width rows: MedievalSharp origin motif + badges left, notes + spec
 * middle, size/price/add right. Inline pill filters. Not a data table.
 */

import { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  AddButton,
  accentFor,
  altitudeLabel,
  Eyebrow,
  fermentationInfo,
  type OriginGroup,
  OriginMotif,
  ScoreBadge,
  ShopCanvas,
  SizePills,
  SizePriceBadge,
  TraceableFooter,
  groupByOrigin,
  tint,
  useSizeSelection,
  type Coffee,
} from "./shared";

export const VARIANT_B_NAME = "Origin index";

function SpecInline({ group }: { group: OriginGroup }) {
  const ferment = fermentationInfo(group.fermentation);
  const items = [
    ferment ? ["Fermentation", ferment.value] : null,
    group.processing ? ["Process", group.processing] : null,
    group.lot ? ["Lot", group.lot] : null,
    group.region ? ["Region", group.region] : null,
    group.varietals ? ["Varietals", group.varietals] : null,
    altitudeLabel(group.altitude)
      ? ["Altitude", altitudeLabel(group.altitude)!]
      : null,
  ].filter(Boolean) as [string, string][];

  return (
    <dl className="flex flex-wrap gap-x-5 gap-y-1.5">
      {items.map(([label, value]) => (
        <div key={label} className="flex items-baseline gap-1.5">
          <dt className="font-mono text-[10px] font-bold tracking-widest text-[#001F36]/45 uppercase">
            {label}
          </dt>
          <dd className="text-sm font-semibold text-[#001F36]/85">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function IndexRow({ group }: { group: OriginGroup }) {
  const accent = accentFor(group.color);
  const { selected, setSelected } = useSizeSelection(group);
  const ferment = fermentationInfo(group.fermentation);

  return (
    <div
      className="grid grid-cols-1 gap-6 rounded-2xl border-2 bg-white p-6 md:grid-cols-[minmax(0,240px)_minmax(0,1fr)_auto] md:items-center md:gap-8"
      style={{ borderColor: tint(accent, 0.5) }}
    >
      {/* origin block */}
      <div
        className="flex flex-col gap-4 rounded-xl p-4"
        style={{ backgroundColor: tint(accent, 0.35) }}
      >
        <div className="flex items-center justify-between">
          <SizePriceBadge
            size={selected.size}
            price={selected.price}
            accent={accent}
            className="text-base"
          />
          {group.score ? <ScoreBadge score={group.score} /> : null}
        </div>
        <OriginMotif origin={group.origin} label={group.label} size="sm" />
      </div>

      {/* notes + spec */}
      <div className="flex flex-col gap-3">
        <p className="text-lg leading-snug font-bold text-[#001F36] italic">
          {ferment?.kicker ? (
            <span className="mr-2 text-xs font-semibold tracking-[0.2em] text-[#001F36]/55 not-italic uppercase">
              {ferment.kicker}
            </span>
          ) : null}
          {group.notes.join(", ")}
        </p>
        <SpecInline group={group} />
        <TraceableFooter traceable={group.traceable} />
      </div>

      {/* actions */}
      <div className="flex flex-col items-start gap-3 md:items-end">
        <SizePills group={group} selected={selected} onSelect={setSelected} />
        <span className="font-primary text-2xl font-semibold text-[#001F36]">
          ${selected.price}
        </span>
        <AddButton coffee={selected} />
      </div>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={twMerge(
        "rounded-full border px-4 py-1.5 text-xs font-semibold tracking-[0.1em] uppercase transition-colors",
        active
          ? "border-[#001F36] bg-[#001F36] text-[#FAF9F8]"
          : "border-[#001F36]/20 text-[#001F36]/70 hover:border-[#001F36]/50",
      )}
    >
      {children}
    </button>
  );
}

export function VariantB({ products: list }: { products: Coffee[] }) {
  const groups = useMemo(() => groupByOrigin(list), [list]);
  const processes = useMemo(
    () =>
      [...new Set(groups.map((g) => g.processing).filter(Boolean))] as string[],
    [groups],
  );

  const [selProcess, setSelProcess] = useState<Set<string>>(new Set());
  const [decafOnly, setDecafOnly] = useState(false);

  const toggle = (v: string) =>
    setSelProcess((prev) => {
      const next = new Set(prev);
      next.has(v) ? next.delete(v) : next.add(v);
      return next;
    });

  const filtered = groups.filter((g) => {
    if (decafOnly && !g.isDecaf) return false;
    if (selProcess.size && !selProcess.has(g.processing ?? "")) return false;
    return true;
  });

  return (
    <ShopCanvas>
      <div className="mx-auto max-w-6xl px-6 pb-24 md:px-10">
        <header className="py-10 md:py-14">
          <Eyebrow className="text-[#EFAA9C]">Shop Coffee</Eyebrow>
          <h1 className="mt-3 font-primary text-4xl leading-tight font-semibold tracking-tight text-[#001F36] md:text-5xl">
            The origin index.
          </h1>
        </header>

        {/* inline filters */}
        <div className="mb-8 flex flex-wrap items-center gap-2">
          <FilterPill
            active={selProcess.size === 0 && !decafOnly}
            onClick={() => {
              setSelProcess(new Set());
              setDecafOnly(false);
            }}
          >
            All
          </FilterPill>
          {processes.map((p) => (
            <FilterPill
              key={p}
              active={selProcess.has(p)}
              onClick={() => toggle(p)}
            >
              {p}
            </FilterPill>
          ))}
          <span className="mx-1 h-5 w-px bg-[#001F36]/15" />
          <FilterPill active={decafOnly} onClick={() => setDecafOnly((d) => !d)}>
            Decaf
          </FilterPill>
          <span className="ml-auto text-xs tracking-wide text-[#001F36]/45 uppercase">
            {filtered.length} origins
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {filtered.map((g) => (
            <IndexRow key={g.key} group={g} />
          ))}
        </div>
      </div>
    </ShopCanvas>
  );
}
