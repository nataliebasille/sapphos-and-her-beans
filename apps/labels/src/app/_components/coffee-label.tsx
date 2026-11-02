import { Courier_Prime, MedievalSharp, Montserrat } from "next/font/google";
import { Bubbles } from "./icons/bubbles";
import { FlaskRound } from "./icons/flask-round";
import {
  type Coffee,
  detailRows,
  fermentationInfo,
  score,
  tastingNotes,
} from "./coffee-label-data";
import { DetailRows } from "./detail-rows";
import { LABEL_PALETTES } from "./label-palette";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "800", "900"],
});
const courierPrime = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
});
// Same stylised brand font the shop uses for coffee names (BrandingStylizedFont).
const medievalSharp = MedievalSharp({ subsets: ["latin"], weight: "400" });

/**
 * 4x6in printable coffee bag label: a coloured spine (score, country, size) beside
 * a white panel with the black logo, product name, fermentation, tasting notes,
 * details and the QR code.
 */
// The name is the label's headline; longer names step down so they stay within ~3 lines.
function nameSize(name: string) {
  if (name.length <= 12) return 36;
  if (name.length <= 20) return 30;
  if (name.length <= 28) return 26;
  return 22;
}

export function CoffeeLabel({ coffee }: { coffee: Coffee }) {
  const ferment = fermentationInfo(coffee);
  const pts = score(coffee);
  const palette = LABEL_PALETTES[coffee.color];

  return (
    <section
      aria-label={`${coffee.name} label`}
      className={`relative flex h-[6in] w-[4in] shrink-0 overflow-hidden ${palette} text-950 bg-white shadow-xl print:break-after-page print:shadow-none ${courierPrime.className}`}
    >
      <aside className="bg-900 text-50 flex w-[78px] shrink-0 flex-col items-center justify-between py-4">
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
          className={`text-200 text-sm font-extrabold ${montserrat.className}`}
        >
          {coffee.size}
        </span>
      </aside>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <header className="border-900 flex justify-center border-b pb-2">
          <img
            src="/sappho black logo cropped.png"
            alt="Sappho & her beans coffee"
            className="h-auto w-[150px] object-contain"
          />
        </header>

        <h2
          className={`font-bold! text-900 leading-[1.05]! mt-3 text-balance tracking-wide ${medievalSharp.className}`}
          style={{ fontSize: nameSize(coffee.name) }}
        >
          {coffee.name}
        </h2>

        {ferment && (
          <div className="border-700 mt-3 flex items-center gap-2.5 border-y-2 border-dashed py-2">
            {ferment.anaerobic ?
              <FlaskRound className="text-700 size-7 shrink-0" />
            : <Bubbles className="text-700 size-7 shrink-0" />}
            <div>
              <div className="text-700 text-[9px] uppercase tracking-[0.2em]">
                {ferment.kicker}
              </div>
              <div
                className={`text-800 text-[15px] font-extrabold uppercase leading-tight ${montserrat.className}`}
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
              className="border-300 flex items-baseline gap-2 border-b border-dotted pb-0.5"
            >
              <span className="text-600 text-[10px]">
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

        <DetailRows rows={detailRows(coffee)} />

        <footer className="border-900 mt-3 flex items-center gap-3 border-t pt-2">
          <img
            src="/site qr code.png"
            alt="QR code linking to the Sappho & her beans shop"
            className="h-12 w-12 [image-rendering:pixelated]"
          />
          <div className="flex-1 text-[9px] leading-snug">
            {/* TODO: once the QR points at /shop/[id], say "Scan for this coffee's full story". */}
            <div className="text-800 font-bold uppercase tracking-[0.1em]">
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
    </section>
  );
}
