// PROTOTYPE — Variant B "Brand poster": white (printable) background, brand navy type, coffee colour only as an accent band.
// Hierarchy: farm name is the hero → flavour band → spec sheet → QR footer.
import { Fragment } from "react";
import {
  BRAND,
  type Coffee,
  LabelFrame,
  Logo,
  QrCode,
  antic,
  callout,
  detailRows,
  fermentationText,
  montserrat,
  notoSans,
  paletteVars,
  score,
  tastingNotes,
} from "./shared";

export const name = "Brand poster";

export function VariantB({ coffee }: { coffee: Coffee }) {
  const tag = fermentationText(coffee) ?? callout(coffee);
  const pts = score(coffee);

  return (
    <LabelFrame
      className={`flex flex-col ${notoSans.className}`}
      style={{
        ...paletteVars(coffee.color),
        backgroundColor: "white",
        color: BRAND.navy,
      }}
    >
      <header className="flex items-center justify-between px-5 pt-4">
        <Logo
          color={BRAND.navy}
          className="aspect-[5/3] w-[118px]"
          style={{ maskPosition: "center 47%" }}
        />
        <div
          className={`flex flex-col items-end gap-1 ${montserrat.className}`}
        >
          <span
            className="rounded-full px-3 py-1 text-sm font-extrabold tracking-wider"
            style={{ backgroundColor: BRAND.navy, color: BRAND.pink }}
          >
            {coffee.size}
          </span>
          {pts !== undefined && (
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
              {pts} pts
            </span>
          )}
        </div>
      </header>

      <section
        className={`flex flex-1 flex-col justify-center px-5 ${montserrat.className}`}
      >
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.35em]">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--c700)]" />
          {coffee.country}
        </div>
        <h1 className="mt-1 text-balance text-[34px] font-black uppercase leading-[0.95] tracking-tight">
          {coffee.farm}
        </h1>
        {tag && (
          <p
            className={`mt-2 text-[13px] italic text-[var(--c800)] ${antic.className}`}
          >
            {tag}
          </p>
        )}
      </section>

      <section className="bg-[var(--c800)] px-5 py-3 text-[var(--c50)]">
        <div
          className={`text-[9px] font-semibold uppercase tracking-[0.3em] opacity-80 ${montserrat.className}`}
        >
          In the cup
        </div>
        <p
          className={`mt-1 text-balance text-[19px] leading-tight ${antic.className}`}
        >
          {tastingNotes(coffee).map((note, i, all) => (
            <Fragment key={note}>
              <span className="whitespace-nowrap">
                {note}
                {i < all.length - 1 && " ·"}
              </span>
              {i < all.length - 1 && " "}
            </Fragment>
          ))}
        </p>
      </section>

      <div className="flex flex-1 flex-col justify-center px-5 py-3">
        <dl className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-1.5 text-[11px] leading-snug">
          {detailRows(coffee).map(([label, value]) => (
            <div key={label} className="contents">
              <dt
                className={`pt-[1px] text-[8.5px] font-semibold uppercase tracking-[0.2em] opacity-60 ${montserrat.className}`}
              >
                {label}
              </dt>
              <dd className="font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <footer
        className="flex items-end gap-3 border-t-2 px-5 pb-4 pt-3"
        style={{ borderColor: BRAND.navy }}
      >
        <QrCode
          className="h-14 w-14 border-2 bg-white"
          style={{ borderColor: BRAND.navy }}
        />
        <div className="flex flex-1 flex-col gap-2 text-[9.5px]">
          <span
            className={`font-semibold uppercase tracking-[0.2em] ${montserrat.className}`}
          >
            Scan to meet the farmers
          </span>
          <span className="italic">Traceable to {coffee.traceable}</span>
        </div>
        <div
          className={`flex flex-col items-end text-[9px] uppercase tracking-[0.2em] ${montserrat.className}`}
        >
          <span className="font-semibold">Roasted</span>
          <span
            className="mt-2 inline-block w-16 border-b-2"
            style={{ borderColor: BRAND.navy }}
          />
        </div>
      </footer>
    </LabelFrame>
  );
}
