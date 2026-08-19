"use client";

/**
 * Homepage top — the hero experience.
 *
 * Hero (mobile):  full-screen photo behind a frosted-glass card, with a scroll
 *                 cue; the featured section crests just below the fold.
 * Hero (desktop): asymmetric split — copy left, warm photo with a soft organic curve.
 * Featured:       editorial coffee cards, horizontal-scroll on mobile.
 */
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { CoffeeCard } from "~/app/shop/_components/coffee-card";
import { CoffeeCardGrid } from "~/app/shop/_components/coffee-card-layout";
import { groupByOrigin } from "~/app/shop/_components/catalog-data";
import { type Coffee, Eyebrow } from "./sections";

/** Gently bouncing chevron — a "scroll for more" cue under the mobile hero card. */
function ScrollIndicator() {
  return (
    <span aria-hidden className="text-surface-50/70 animate-bounce">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="size-6"
      >
        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function HomeHero() {
  return (
    <>
      {/* Mobile: full-screen framed hero — photo behind a frosted-glass card. */}
      <section className="relative h-[100svh] min-h-[600px] w-full overflow-hidden md:hidden">
        <Image
          src="/images/owner.png"
          alt="Sappho coffee, made around relationships"
          fill
          priority
          className="object-cover object-[center_45%]"
        />
        <div className="from-primary-800/90 via-primary-800/45 absolute inset-0 bg-gradient-to-t to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 p-5 pb-4">
          <div className="border-surface-50/15 bg-surface-50/10 w-full rounded-3xl border p-6 backdrop-blur-md">
            <Eyebrow className="text-surface-50/85">
              LGBTQ+ Owned Specialty Coffee
            </Eyebrow>
            {/* Inline font-size: the design system's global `h1` rule is unlayered
                and beats Tailwind text utilities, so size must be set inline. */}
            <h1
              style={{ fontSize: "clamp(1.9rem, 8.5vw, 2.6rem)" }}
              className="font-primary text-surface-50 mt-3 leading-[1.05] font-semibold tracking-tight"
            >
              Coffee built on relationships.
            </h1>
            <p className="text-surface-50/80 mt-3 text-sm leading-relaxed">
              Direct-trade specialty coffee from producers we know, with
              extraordinary lots selected for flavor and character.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/shop"
                className="text-on-primary-500 bg-primary-500 w-full rounded-full px-8 py-3.5 text-center text-sm font-semibold tracking-[0.12em] uppercase transition-transform hover:-translate-y-0.5"
              >
                Shop Coffee
              </Link>
              <Link
                href="/about"
                className="border-surface-50/45 text-surface-50 hover:bg-surface-50/10 w-full rounded-full border px-8 py-3.5 text-center text-sm font-semibold tracking-[0.12em] uppercase transition-colors"
              >
                Our Approach
              </Link>
            </div>
          </div>
          <ScrollIndicator />
        </div>
      </section>

      {/* Desktop: editorial split — copy left, warm photo with a soft organic curve. */}
      <section className="relative hidden overflow-hidden pt-28 md:block">
        <div className="mx-auto grid max-w-6xl grid-cols-[1fr_1.05fr] items-center gap-14 px-10 pt-14 pb-24">
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
            className="relative aspect-[4/4.4] w-full overflow-hidden rounded-[46%_54%_44%_56%/56%_46%_54%_44%]"
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
          className="bg-surface-500/60 pointer-events-none absolute -top-16 -right-24 -z-0 size-72 rounded-full blur-3xl"
        />
      </section>
    </>
  );
}

export function HomeFeatured({ coffees }: { coffees: Coffee[] }) {
  const groups = useMemo(() => groupByOrigin(coffees), [coffees]);

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
        <CoffeeCardGrid className="scrollbar-hide -mx-6 snap-x scroll-pl-6 auto-cols-[78vw] grid-flow-col overflow-x-auto px-6 pb-2 sm:auto-cols-[60vw] md:mx-0 md:auto-cols-auto md:grid-flow-row md:grid-cols-3 md:gap-x-6 md:overflow-visible md:px-0 md:pb-0">
          {groups.slice(0, 3).map((group) => (
            <CoffeeCard
              key={group.key}
              group={group}
              className="snap-start transition-shadow hover:shadow-xl"
            />
          ))}
        </CoffeeCardGrid>

        <div className="mt-8 flex justify-center md:hidden">
          <Link
            href="/shop"
            className="text-primary-800 text-sm font-semibold tracking-[0.16em] uppercase underline-offset-4 hover:underline"
          >
            View all coffees &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
