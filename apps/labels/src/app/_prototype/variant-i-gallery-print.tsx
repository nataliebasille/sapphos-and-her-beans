// PROTOTYPE — Variant I "Gallery print": every bag is a one-off abstract painting generated (seeded by product id)
// from the coffee's own colour ramp + brand pink/peach, with a museum-style wall placard as the info card.
// Inspiration (concept only, nothing copied): DAK Coffee Roasters' art-covered boxes with a small white info
// label — https://www.dakcoffeeroasters.com/shop/ . The generative art, placard conceit and layout are original.
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
  shades,
} from "./shared";

export const name = "Gallery print";

function seededRandom(seed: string) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

function Painting({ coffee }: { coffee: Coffee }) {
  const rand = seededRandom(coffee.id);
  const s = shades(coffee.color);
  const palette = [
    s["300"],
    s["400"],
    s["500"],
    s["600"],
    s["700"],
    s["800"],
    BRAND.pink,
    BRAND.peach,
    BRAND.peachyPink,
  ];
  const pick = () => palette[Math.floor(rand() * palette.length)];
  const radius = () =>
    Array.from({ length: 8 }, () => `${30 + Math.round(rand() * 40)}%`)
      .join(" ")
      .replace(/^((?:\S+ ){3}\S+) /, "$1 / ");
  const washes = Array.from({ length: 8 }, () => ({
    left: rand() * 110 - 30,
    top: rand() * 100 - 25,
    size: 140 + rand() * 200,
    color: pick(),
    rotate: rand() * 360,
    squash: 0.45 + rand() * 0.5,
  }));
  const shapes = Array.from({ length: 5 }, () => ({
    left: rand() * 100 - 20,
    top: rand() * 80 - 15,
    size: 70 + rand() * 150,
    color: pick(),
    rotate: rand() * 360,
    radius: radius(),
  }));
  const strokes = Array.from({ length: 4 }, () => ({
    top: rand() * 75,
    rotate: -40 + rand() * 80,
    height: 5 + rand() * 14,
    color: pick(),
  }));

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ backgroundColor: s["200"] }}
    >
      <div className="absolute inset-0 blur-[18px]">
        {washes.map((b, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${b.left}%`,
              top: `${b.top}%`,
              width: b.size,
              height: b.size * b.squash,
              backgroundColor: b.color,
              transform: `rotate(${b.rotate}deg)`,
            }}
          />
        ))}
      </div>
      {shapes.map((sh, i) => (
        <div
          key={i}
          className="absolute opacity-80 mix-blend-multiply"
          style={{
            left: `${sh.left}%`,
            top: `${sh.top}%`,
            width: sh.size,
            height: sh.size,
            backgroundColor: sh.color,
            borderRadius: sh.radius,
            transform: `rotate(${sh.rotate}deg)`,
          }}
        />
      ))}
      <div className="absolute inset-0 blur-[1.5px]">
        {strokes.map((st, i) => (
          <div
            key={i}
            className="absolute -left-10 w-[140%] rounded-full opacity-85"
            style={{
              top: `${st.top}%`,
              height: st.height,
              backgroundColor: st.color,
              transform: `rotate(${st.rotate}deg)`,
            }}
          />
        ))}
      </div>
      <div
        className="absolute inset-0 opacity-50 mix-blend-multiply"
        style={{ backgroundImage: GRAIN }}
      />
    </div>
  );
}

export function VariantI({ coffee }: { coffee: Coffee }) {
  const pts = score(coffee);
  const tag = fermentationText(coffee) ?? callout(coffee);
  const altitude = "altitude" in coffee ? coffee.altitude : undefined;
  const medium = [coffee.varietals, coffee.processing]
    .filter(Boolean)
    .join("; ");

  return (
    <LabelFrame
      className={notoSans.className}
      style={{ ...paletteVars(coffee.color), color: BRAND.navy }}
    >
      <Painting coffee={coffee} />

      <div className="absolute left-3 top-3 bg-white/85 px-2 py-1 backdrop-blur-sm">
        <Logo
          color={BRAND.navy}
          className="aspect-[5/3] w-[92px]"
          style={{ maskPosition: "center 47%" }}
        />
      </div>
      {pts !== undefined && (
        <div
          className={`absolute right-3 top-3 bg-white/85 px-2.5 py-1.5 text-right font-semibold uppercase leading-tight tracking-[0.2em] backdrop-blur-sm ${montserrat.className}`}
        >
          <div className="text-[22px] tracking-normal">{pts}</div>
          <div className="text-[8px]">cupping score</div>
        </div>
      )}

      <div className="absolute bottom-5 left-5 right-12 bg-white px-4 pb-3 pt-3.5 shadow-[0_6px_18px_rgba(0,0,0,0.18)]">
        <div
          className={`text-[13px] font-semibold uppercase leading-tight tracking-wide ${montserrat.className}`}
        >
          {coffee.farm}
        </div>
        <div className="text-[10px] leading-snug opacity-70">
          {coffee.region?.includes(coffee.country ?? "") ?
            coffee.region.trim()
          : [coffee.country, coffee.region?.trim()].filter(Boolean).join(", ")}
        </div>

        <div className="mt-2.5 text-balance text-[16px] italic leading-snug">
          {coffee.tastingNotes}
        </div>

        <div className="mt-2.5 text-[9.5px] leading-snug">
          {medium}
          {tag && <div className="mt-0.5 opacity-80">{tag}</div>}
        </div>
        <div className="mt-1 text-[9.5px] leading-snug opacity-70">
          {[altitude, coffee.lot && `Lot ${coffee.lot}`, coffee.size]
            .filter(Boolean)
            .join(" · ")}
        </div>

        <div className="mt-3 flex items-end gap-3 border-t border-neutral-200 pt-2.5">
          <QrCode className="h-9 w-9" />
          <div className="flex-1 text-[8.5px] italic leading-snug opacity-80">
            Traceable to {coffee.traceable}
          </div>
          <div
            className={`text-[8px] uppercase tracking-[0.15em] ${montserrat.className}`}
          >
            Roasted
            <span className="mt-2.5 block w-14 border-b border-current" />
          </div>
        </div>
      </div>
    </LabelFrame>
  );
}
