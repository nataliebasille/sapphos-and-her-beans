/**
 * `/locations` — Sappho sells in person at exactly one spot right now
 * (Forest City Vault). A storefront banner (placeholder until the real photo
 * lands) sits up top, then the name, intro, highlights, directions, and an
 * hours card. Data lives in ./data.
 */
import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { directionsUrl, FOREST_CITY_VAULT } from "./data";

export const metadata = {
  title: "Visit Us",
  description:
    "Find Sappho's whole beans in person at Forest City Vault in Cleveland, OH.",
};

export default function LocationsPage() {
  const s = FOREST_CITY_VAULT;

  return (
    <div className="bg-surface-50 -mt-[calc(89px+1.5rem)] pt-[calc(89px+1.5rem)]">
      {/* Storefront banner */}
      <section className="mx-auto max-w-6xl px-6 pt-6 md:px-12 md:pt-10">
        <Storefront className="aspect-video w-full md:aspect-21/9" />
      </section>

      {/* Name + details */}
      <section className="mx-auto max-w-6xl px-6 py-12 md:px-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:gap-16">
          <div>
            <Eyebrow className="text-accent-700">Visit Us</Eyebrow>
            <h1 className="font-primary text-primary-800 mt-3 text-4xl leading-[1.05] md:text-6xl">
              {s.name}
            </h1>
            <p className="text-primary-800/55 mt-3 inline-flex items-center gap-2 text-sm font-semibold tracking-[0.16em] uppercase">
              <PinIcon className="size-4" /> {s.city}
            </p>
            <p className="text-primary-800/75 mt-6 max-w-md text-[15px] leading-relaxed md:text-lg">
              {s.blurb}
            </p>
            <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
              {s.highlights.map((h) => (
                <li
                  key={h}
                  className="text-primary-800/75 flex items-start gap-2 text-sm"
                >
                  <span className="bg-accent-500 mt-1.5 size-1.5 shrink-0 rounded-full" />
                  {h}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-nowrap items-center gap-3">
              <a
                href={directionsUrl(s)}
                target="_blank"
                rel="noreferrer"
                className="bg-primary-500 text-on-primary-500 hover:bg-primary-700 inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold tracking-[0.14em] whitespace-nowrap uppercase transition-transform hover:-translate-y-0.5"
              >
                <PinIcon className="size-4" /> Get directions
              </a>
              <Link
                href="/shop"
                className="border-primary-500/25 text-primary-800 hover:bg-primary-500/5 rounded-full border px-7 py-3 text-sm font-semibold tracking-[0.14em] whitespace-nowrap uppercase transition-colors"
              >
                Shop online
              </Link>
            </div>
          </div>

          <div className="border-primary-500/10 bg-surface-500/40 h-max rounded-2xl border p-7 md:p-8">
            <span className="text-primary-800 flex items-center gap-2">
              <ClockIcon className="size-5" />
              <span className="font-primary text-lg">Hours</span>
            </span>
            <dl className="text-primary-800/80 mt-5 space-y-2 text-sm">
              {s.hours.map((h) => (
                <div
                  key={h.day}
                  className="border-primary-500/10 flex justify-between gap-4 border-b pb-2 last:border-0 last:pb-0"
                >
                  <dt className="text-primary-800/55 whitespace-nowrap">
                    {h.day}
                  </dt>
                  <dd className="tabular-nums whitespace-nowrap">{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * Storefront photo — the Forest City Vault interior where Sappho's beans are
 * sold in person.
 */
function Storefront({
  className,
  rounded = "rounded-[2rem]",
}: {
  className?: string;
  rounded?: string;
}) {
  return (
    <div
      className={twMerge(
        "bg-primary-500 relative overflow-hidden",
        rounded,
        className,
      )}
    >
      <Image
        src="/images/forest city vault.jpg"
        alt="Inside Forest City Vault in Cleveland, OH"
        fill
        priority
        className="object-cover object-top"
      />
    </div>
  );
}

function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={
        "text-[0.72rem] font-semibold tracking-[0.28em] uppercase " +
        (className ?? "")
      }
    >
      {children}
    </span>
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

function ClockIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}
