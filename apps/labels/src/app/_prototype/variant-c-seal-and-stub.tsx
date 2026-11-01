// PROTOTYPE — Variant C "Seal & stub": centred, ornamental, vintage apothecary label with a tear-off ticket stub.
// Hierarchy: logo medallion → country/farm → flavour → ribbon → stub (details + roast date + size).
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
  medievalSharp,
  paletteVars,
  score,
  tastingNotes,
} from "./shared";

export const name = "Seal & stub";

export function VariantC({ coffee }: { coffee: Coffee }) {
  const tag = fermentationText(coffee) ?? callout(coffee);
  const pts = score(coffee);
  const notes = tastingNotes(coffee);

  return (
    <LabelFrame
      className={`flex flex-col text-[var(--c950)] shadow-none drop-shadow-xl ${antic.className}`}
      style={paletteVars(coffee.color)}
    >
      <div
        className="relative flex flex-1 flex-col justify-center pb-4"
        style={{ backgroundColor: BRAND.frost }}
      >
        <div className="pointer-events-none absolute inset-x-[8px] bottom-[6px] top-[8px] border-[5px] border-double border-[var(--c900)]" />

        {pts !== undefined && (
          <div className="absolute right-5 top-5 flex h-16 w-16 rotate-12 items-center justify-center rounded-full bg-[var(--c300)] shadow">
            <div
              className={`flex h-[54px] w-[54px] flex-col items-center justify-center rounded-full border border-dashed border-[var(--c900)] leading-none ${medievalSharp.className}`}
            >
              <span className="text-lg font-bold">{pts}</span>
              <span className="text-[8px] tracking-[0.25em]">POINTS</span>
            </div>
          </div>
        )}

        <div className="mx-auto mt-6 flex h-[104px] w-[104px] items-center justify-center rounded-full bg-[var(--c900)] ring-4 ring-[var(--c200)] ring-offset-2 ring-offset-[var(--c900)]">
          <Logo
            color={BRAND.frost}
            className="aspect-[5/3] w-[86px]"
            style={{ maskPosition: "center 47%" }}
          />
        </div>

        <div className={`mt-3 text-center ${medievalSharp.className}`}>
          <div className="text-[28px] font-bold uppercase leading-none tracking-[0.15em]">
            {coffee.country}
          </div>
          <div className="mt-1 text-base tracking-wider text-[var(--c800)]">
            {coffee.farm}
          </div>
        </div>

        <div className="mx-10 my-2 flex items-center gap-2 text-[var(--c800)]">
          <span className="h-px flex-1 bg-current" />
          <span className="text-sm">❦</span>
          <span className="h-px flex-1 bg-current" />
        </div>

        <p className="mx-8 text-balance text-center text-[17px] italic leading-snug">
          {notes.slice(0, -1).join(", ")}
          {notes.length > 1 && " & "}
          {notes.at(-1)}
        </p>

        {tag && (
          <div
            className={`mx-auto mt-3 bg-[var(--c900)] px-7 py-1 text-center text-[10px] uppercase tracking-[0.2em] text-[var(--c50)] ${medievalSharp.className}`}
            style={{
              clipPath:
                "polygon(0 0, 100% 0, 94% 50%, 100% 100%, 0 100%, 6% 50%)",
            }}
          >
            {tag}
          </div>
        )}
      </div>

      <div
        className="relative bg-[var(--c100)]"
        style={{
          maskImage:
            "radial-gradient(circle 12px at 0 0, transparent 11px, black 12px), radial-gradient(circle 12px at 100% 0, transparent 11px, black 12px)",
          maskComposite: "intersect",
        }}
      >
        <div className="mx-4 border-t-2 border-dashed border-[var(--c900)]" />
        <div className="px-5 pb-4 pt-3">
          <dl className="grid grid-cols-3 gap-x-3 gap-y-1.5 text-[9.5px] leading-tight">
            {detailRows(coffee).map(([label, value]) => (
              <div
                key={label}
                className={
                  label === "Process" || label === "Varietals" ?
                    "col-span-3"
                  : ""
                }
              >
                <dt
                  className={`text-[8px] uppercase tracking-[0.2em] text-[var(--c700)] ${medievalSharp.className}`}
                >
                  {label}
                </dt>
                <dd className="font-bold">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-2 flex items-end gap-3">
            <QrCode className="h-11 w-11 border border-[var(--c900)] bg-white" />
            <div className="flex-1 text-[9px] leading-tight">
              <div>
                Roasted on{" "}
                <span className="inline-block w-5 border-b border-current" /> /{" "}
                <span className="inline-block w-5 border-b border-current" />
              </div>
              <div className="mt-1 italic">Traceable to {coffee.traceable}</div>
            </div>
            <div
              className={`text-2xl font-bold leading-none ${medievalSharp.className}`}
            >
              {coffee.size}
            </div>
          </div>
        </div>
      </div>
    </LabelFrame>
  );
}
