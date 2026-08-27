"use client";

/**
 * Homepage sections — the lower funnel of the redesigned homepage:
 * Why Sappho · Relational Coffee · Find Us Locally · Newsletter + Footer.
 *
 * Images tagged `data-replaceable` are placeholders using existing Sappho
 * photography — swap in final art when available.
 */
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { type products } from "@models";
import { useAddToCart } from "~/app/_stores/cart";
import { FacebookIcon } from "~/app/_components/icons/facebook";
import { InstagramIcon } from "~/app/_components/icons/instagram";
import { accentClassFor } from "./brand";

export type Coffee = products.Product;

/* ------------------------------------------------------------------ *
 * Quick add — reuses the real cart store.
 * ------------------------------------------------------------------ */
export function useQuickAdd(id: string) {
  const addToCart = useAddToCart();
  const [added, setAdded] = useState(false);

  const add = useCallback(() => {
    addToCart(id, { quantity: 1 });
    setAdded(true);
  }, [addToCart, id]);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1800);
    return () => clearTimeout(t);
  }, [added]);

  return { added, add };
}

/* ------------------------------------------------------------------ *
 * Tasting-notes helper — the real data is a comma list.
 * ------------------------------------------------------------------ */
export function tastingNotes(coffee: Coffee, max = 3): string[] {
  return (coffee.tastingNotes ?? "")
    .split(",")
    .map((n) => n.trim())
    .filter(Boolean)
    .slice(0, max);
}

export function originName(coffee: Coffee): string {
  return coffee.country ?? coffee.name?.split(" - ")[0] ?? "Coffee";
}

/* ------------------------------------------------------------------ *
 * Section eyebrow — small tracked label used across sections.
 * ------------------------------------------------------------------ */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={twMerge(
        "text-[0.72rem] font-semibold tracking-[0.28em] uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * Why Sappho — three concise value props.
 * ------------------------------------------------------------------ */
const VALUES = [
  {
    key: "direct-trade",
    title: "Direct Trade",
    body: "We build real relationships with producers and care about how every coffee is sourced.",
    Icon: HandshakeIcon,
  },
  {
    key: "inclusive",
    title: "Inclusive Community",
    body: "LGBTQ+ owned and intentionally rooted in connection, belonging, and acceptance.",
    Icon: CommunityIcon,
  },
  {
    key: "flavor",
    title: "Exceptional Flavor",
    body: "Sourcing, processing, and roasting all in service of a cup that is genuinely extraordinary.",
    Icon: CupIcon,
  },
] as const;

export function WhySappho() {
  return (
    <section className="bg-surface-50 px-6 py-20 md:px-12 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-2xl">
          <Eyebrow className="text-accent-700">Why Sappho</Eyebrow>
          <h2 className="font-primary text-primary-800 mt-4 text-3xl leading-tight md:text-4xl">
            Coffee worth choosing on purpose.
          </h2>
        </div>
        <div className="border-primary-500/10 bg-primary-500/10 grid gap-px overflow-hidden rounded-2xl border md:grid-cols-3">
          {VALUES.map(({ key, title, body, Icon }) => (
            <div key={key} className="bg-surface-50 p-8 md:p-10">
              <span className="bg-surface-500 text-primary-800 flex size-12 items-center justify-center rounded-full">
                <Icon className="size-6" />
              </span>
              <h3 className="font-primary text-primary-800 mt-6 text-xl">
                {title}
              </h3>
              <p className="text-primary-800/70 mt-3 text-[15px] leading-relaxed">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Relational Coffee — editorial story band.
 * ------------------------------------------------------------------ */
export function RelationalStory() {
  return (
    <section className="text-on-primary-500 bg-primary-500 relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-2 md:px-12 md:py-28">
        <div
          data-replaceable="brand-photo"
          className="relative order-last aspect-4/5 overflow-hidden rounded-[2rem] md:order-first"
        >
          <Image
            src="/images/our story.jpg"
            alt="Sappho — the relationships behind the coffee"
            fill
            className="object-cover"
          />
          <span className="from-primary-500/40 absolute inset-0 bg-gradient-to-t to-transparent" />
        </div>
        <div>
          <Eyebrow className="text-accent-500">Relational Coffee</Eyebrow>
          <h2 className="font-primary mt-4 text-3xl leading-tight md:text-[2.6rem]">
            Coffee is never just a commodity.
          </h2>
          <p className="text-on-primary-500/75 mt-6 max-w-md text-[15px] leading-relaxed md:text-base">
            For us, a great cup connects people and places — the producers who
            grow it, the harvest that shaped it, and the community that gathers
            around it. We choose lots we can trace to the people behind them.
          </p>
          <Link
            href="/about"
            className="border-accent-500 text-on-primary-500 hover:text-accent-500 mt-8 inline-flex items-center gap-2 border-b pb-1 text-sm font-semibold tracking-[0.16em] uppercase transition-colors"
          >
            Learn our story
            <span aria-hidden>&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ *
 * Find Us Locally — single stockist (Forest City Vault).
 *
 * Forest City Vault is currently the only place the coffee is sold in person.
 * The storefront photo and website link are placeholders pending real details;
 * `mapsQuery` searches by name so no address is invented.
 * ------------------------------------------------------------------ */
const FOREST_CITY_VAULT = {
  name: "Forest City Vault",
  city: "Cleveland, OH", // TODO: confirm city
  mapsQuery: "Forest City Vault",
  website: undefined as string | undefined, // TODO: add real link
};

export function FindUsLocally() {
  const s = FOREST_CITY_VAULT;
  const directions = `https://maps.google.com/?q=${encodeURIComponent(s.mapsQuery)}`;

  return (
    <section className="bg-surface-500/40 px-6 py-20 md:px-12 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <Eyebrow className="text-accent-700">Find Us Locally</Eyebrow>
          <h2 className="font-primary text-primary-800 mt-3 max-w-xl text-3xl md:text-4xl">
            Now pouring at Forest City Vault.
          </h2>
        </div>

        <div className="grid items-stretch gap-6 md:grid-cols-2 md:gap-10">
          {/* Storefront photo — replaceable placeholder. */}
          <div
            data-replaceable="storefront-photo"
            className="bg-primary-500 relative flex min-h-[220px] flex-col items-center justify-center overflow-hidden rounded-2xl p-8 text-center md:min-h-[320px]"
          >
            <span className="text-accent-500 bg-surface-50/10 flex size-12 items-center justify-center rounded-full">
              <PinIcon className="size-6" />
            </span>
            <p className="text-on-primary-500/60 mt-4 text-xs tracking-[0.22em] uppercase">
              Storefront photo
            </p>
            <p className="text-on-primary-500/45 text-[13px]">
              Placeholder — add final image
            </p>
          </div>

          {/* Details */}
          <div className="border-primary-500/10 bg-surface-50 flex flex-col justify-center rounded-2xl border p-8 md:p-10">
            <h3 className="font-primary text-primary-800 text-2xl font-semibold md:text-3xl">
              {s.name}
            </h3>
            <p className="text-primary-800/55 mt-1 text-sm tracking-wide uppercase">
              {s.city}
            </p>
            <p className="text-primary-800/70 mt-5 max-w-md text-[15px] leading-relaxed">
              Forest City Vault is the only place to pick up our coffee in
              person right now — stop in, say hi, and grab a bag fresh.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={directions}
                target="_blank"
                rel="noreferrer"
                className="text-on-primary-500 bg-primary-500 rounded-full px-7 py-3 text-sm font-semibold tracking-[0.14em] uppercase transition-transform hover:-translate-y-0.5"
              >
                Get directions
              </a>
              <Link
                href="/locations"
                className="border-primary-500/25 text-primary-800 hover:bg-primary-500/5 rounded-full border px-7 py-3 text-sm font-semibold tracking-[0.14em] uppercase transition-colors"
              >
                Location details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * Newsletter + Footer — the page ending. Social links live here.
 * ------------------------------------------------------------------ */
export function NewsletterFooter() {
  return (
    <footer className="text-on-primary-500 bg-primary-500">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <div className="border-surface-50/10 grid gap-10 border-b py-16 md:grid-cols-2 md:items-center md:py-20">
          <div>
            <h2 className="font-primary text-3xl leading-tight md:text-4xl">
              Stay in the loop
            </h2>
            <p className="text-on-primary-500/70 mt-4 max-w-md text-[15px] leading-relaxed">
              New coffees, limited releases, pop-ups, and community events —
              straight to your inbox, never too often.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <span className="text-on-primary-500/70 text-xs font-medium tracking-[0.14em] uppercase">
                Follow Sappho
              </span>
              <a
                href="https://www.facebook.com/p/Sappho-and-her-beans-100094171081242/"
                target="_blank"
                rel="noreferrer"
                aria-label="Sappho on Facebook"
                className="bg-surface-50/10 text-on-primary-500 hover:bg-accent-500 hover:text-primary-800 inline-flex size-10 items-center justify-center rounded-full transition-colors"
              >
                <FacebookIcon className="size-5" />
              </a>
              <a
                href="https://www.instagram.com/sapphoandherbeans/"
                target="_blank"
                rel="noreferrer"
                aria-label="Sappho on Instagram"
                className="bg-surface-50/10 text-on-primary-500 hover:bg-accent-500 hover:text-primary-800 inline-flex size-10 items-center justify-center rounded-full transition-colors"
              >
                <InstagramIcon className="size-5" />
              </a>
            </div>
          </div>
          <form
            className="flex w-full max-w-md flex-col gap-3 sm:flex-row md:ml-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder="you@example.com"
              aria-label="Email address"
              className="border-surface-50/20 bg-surface-50/5 text-on-primary-500 placeholder:text-on-primary-500/40 focus:border-accent-500 w-full rounded-full border px-5 py-3 text-[15px] focus:outline-none"
            />
            <button
              type="submit"
              className="bg-accent-700 text-primary-800 hover:bg-accent-500 rounded-full px-6 py-3 text-sm font-semibold tracking-[0.14em] uppercase transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>

        <div className="border-surface-50/10 border-t py-6 text-xs">
          <p className="text-on-primary-500/45">
            © {new Date().getFullYear()} Sappho &amp; Her Beans. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ *
 * Small line icons for the value props.
 * ------------------------------------------------------------------ */
function HandshakeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m11 17 2 2a1 1 0 1 0 3-3" />
      <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.9-3.9a2 2 0 0 0-2.8 0l-.4.4a2 2 0 0 1-2.8 0l-.4-.4a2 2 0 0 0-2.8 0L3 12" />
      <path d="M15 6.5 13 8" />
      <path d="m18 15 3-3" />
      <path d="M3 12 6 9l3 1" />
    </svg>
  );
}

function CommunityIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 21s-6.5-4.35-9-8.5C1.4 9.9 2.6 6.5 5.8 6.1 7.7 5.9 9.3 6.9 10 8.3l2 4 2-4c.7-1.4 2.3-2.4 4.2-2.2 3.2.4 4.4 3.8 2.8 6.4C18.5 16.65 12 21 12 21Z" />
    </svg>
  );
}

function CupIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
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

export { accentClassFor };
