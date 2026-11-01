// PROTOTYPE — Variant E "Bento grid": modular tiles, no linear reading order. Each fact gets its own tile;
// tasting notes get the biggest one. Deliberately unlike B (top-down poster), D (spine) and rejected C (ornamental).
import {
  BRAND,
  type Coffee,
  LabelFrame,
  Logo,
  QrCode,
  callout,
  fermentationText,
  montserrat,
  notoSans,
  paletteVars,
  score,
  tastingNotes,
} from "./shared";

export const name = "Bento grid";

const tile = "rounded-xl p-2.5 flex flex-col";
const tileLabel = `text-[8px] font-semibold uppercase tracking-[0.2em] opacity-70 ${montserrat.className}`;

export function VariantE({ coffee }: { coffee: Coffee }) {
  const tag = fermentationText(coffee) ?? callout(coffee);
  const pts = score(coffee);
  const notes = tastingNotes(coffee);
  const longest = Math.max(...notes.map((n) => n.length));
  const noteSize = Math.min(24, 250 / (longest * 0.62), 150 / notes.length);

  return (
    <LabelFrame
      className={`grid grid-cols-6 grid-rows-[auto_auto_1fr_auto_auto_auto] gap-1.5 p-2 ${notoSans.className}`}
      style={{
        ...paletteVars(coffee.color),
        backgroundColor: BRAND.frost,
        color: BRAND.navy,
      }}
    >
      <div
        className={`${tile} col-span-4 items-start justify-center`}
        style={{ backgroundColor: BRAND.pink }}
      >
        <Logo
          color={BRAND.navy}
          className="aspect-[5/3] w-[110px]"
          style={{ maskPosition: "center 47%" }}
        />
      </div>
      <div
        className={`${tile} col-span-2 items-center justify-center text-center`}
        style={{ backgroundColor: BRAND.navy, color: BRAND.pink }}
      >
        <span className={tileLabel}>Net wt</span>
        <span
          className={`text-[26px] font-black leading-none ${montserrat.className}`}
        >
          {coffee.size}
        </span>
      </div>

      <div className={`${tile} col-span-6 bg-[var(--c100)]`}>
        <span className={tileLabel}>{coffee.farm}</span>
        <span
          className={`text-[34px] font-black uppercase leading-[0.95] tracking-tight text-[var(--c900)] ${montserrat.className}`}
        >
          {coffee.country}
        </span>
      </div>

      <div
        className={`${tile} col-span-4 row-span-1 justify-between bg-[var(--c800)] text-[var(--c50)]`}
      >
        <span className={tileLabel}>Tastes like</span>
        <ul
          className={`flex flex-col font-extrabold lowercase leading-[1.05] ${montserrat.className}`}
          style={{ fontSize: noteSize }}
        >
          {notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </div>
      <div className="col-span-2 grid grid-rows-2 gap-1.5">
        <div
          className={`${tile} items-center justify-center text-center`}
          style={{ backgroundColor: BRAND.peachyPink }}
        >
          {pts !== undefined ?
            <>
              <span
                className={`text-[30px] font-black leading-none ${montserrat.className}`}
              >
                {pts}
              </span>
              <span className={tileLabel}>Cupping score</span>
            </>
          : <>
              <span className={tileLabel}>Lot</span>
              <span className="text-[12px] font-bold leading-tight">
                {coffee.lot}
              </span>
            </>
          }
        </div>
        <div
          className={`${tile} justify-center bg-[var(--c300)] text-[var(--c950)]`}
        >
          <span className={tileLabel}>
            {fermentationText(coffee) ?
              "Fermentation"
            : tag ?
              "Note"
            : "Process"}
          </span>
          <span className="text-[11px] font-bold leading-tight">
            {tag ?? coffee.processing}
          </span>
        </div>
      </div>

      {tag && (
        <div className={`${tile} col-span-6 bg-white`}>
          <span className={tileLabel}>Process</span>
          <span className="text-[11px] font-semibold leading-tight">
            {coffee.processing}
          </span>
        </div>
      )}

      <div className={`${tile} col-span-2 bg-white`}>
        <span className={tileLabel}>Region</span>
        <span className="text-[10.5px] font-semibold leading-tight">
          {coffee.region?.trim()}
        </span>
      </div>
      <div className={`${tile} col-span-2 bg-white`}>
        <span className={tileLabel}>Varietals</span>
        <span className="text-[10.5px] font-semibold leading-tight">
          {coffee.varietals}
        </span>
      </div>
      <div className={`${tile} col-span-2 bg-white`}>
        <span className={tileLabel}>Altitude</span>
        <span className="text-[10.5px] font-semibold leading-tight">
          {"altitude" in coffee ? coffee.altitude : "—"}
        </span>
      </div>

      <div
        className="col-span-2 flex flex-row items-center gap-2 rounded-xl p-2.5"
        style={{ backgroundColor: BRAND.pink }}
      >
        <QrCode className="h-11 w-11 rounded bg-white" />
        <span className={`${tileLabel} leading-tight`}>Meet the farmers</span>
      </div>
      <div
        className={`${tile} col-span-2 justify-between`}
        style={{ backgroundColor: BRAND.pink }}
      >
        <span className={tileLabel}>Roasted on</span>
        <span className="mb-1 block border-b-2 border-dashed border-current" />
      </div>
      <div
        className={`${tile} col-span-2`}
        style={{ backgroundColor: BRAND.pink }}
      >
        <span className={tileLabel}>Traceable to</span>
        <span className="text-[10px] font-semibold italic leading-tight">
          {coffee.traceable}
        </span>
      </div>
    </LabelFrame>
  );
}
