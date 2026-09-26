import Link from "next/link";

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
      aria-hidden
    >
      <path d="M4 10h13v4a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-4Z" />
      <path d="M17 11h1.5a2.5 2.5 0 0 1 0 5H17" />
      <path d="M8 3c-.5.8-.5 1.7 0 2.5M12 3c-.5.8-.5 1.7 0 2.5" />
    </svg>
  );
}

export default function NotFound() {
  return (
    <section className="bg-surface-50 -mt-[calc(89px+1.5rem)] flex min-h-dvh w-full items-center justify-center pt-[89px]">
      <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-16 text-center md:py-24">
        <span className="border-primary-500/15 bg-surface-50 text-primary-800/80 relative grid size-24 place-items-center rounded-full border shadow-sm">
          <EmptyCupIcon className="size-11" />
          <span className="bg-accent-700 text-on-primary-500 absolute -top-1 -right-1 grid size-9 place-items-center rounded-full text-[0.7rem] font-bold tracking-wider">
            404
          </span>
        </span>
        <span className="text-accent-700 mt-8 text-[0.72rem] font-semibold tracking-[0.28em] uppercase">
          This cup came up empty
        </span>
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
