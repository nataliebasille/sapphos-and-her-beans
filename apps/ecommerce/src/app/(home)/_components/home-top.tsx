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
import {
  type Coffee,
  Eyebrow,
  accentClassFor,
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
  const accentClass = accentClassFor(coffee.color);
  const { added, add } = useQuickAdd(coffee.id);
  const notes = tastingNotes(coffee);

  return (
    <article className="border-primary-500/10 hover:shadow-primary-500/5 group bg-surface-50 flex w-[78vw] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border transition-shadow hover:shadow-xl sm:w-[60vw] md:w-auto">
      {/* label treatment — no product photos exist, so accent + origin */}
      <div
        className={twMerge(
          "relative flex aspect-[4/3] flex-col justify-between p-5",
          accentClass,
        )}
      >
        <div className="flex items-center justify-between">
          <span className="text-primary-800 bg-surface-50/25 rounded-full px-3 py-1 text-[0.65rem] font-semibold tracking-[0.18em] uppercase">
            {coffee.size}
          </span>
          {coffee.score ?
            <span className="font-primary text-primary-800/80 text-sm font-semibold">
              {coffee.score} pts
            </span>
          : null}
        </div>
        <div>
          <p className="text-primary-800/60 text-[0.7rem] font-semibold tracking-[0.2em] uppercase">
            {coffee.processing}
          </p>
          <h3 className="font-primary text-primary-800 mt-1 text-2xl leading-tight font-semibold">
            {originName(coffee)}
          </h3>
          <p className="text-primary-800/70 text-sm">{coffee.farm}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap gap-1.5">
          {notes.map((n) => (
            <span
              key={n}
              className="text-primary-800/80 bg-surface-500/60 rounded-full px-2.5 py-1 text-xs"
            >
              {n}
            </span>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <span className="font-primary text-primary-800 text-xl font-semibold">
            ${coffee.price}
          </span>
          <div className="flex items-center gap-2">
            <Link
              href="/shop"
              className="border-primary-500/20 text-primary-800 hover:border-primary-500 rounded-full border px-4 py-2 text-xs font-semibold tracking-[0.1em] uppercase"
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
