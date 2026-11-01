// PROTOTYPE — Variant F "Bold classic": the current label (A)'s bones — MedievalSharp, diamond rules, size tab,
// score medallion on the seam, label/value info table, FIND ME QR — set as a full-bleed colour field with
// a big knocked-out logo and light text. Requested as "evolve A" + "bold colour field".
import type { CSSProperties } from "react";
import {
  type Coffee,
  LabelFrame,
  Logo,
  QrCode,
  callout,
  detailRows,
  fermentationText,
  medievalSharp,
  paletteVars,
  score,
} from "./shared";

export const name = "Bold classic";

function DiamondRule() {
  return (
    <div className="relative h-[2px] flex-1 bg-[var(--c200)]">
      <div className="absolute left-1/2 top-[1px] aspect-square w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 border-2 border-[var(--c200)] bg-[var(--c900)]" />
      <div className="absolute left-1/2 top-1/2 aspect-square w-1 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[var(--c200)]" />
    </div>
  );
}

export function VariantF({ coffee }: { coffee: Coffee }) {
  const tag = fermentationText(coffee) ?? callout(coffee);
  const pts = score(coffee);
  const country = coffee.country ?? "";
  const countryStyle: CSSProperties = {
    fontSize: Math.min(28, 230 / (country.length * 0.68)),
  };

  return (
    <LabelFrame
      className={`flex flex-col bg-[var(--c900)] text-[var(--c50)]`}
      style={paletteVars(coffee.color)}
    >
      <div className="relative flex h-[36%] shrink-0 items-center justify-center">
        <div className="absolute left-2 top-2 flex flex-col items-center gap-0.5">
          <QrCode className="h-[46px] w-[46px] border-2 border-[var(--c200)] bg-white" />
          <span className="text-[9px] font-bold tracking-wide text-[var(--c200)]">
            FIND ME
          </span>
        </div>
        <div
          className={`absolute right-0 top-0 flex h-[36px] min-w-[52px] items-center justify-center rounded-bl-md bg-[var(--c50)] px-2 pt-1 font-bold text-[var(--c950)] ${medievalSharp.className}`}
        >
          {coffee.size}
        </div>
        <Logo
          color="var(--c50)"
          className="aspect-[5/3] w-[210px]"
          style={{ maskPosition: "center 47%" }}
        />
      </div>

      <div className="relative mx-3 border-t-2 border-[var(--c200)]">
        {pts !== undefined && (
          <div
            className={`absolute left-1/2 top-0 flex aspect-square w-16 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-2 border-[var(--c900)] bg-[var(--c200)] font-bold leading-none text-[var(--c950)] ring-2 ring-[var(--c200)] ${medievalSharp.className}`}
          >
            <span className="text-base">{pts}</span>
            <span className="text-[10px] tracking-widest">pts</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-evenly">
        <div
          className={`flex items-center gap-4 px-3 ${pts !== undefined ? "mt-8" : "mt-2"} ${medievalSharp.className}`}
        >
          <DiamondRule />
          <div className="max-w-[240px] text-center">
            <div
              className="font-bold uppercase leading-none tracking-widest"
              style={countryStyle}
            >
              {country}
            </div>
            <div className="mt-1 text-lg font-bold leading-tight tracking-wider text-[var(--c100)]">
              {coffee.farm}
            </div>
          </div>
          <DiamondRule />
        </div>

        <div className="px-4 text-center">
          {tag && (
            <div className="mb-1 text-[0.75rem] uppercase tracking-widest text-[var(--c200)]">
              {tag}
            </div>
          )}
          <div className="text-balance text-lg/6 font-bold italic tracking-wide">
            {coffee.tastingNotes}
          </div>
        </div>

        <dl className="grid grid-cols-[max-content_1fr] gap-y-[1px] border-y-2 border-[var(--c200)] bg-[var(--c200)] text-xs">
          {detailRows(coffee).map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="flex items-center justify-end bg-[var(--c950)] py-[3px] pl-2 pr-3 font-mono font-bold uppercase text-[var(--c200)]">
                {label}
              </dt>
              <dd className="flex items-center bg-[var(--c800)] px-2 py-[3px] font-bold tracking-wider">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="flex items-end gap-3 px-3 pb-2 pt-2 font-serif text-[.7rem] font-bold tracking-wider text-[var(--c100)]">
        <div className="flex shrink-0 items-end text-nowrap leading-[10px]">
          Roasted on:
          <span className="ml-1 w-4 border-b border-current" />
          <span className="px-[2px]">/</span>
          <span className="w-4 border-b border-current" />
        </div>
        <span className="flex-1 text-right text-[.6rem] italic leading-tight">
          Traceable to {coffee.traceable}
        </span>
      </div>
    </LabelFrame>
  );
}
