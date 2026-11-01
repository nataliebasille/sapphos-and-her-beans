// PROTOTYPE — Variant D "Field specimen": asymmetric layout with a full-height coloured spine and typewriter field notes.
// Hierarchy: country on the spine → numbered flavour list → dotted-leader data table with rubber stamps.
import {
  type Coffee,
  LabelFrame,
  Logo,
  QrCode,
  callout,
  courierPrime,
  detailRows,
  fermentationInfo,
  montserrat,
  paletteVars,
  score,
  tastingNotes,
} from "./shared";

export const name = "Field specimen";

export function VariantD({ coffee }: { coffee: Coffee }) {
  const ferment = fermentationInfo(coffee);
  const tag =
    ferment ? `${ferment.kicker} · ${ferment.value}` : callout(coffee);
  const pts = score(coffee);

  return (
    <LabelFrame
      className={`flex bg-white text-[var(--c950)] ${courierPrime.className}`}
      style={paletteVars(coffee.color)}
    >
      <aside className="flex w-[78px] shrink-0 flex-col items-center justify-between bg-[var(--c900)] py-4 text-[var(--c50)]">
        <span className="text-[9px] tracking-widest opacity-80">SAPPHO</span>
        <span
          className={`whitespace-nowrap font-black uppercase leading-none tracking-tight ${montserrat.className}`}
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            fontSize: Math.min(
              46,
              460 / ((coffee.country?.length ?? 1) * 0.72),
            ),
          }}
        >
          {coffee.country}
        </span>
        <span
          className={`text-sm font-extrabold text-[var(--c200)] ${montserrat.className}`}
        >
          {coffee.size}
        </span>
      </aside>

      <main className="relative flex flex-1 flex-col px-4 pb-4 pt-3">
        <header className="flex items-start justify-between">
          <div className="text-[9px] uppercase leading-tight tracking-[0.2em] text-[var(--c700)]">
            Field notes
            <br />
            specimen no.{" "}
            <span className="inline-block w-8 border-b border-current" />
          </div>
          <Logo
            color="var(--c900)"
            className="aspect-[5/3] w-[84px]"
            style={{ maskPosition: "center 47%" }}
          />
        </header>

        <h1 className="mt-2 text-balance text-[22px] font-bold leading-tight">
          {coffee.name}
        </h1>
        <div className="text-[10px] text-[var(--c800)]">{coffee.farm}</div>

        <ol className="mt-3 flex flex-col gap-1">
          {tastingNotes(coffee).map((note, i) => (
            <li
              key={note}
              className="flex items-baseline gap-2 border-b border-dotted border-[var(--c300)] pb-0.5"
            >
              <span className="text-[10px] text-[var(--c600)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={`text-[16px] font-extrabold uppercase leading-tight ${montserrat.className}`}
              >
                {note}
              </span>
            </li>
          ))}
        </ol>

        <dl className="relative mt-auto flex flex-col gap-1 text-[10px] leading-tight">
          {tag && (
            <div className="absolute -top-14 right-0 rotate-[-8deg] border-2 border-[var(--c700)] px-2 py-0.5 text-center text-[10px] font-bold uppercase leading-tight text-[var(--c700)] opacity-85">
              {tag}
            </div>
          )}
          {pts !== undefined && (
            <div className="absolute -top-16 left-0 flex h-12 w-12 rotate-[10deg] flex-col items-center justify-center rounded-full border-2 border-[var(--c700)] font-bold leading-none text-[var(--c700)] opacity-85">
              <span className="text-sm">{pts}</span>
              <span className="text-[7px]">PTS</span>
            </div>
          )}
          {detailRows(coffee).map(([label, value]) => (
            <div key={label} className="flex items-end gap-1">
              <dt className="shrink-0 uppercase">{label}</dt>
              <span className="mb-[3px] min-w-3 flex-1 border-b border-dotted border-current" />
              <dd className="max-w-[62%] text-right font-bold">{value}</dd>
            </div>
          ))}
        </dl>

        <footer className="mt-3 flex items-end gap-3 border-t border-[var(--c900)] pt-2">
          <QrCode className="h-12 w-12" />
          <div className="flex-1 text-[9px] leading-snug">
            <div>
              ROASTED:{" "}
              <span className="inline-block w-14 border-b border-current" />
            </div>
            <div className="mt-1">traceable to {coffee.traceable}</div>
          </div>
        </footer>
      </main>
    </LabelFrame>
  );
}
