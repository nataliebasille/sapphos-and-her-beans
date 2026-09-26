"use client";

/**
 * PROTOTYPE — three radically different "page not found" (404) treatments for
 * the new UI. Switchable via `?variant=` on /prototype/not-found.
 *
 * A — Editorial split: oversized "404" typography left, organic-curve photo
 *     right, matching the homepage hero. Asymmetric, brand-forward.
 * B — Centered spotlight: a single frosted card floating over a soft blob
 *     field, with an inline shop search and a compact link row.
 * C — Coffee metaphor: illustration-led ("this cup came up empty") with a
 *     grid of popular destination cards as the primary affordance.
 */
import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "~/app/(home)/_components/sections";

/* ------------------------------------------------------------------ *
 * Variant A — Editorial split
 * ------------------------------------------------------------------ */
export function VariantA() {
  return (
    <section className="bg-surface-50 relative -mt-[calc(89px+1.5rem)] flex min-h-dvh w-full items-center overflow-hidden pt-[89px]">
      <span
        aria-hidden
        className="bg-surface-500/60 pointer-events-none absolute -top-24 -right-24 -z-0 size-72 rounded-full blur-3xl"
      />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-[1fr_1.05fr] md:gap-14 md:px-10 md:py-24">
        <div className="max-w-xl">
          <Eyebrow className="text-accent-700">Error 404</Eyebrow>
          <p
            className="font-primary text-primary-800/10 -ml-1 leading-none font-semibold tracking-tight"
            style={{ fontSize: "clamp(6rem, 22vw, 12rem)" }}
            aria-hidden
          >
            404
          </p>
          <h1 className="font-primary text-primary-800 -mt-4 text-[2.2rem] leading-[1.05] font-semibold tracking-tight md:text-[3.4rem]">
            This page brewed away.
          </h1>
          <p className="text-primary-800/70 mt-5 max-w-md text-base leading-relaxed md:text-lg">
            The page you were looking for isn&apos;t here — maybe it sold out,
            got retired, or the link wandered off. Let&apos;s get you back to the
            good stuff.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/shop"
              className="text-on-primary-500 bg-primary-500 rounded-full px-8 py-3.5 text-sm font-semibold tracking-[0.12em] uppercase transition-transform hover:-translate-y-0.5"
            >
              Shop Coffee
            </Link>
            <Link
              href="/"
              className="border-primary-500/25 text-primary-800 hover:border-primary-500 hover:bg-primary-500/5 rounded-full border px-8 py-3.5 text-sm font-semibold tracking-[0.12em] uppercase transition-colors"
            >
              Back Home
            </Link>
          </div>
        </div>

        <div
          data-replaceable="brand-photo"
          className="relative aspect-[4/4.4] w-full overflow-hidden rounded-[46%_54%_44%_56%/56%_46%_54%_44%]"
        >
          <Image
            src="/images/owner.png"
            alt="Sappho coffee"
            fill
            className="object-cover"
          />
          <div className="from-primary-800/25 absolute inset-0 bg-gradient-to-t to-transparent" />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Variant B — Centered spotlight card
 * ------------------------------------------------------------------ */
const QUICK_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "Our Story" },
  { href: "/locations", label: "Find Us" },
  { href: "/wholesale", label: "Wholesale" },
];

export function VariantB() {
  return (
    <section className="bg-surface-50 relative -mt-[calc(89px+1.5rem)] grid min-h-dvh w-full place-items-center overflow-hidden px-6 pt-[89px] pb-16">
      <span
        aria-hidden
        className="bg-surface-500/70 pointer-events-none absolute -top-10 -left-16 size-72 rounded-full blur-3xl"
      />
      <span
        aria-hidden
        className="bg-accent-500/30 pointer-events-none absolute -right-16 bottom-0 size-80 rounded-full blur-3xl"
      />

      <div className="border-primary-500/10 bg-surface-50/80 relative w-full max-w-lg rounded-3xl border p-8 text-center shadow-xl backdrop-blur-sm md:p-12">
        <span className="border-accent-700/30 text-accent-700 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[0.72rem] font-semibold tracking-[0.28em] uppercase">
          Error 404
        </span>
        <h1 className="font-primary text-primary-800 mt-6 text-3xl leading-tight font-semibold tracking-tight md:text-4xl">
          We couldn&apos;t find that.
        </h1>
        <p className="text-primary-800/70 mx-auto mt-4 max-w-sm text-[15px] leading-relaxed">
          The page may have moved or never existed. Try searching our coffee, or
          pick up where you left off below.
        </p>

        <form
          action="/shop"
          className="mx-auto mt-8 flex w-full max-w-sm items-center gap-2"
        >
          <input
            type="search"
            name="q"
            placeholder="Search our coffee…"
            aria-label="Search our coffee"
            className="border-primary-500/20 bg-surface-50 text-primary-800 placeholder:text-primary-800/40 focus:border-primary-500 w-full rounded-full border px-5 py-3 text-[15px] focus:outline-none"
          />
          <button
            type="submit"
            className="text-on-primary-500 bg-primary-500 shrink-0 rounded-full px-6 py-3 text-sm font-semibold tracking-[0.12em] uppercase transition-transform hover:-translate-y-0.5"
          >
            Go
          </button>
        </form>

        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          {QUICK_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-primary-800/70 hover:text-primary-800 font-medium underline-offset-4 hover:underline"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Variant C — Coffee metaphor + shop call-to-action
 * ------------------------------------------------------------------ */
function EmptyCupIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 10h13v4a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-4Z" />
      <path d="M17 11h1.5a2.5 2.5 0 0 1 0 5H17" />
      <path d="M8 3c-.5.8-.5 1.7 0 2.5M12 3c-.5.8-.5 1.7 0 2.5" />
    </svg>
  );
}

export function VariantC() {
  return (
    <section className="bg-surface-50 -mt-[calc(89px+1.5rem)] flex min-h-dvh w-full items-center justify-center pt-[89px]">
      <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-16 text-center md:py-24">
        <span className="border-primary-500/15 bg-surface-50 text-primary-800/80 relative grid size-24 place-items-center rounded-full border shadow-sm">
          <EmptyCupIcon className="size-11" />
          <span className="bg-accent-700 text-on-primary-500 absolute -top-1 -right-1 grid size-9 place-items-center rounded-full text-[0.7rem] font-bold tracking-wider">
            404
          </span>
        </span>
        <Eyebrow className="text-accent-700 mt-8">This cup came up empty</Eyebrow>
        <h1 className="font-primary text-primary-800 mt-3 text-3xl leading-tight font-semibold tracking-tight md:text-5xl">
          Nothing brewing at this address.
        </h1>
        <p className="text-primary-800/70 mt-4 max-w-md text-base leading-relaxed">
          That page has poured out — but there&apos;s always a fresh batch
          waiting. Let&apos;s get you back to the coffee.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/shop"
            className="text-on-primary-500 bg-primary-500 rounded-full px-8 py-3.5 text-sm font-semibold tracking-[0.12em] uppercase transition-transform hover:-translate-y-0.5"
          >
            Shop Coffee
          </Link>
          <Link
            href="/"
            className="border-primary-500/25 text-primary-800 hover:border-primary-500 hover:bg-primary-500/5 rounded-full border px-8 py-3.5 text-sm font-semibold tracking-[0.12em] uppercase transition-colors"
          >
            Back Home
          </Link>
        </div>
      </div>
    </section>
  );
}
