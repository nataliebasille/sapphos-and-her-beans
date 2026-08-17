"use client";

/**
 * Homepage top — the "Editorial Split" hero experience.
 *
 * Hero:   asymmetric split — copy left, warm photo with a soft organic curve.
 * Featured: editorial coffee cards, horizontal-scroll on mobile.
 */
import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { COFFEE_PALETTES } from "~/app/shop/_components/coffee-palette";
import { BrandingStylizedFont } from "~/app/fonts";
import {
  type Coffee,
  Eyebrow,
  originName,
  tastingNotes,
  useQuickAdd,
} from "./sections";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden pt-24 md:pt-28">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 pt-8 pb-16 md:grid-cols-[1fr_1.05fr] md:gap-14 md:px-10 md:pt-14 md:pb-24">
        <div className="max-w-xl">
          <Eyebrow className="text-accent-700">
            LGBTQ+ Owned Specialty Coffee
          </Eyebrow>
          <h1 className="font-primary text-primary-800 mt-5 text-[2.6rem] leading-[1.02] font-semibold tracking-tight md:text-[4.1rem]">
            Coffee built on relationships.
          </h1>
          <p className="text-primary-800/70 mt-6 max-w-md text-base leading-relaxed md:text-lg">
            Direct-trade specialty coffee from producers we know, with
            extraordinary lots selected for flavor and character.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/shop"
              className="text-on-primary-500 bg-primary-500 rounded-full px-8 py-3.5 text-sm font-semibold tracking-[0.12em] uppercase transition-transform hover:-translate-y-0.5"
            >
              Shop Coffee
            </Link>
            <Link
              href="/about"
              className="border-primary-500/25 text-primary-800 hover:border-primary-500 hover:bg-primary-500/5 rounded-full border px-8 py-3.5 text-sm font-semibold tracking-[0.12em] uppercase transition-colors"
            >
              Our Approach
            </Link>
          </div>
        </div>

        {/* Warm photo with a soft organic curve — replaceable. */}
        <div
          data-replaceable="brand-photo"
          className="relative aspect-[5/4] w-full overflow-hidden rounded-[46%_54%_44%_56%/56%_46%_54%_44%] sm:aspect-4/5 md:aspect-[4/4.4]"
        >
          <Image
            src="/images/owner.png"
            alt="Sappho coffee, made around relationships"
            fill
            priority
            className="object-cover"
          />
        </div>
      </div>

      {/* soft peach blob accent, restrained */}
      <span
        aria-hidden
        className="bg-surface-500/60 pointer-events-none absolute -top-16 -right-24 -z-0 hidden size-72 rounded-full blur-3xl md:block"
      />
    </section>
  );
}

export function HomeFeatured({ coffees }: { coffees: Coffee[] }) {
  return (
    <section className="bg-surface-50 px-6 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <Eyebrow className="text-accent-700">Featured Coffees</Eyebrow>
            <h2 className="font-primary text-primary-800 mt-3 text-3xl md:text-4xl">
              This season&apos;s pours.
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-primary-800 hidden text-sm font-semibold tracking-[0.16em] uppercase underline-offset-4 hover:underline md:block"
          >
            View all coffees &rarr;
          </Link>
        </div>

        {/* horizontal scroll on mobile, grid on desktop */}
        <div className="-mx-6 flex snap-x gap-4 overflow-x-auto px-6 pb-4 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0">
          {coffees.slice(0, 3).map((c) => (
            <FeaturedCard key={c.id} coffee={c} />
          ))}
        </div>

        <div className="mt-8 md:hidden">
          <Link
            href="/shop"
            className="border-primary-500/25 text-primary-800 block w-full rounded-full border py-3.5 text-center text-sm font-semibold tracking-[0.14em] uppercase"
          >
            View all coffees
          </Link>
        </div>
      </div>
    </section>
  );
}

function FeaturedCard({ coffee }: { coffee: Coffee }) {
  const palette = COFFEE_PALETTES[coffee.color];
  const { added, add } = useQuickAdd(coffee.id);
  const notes = tastingNotes(coffee);

  return (
    <article
      className={twMerge(
        "group flex w-[78vw] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border-2 transition-shadow hover:shadow-xl sm:w-[60vw] md:w-auto",
        palette.surface,
        palette.borderStrong,
      )}
    >
      <Link
        href={`/shop/${coffee.id}`}
        aria-label={`View ${coffee.name ?? "coffee"}`}
        className={twMerge(
          "block bg-gradient-to-b p-4 text-center transition-opacity hover:opacity-95",
          palette.panel,
          palette.gradientFrom,
          palette.gradientTo,
          palette.panelText,
        )}
      >
        <p className="text-center text-[10px] font-semibold tracking-[0.25em] uppercase opacity-80">
          {coffee.processing}
        </p>

        <Divider className="my-3 opacity-80">
          {coffee.score ?
            <span
              className={twMerge(
                "flex size-11 shrink-0 rotate-45 items-center justify-center rounded-[3px] opacity-100",
                palette.accentBg,
                palette.accentText,
              )}
            >
              <span className="flex -rotate-45 flex-col items-center justify-center leading-none">
                <span className="text-sm font-bold">{coffee.score}</span>
                <span className="text-[8px] tracking-widest">pts</span>
              </span>
            </span>
          : undefined}
        </Divider>

        <h3
          className={twMerge(
            "text-4xl leading-none tracking-wide uppercase",
            BrandingStylizedFont.className,
          )}
        >
          {originName(coffee)}
        </h3>
        <p className="mt-1.5 text-xs tracking-[0.2em] uppercase opacity-90">
          {coffee.farm}
        </p>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-wrap justify-center gap-1.5">
          {notes.map((n) => (
            <span
              key={n}
              className={twMerge(
                "rounded-full px-3 py-0.5 text-xs font-medium",
                palette.chipBg,
                palette.chipText,
              )}
            >
              {n}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <span
            className={twMerge(
              "font-primary text-xl font-semibold",
              palette.textStrong,
            )}
          >
            ${coffee.price}
          </span>
          <div className="flex items-center gap-2">
            <Link
              href={`/shop/${coffee.id}`}
              className={twMerge(
                "rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.1em] uppercase transition-opacity hover:opacity-80",
                palette.border,
                palette.textStrong,
              )}
            >
              View
            </Link>
            <button
              onClick={add}
              disabled={added}
              className={twMerge(
                "rounded-full px-4 py-2 text-xs font-semibold tracking-[0.1em] uppercase transition-colors",
                added ?
                  "bg-success-500 text-surface-50"
                : "bg-primary-500 text-on-primary-500 hover:bg-primary-500/85",
              )}
            >
              {added ? "Added ✓" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function Divider({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={twMerge("flex items-center gap-3", className)}>
      <span className="h-px flex-1 bg-current opacity-40" />
      {children ?? <span className="size-1.5 rotate-45 bg-current" />}
      <span className="h-px flex-1 bg-current opacity-40" />
    </div>
  );
}
