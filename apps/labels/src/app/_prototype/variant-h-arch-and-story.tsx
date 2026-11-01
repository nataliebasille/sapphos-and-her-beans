// PROTOTYPE — Variant H "Arch & story": soft boutique direction. A single arch in the coffee colour frames the
// origin in an italic serif; tasting notes are set like a line of poetry; all the technical data is written as
// one short prose paragraph instead of a table. Deliberately shares nothing with B/C/D/E/F/G.
import {
  BRAND,
  type Coffee,
  LabelFrame,
  Logo,
  QrCode,
  callout,
  fermentationText,
  fraunces,
  notoSans,
  paletteVars,
  score,
  tastingNotes,
} from "./shared";

export const name = "Arch & story";

function story(coffee: Coffee): string {
  const sentences: string[] = [];
  const altitude = "altitude" in coffee ? coffee.altitude : undefined;
  const grown = [
    coffee.varietals,
    altitude && `grown at ${altitude}`,
    coffee.region && `in ${coffee.region.trim()}`,
  ]
    .filter(Boolean)
    .join(" ");
  if (grown) sentences.push(grown);
  if (coffee.processing) {
    sentences.push(
      (
        /process/i.test(coffee.processing) ||
          coffee.processing.split(/\s+/).length > 2
      ) ?
        coffee.processing
      : `${coffee.processing} process`,
    );
  }
  const ferm = fermentationText(coffee);
  if (ferm) sentences.push(ferm);
  if (coffee.lot) sentences.push(`Lot ${coffee.lot}`);
  sentences.push(`Traceable to ${coffee.traceable}`);
  return `${sentences.map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(". ")}.`;
}

export function VariantH({ coffee }: { coffee: Coffee }) {
  const pts = score(coffee);
  const note = callout(coffee);
  const notes = tastingNotes(coffee);
  const country = coffee.country ?? "";
  const countrySize = Math.min(44, 250 / (country.length * 0.5));

  return (
    <LabelFrame
      className={`flex flex-col items-center ${fraunces.className}`}
      style={{
        ...paletteVars(coffee.color),
        backgroundColor: BRAND.frost,
        color: BRAND.navy,
      }}
    >
      <Logo
        color={BRAND.navy}
        className="mt-3 aspect-[5/3] w-[112px]"
        style={{ maskPosition: "center 47%" }}
      />

      <div className="relative mt-1 h-[244px] w-[280px] shrink-0 rounded-t-full bg-[var(--c700)] text-[var(--c50)]">
        <div className="absolute inset-[7px] bottom-0 rounded-t-full border border-b-0 border-[var(--c300)]" />
        <div className="absolute inset-x-0 top-9 text-center text-sm text-[var(--c200)]">
          ✦
        </div>
        <div className="absolute inset-x-4 bottom-6 flex flex-col items-center text-center">
          <span className="text-[9px] uppercase tracking-[0.35em] text-[var(--c200)]">
            {note ?? "single origin"}
          </span>
          <span
            className="mt-1 font-light italic leading-[1.05]"
            style={{ fontSize: countrySize }}
          >
            {country}
          </span>
          <span className="mt-2 text-[14px] tracking-wide">{coffee.farm}</span>
          <span className="mt-3 text-[9px] uppercase tracking-[0.3em] text-[var(--c200)]">
            {coffee.size}
            {pts !== undefined && ` · ${pts} points`}
          </span>
        </div>
      </div>
      <div className="h-px w-[328px] shrink-0 bg-current" />

      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8">
        <p className="text-balance text-center text-[19px] italic leading-snug">
          {notes.slice(0, -1).join(", ")}
          {notes.length > 1 && " & "}
          {notes.at(-1)}
        </p>
        <span className="h-px w-8 bg-[var(--c600)]" />
        <p
          className={`text-balance text-center text-[9.5px] leading-relaxed opacity-80 ${notoSans.className}`}
        >
          {story(coffee)}
        </p>
      </div>

      <div className="flex w-full items-end justify-between px-6 pb-4">
        <div className="flex items-center gap-2">
          <QrCode className="h-10 w-10" />
          <span className="text-[10px] italic leading-tight">
            scan for
            <br />
            her story
          </span>
        </div>
        <span className="flex items-end gap-1 text-[11px] italic">
          roasted
          <span className="mb-[3px] inline-block w-16 border-b border-current" />
        </span>
      </div>
    </LabelFrame>
  );
}
