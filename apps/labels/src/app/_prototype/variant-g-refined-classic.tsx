// PROTOTYPE — Variant G "Refined classic": evolution of the current label (A). Same skeleton — black logo
// block over a light framed panel, MedievalSharp, diamond rules, score medallion on the seam, dark-label
// info table — with cleaner hierarchy: QR + size move into the logo block, everything auto-fits and wraps.
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

export const name = "Refined classic";

function DiamondRule() {
  return (
    <div className="relative h-[2px] flex-1 bg-[var(--c900)]">
      <div className="absolute left-1/2 top-[1px] aspect-square w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 border-2 border-[var(--c900)] bg-[var(--c50)]" />
      <div className="absolute left-1/2 top-1/2 aspect-square w-1 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[var(--c900)]" />
    </div>
  );
}

export function VariantG({ coffee }: { coffee: Coffee }) {
  const tag = fermentationText(coffee) ?? callout(coffee);
  const pts = score(coffee);
  const country = coffee.country ?? "";
  const countryStyle: CSSProperties = {
    fontSize: Math.min(26, 220 / (country.length * 0.68)),
  };

  return (
    <LabelFrame
      className="flex flex-col bg-black"
      style={paletteVars(coffee.color)}
    >
      <div className="relative flex h-[34%] shrink-0 items-center justify-center">
        <Logo
          color="#ffffff"
          className="-mt-5 aspect-[5/3] w-[230px]"
          style={{ maskPosition: "center 47%" }}
        />
        <div className="absolute bottom-3 left-3 flex flex-col items-center gap-0.5">
          <QrCode className="h-[42px] w-[42px] bg-white p-[2px]" />
          <span className="text-[8px] font-bold tracking-[0.2em] text-white">
            FIND ME
          </span>
        </div>
        <div
          className={`absolute bottom-3 right-3 rounded border-2 border-[var(--c200)] px-2 pt-1 text-sm font-bold text-[var(--c200)] ${medievalSharp.className}`}
        >
          {coffee.size}
        </div>
      </div>

      <div className="relative flex flex-1 flex-col border-8 border-t-0 border-[var(--c900)] bg-[var(--c50)] text-[var(--c950)]">
        {pts !== undefined && (
          <div
            className={`absolute left-1/2 top-0 z-10 flex aspect-square w-16 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-2 border-[var(--c950)] bg-[var(--c200)] font-bold leading-none ${medievalSharp.className}`}
          >
            <span className="text-base">{pts}</span>
            <span className="text-[10px] tracking-widest">pts</span>
          </div>
        )}

        <div
          className={`flex flex-1 flex-col justify-evenly ${pts !== undefined ? "pt-7" : "pt-2"}`}
        >
          <div
            className={`flex items-center gap-4 px-2 ${medievalSharp.className}`}
          >
            <DiamondRule />
            <div className="max-w-[230px] text-center">
              <div
                className="font-bold uppercase leading-none tracking-widest"
                style={countryStyle}
              >
                {country}
              </div>
              <div className="mt-1 text-base font-bold leading-tight tracking-wider">
                {coffee.farm}
              </div>
            </div>
            <DiamondRule />
          </div>

          <div className="px-3 text-center">
            {tag && (
              <div className="mb-1 text-[0.75rem] uppercase tracking-widest text-[var(--c800)]">
                {tag}
              </div>
            )}
            <div className="text-balance text-lg/5 font-bold italic tracking-wide">
              {coffee.tastingNotes}
            </div>
          </div>

          <dl className="grid grid-cols-[max-content_1fr] gap-y-[1px] border-y-2 border-[var(--c900)] bg-[var(--c900)] text-xs">
            {detailRows(coffee).map(([label, value]) => (
              <div key={label} className="contents">
                <dt className="flex items-center justify-end bg-[var(--c900)] py-[2px] pl-1 pr-3 font-mono font-bold uppercase text-[var(--c50)]">
                  {label}
                </dt>
                <dd className="flex items-center bg-[var(--c50)] px-2 py-[2px] font-bold leading-tight tracking-wider">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex items-end gap-3 px-2 pb-1 pt-1 font-serif text-[.7rem] font-bold tracking-wider">
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
      </div>
    </LabelFrame>
  );
}
