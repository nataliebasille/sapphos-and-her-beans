"use client";

/**
 * PROTOTYPE — throwaway. Variant B: editorial origin index.
 * Dense full-width rows with hairline dividers + inline pill filters.
 * Deliberately NOT a data table — reads like a typeset index.
 */

import { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  AddButton,
  accentFor,
  altitudeLabel,
  Eyebrow,
  type OriginGroup,
  ShopCanvas,
  SizePills,
  groupByOrigin,
  useSizeSelection,
  type Coffee,
} from "./shared";

export const VARIANT_B_NAME = "Origin index";

function IndexRow({ group }: { group: OriginGroup }) {
  const accent = accentFor(group.color);
  const { selected, setSelected } = useSizeSelection(group);

  return (
    <div className="grid grid-cols-1 items-center gap-5 border-t border-[#001F36]/10 py-6 transition-colors hover:bg-white/60 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.3fr)_auto] md:gap-8 md:px-3">
      {/* origin */}
      <div className="flex items-start gap-4">
        <span
          className="mt-1.5 size-3 shrink-0 rounded-full"
          style={{ backgroundColor: accent }}
        />
        <div>
          <p className="text-[0.65rem] font-semibold tracking-[0.2em] text-[#001F36]/55 uppercase">
            {group.processing}
          </p>
          <h3 className="font-primary text-xl leading-tight font-semibold text-[#001F36]">
            {group.origin}
          </h3>
          <p className="text-sm text-[#001F36]/65">{group.label}</p>
          {group.region ? (
            <p className="mt-0.5 text-xs text-[#001F36]/45">
              {group.region}
              {altitudeLabel(group.altitude) ? ` · ${altitudeLabel(group.altitude)}` : ""}
            </p>
          ) : null}
        </div>
      </div>

      {/* tasting notes as prose */}
      <p className="text-[15px] leading-relaxed text-[#001F36]/75 italic">
        {group.notes.join(", ")}
        {group.score ? (
          <span className="ml-2 rounded-full bg-[#001F36]/5 px-2 py-0.5 text-[11px] font-semibold text-[#001F36]/70 not-italic">
            {group.score} pts
          </span>
        ) : null}
      </p>

      {/* actions */}
      <div className="flex items-center justify-between gap-4 md:justify-end">
        <div className="flex flex-col items-start gap-2 md:items-end">
          <SizePills group={group} selected={selected} onSelect={setSelected} />
          <span className="font-primary text-lg font-semibold text-[#001F36]">
            ${selected.price}
          </span>
        </div>
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
      <div className="mx-auto max-w-5xl px-6 pb-24 md:px-10">
        <header className="py-10 md:py-14">
          <Eyebrow className="text-[#EFAA9C]">Shop Coffee</Eyebrow>
          <h1 className="mt-3 font-primary text-4xl leading-tight font-semibold tracking-tight text-[#001F36] md:text-5xl">
            The origin index.
          </h1>
        </header>

        {/* inline filters */}
        <div className="flex flex-wrap items-center gap-2 pb-3">
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
            <FilterPill key={p} active={selProcess.has(p)} onClick={() => toggle(p)}>
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

        <div>
          {filtered.map((g) => (
            <IndexRow key={g.key} group={g} />
          ))}
          <div className="border-t border-[#001F36]/10" />
        </div>
      </div>
    </ShopCanvas>
  );
}
