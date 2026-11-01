import { Courier_Prime, Montserrat } from "next/font/google";
import { Bubbles } from "./icons/bubbles";
import { FlaskRound } from "./icons/flask-round";
import {
  type Coffee,
  detailRows,
  fermentationInfo,
  paletteVars,
  score,
  tastingNotes,
} from "./coffee-label-data";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "800", "900"],
});
const courierPrime = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
});

/**
 * 4x6in printable coffee bag label: a coloured spine (score, country, size) beside
 * a white panel with the black logo, product name, fermentation, tasting notes,
 * details and the QR code.
 */
export function CoffeeLabel({ coffee }: { coffee: Coffee }) {
  const ferment = fermentationInfo(coffee);
  const pts = score(coffee);

  return (
    <article
      className={`relative flex h-[6in] w-[4in] shrink-0 overflow-hidden bg-white text-[var(--c950)] shadow-xl print:break-after-page print:shadow-none ${courierPrime.className}`}
      style={paletteVars(coffee.color)}
    >
      <aside className="flex w-[78px] shrink-0 flex-col items-center justify-between bg-[var(--c900)] py-4 text-[var(--c50)]">
        {pts !== undefined ?
          <span
            className={`flex flex-col items-center leading-none ${montserrat.className}`}
          >
            <span className="text-xl font-black">{pts}</span>
            <span className="mt-0.5 text-[8px] font-semibold tracking-[0.25em] opacity-80">
              PTS
            </span>
          </span>
        : <span aria-hidden />}
        <span
          className={`whitespace-nowrap font-black uppercase leading-none tracking-tight ${montserrat.className}`}
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            // Shrink long country names so they fit the spine.
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

      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <header className="flex justify-center border-b border-[var(--c900)] pb-2">
          <img
            src="/sappho black logo cropped.png"
            alt="Sappho & her beans coffee"
            className="h-auto w-[150px] object-contain"
          />
        </header>

        <h2 className="mt-3 text-balance text-[22px] font-bold leading-tight">
          {coffee.name}
        </h2>

        {ferment && (
          <div className="mt-3 flex items-center gap-2.5 border-y-2 border-dashed border-[var(--c700)] py-2">
            {ferment.anaerobic ?
              <FlaskRound className="size-7 shrink-0 text-[var(--c700)]" />
            : <Bubbles className="size-7 shrink-0 text-[var(--c700)]" />}
            <div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-[var(--c700)]">
                {ferment.kicker}
              </div>
              <div
                className={`text-[15px] font-extrabold uppercase leading-tight text-[var(--c800)] ${montserrat.className}`}
              >
                {ferment.value}
              </div>
            </div>
          </div>
        )}

        <ol className="my-auto flex flex-col gap-1 py-3">
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

        <dl className="flex flex-col gap-1 text-[10px] leading-tight">
          {detailRows(coffee).map(([label, value]) => (
            <div key={label} className="flex items-baseline gap-1">
              <dt className="shrink-0 uppercase">{label}</dt>
              <span className="min-w-3 flex-1 border-b border-dotted border-current" />
              <dd className="max-w-[62%] text-right font-bold">{value}</dd>
            </div>
          ))}
        </dl>

        <footer className="mt-3 flex items-center gap-3 border-t border-[var(--c900)] pt-2">
          <img
            src="/site qr code.png"
            alt="QR code linking to the Sappho & her beans shop"
            className="h-12 w-12 [image-rendering:pixelated]"
          />
          <div className="flex-1 text-[9px] leading-snug">
            {/* TODO: once the QR points at /shop/[id], say "Scan for this coffee's full story". */}
            <div className="font-bold uppercase tracking-[0.1em] text-[var(--c800)]">
              ← Scan to visit our shop
            </div>
            <div className="mt-1">traceable to {coffee.traceable}</div>
            <div className="mt-1">
              ROASTED:{" "}
              <span className="inline-block w-14 border-b border-current" />
            </div>
          </div>
        </footer>
      </div>
    </article>
  );
}
