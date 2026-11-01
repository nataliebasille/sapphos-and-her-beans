"use client";

import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { type CoffeePalette } from "./coffee-palette";

export function CoffeeCardGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={twMerge("grid gap-x-5 gap-y-0", className)}>{children}</div>
  );
}

export function CoffeeCardShell({
  palette,
  children,
  className,
}: {
  palette: CoffeePalette;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        palette.palette,
        "bg-50 border-950 overflow-hidden rounded-2xl border-2",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CoffeeCardHeader({
  palette,
  children,
  className,
}: {
  palette: CoffeePalette;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={twMerge(
        "bg-linear-to-b bg-900 from-900 to-700 text-50 p-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CoffeeCardBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={twMerge("p-4", className)}>{children}</div>;
}

export function CoffeeCardDivider({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={twMerge(
        "divider flex items-center",
        children && "gap-3",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CoffeeCardViewBar({
  href,
  ariaLabel,
  className,
}: {
  href: string;
  ariaLabel: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={twMerge(
        "border-950 bg-200 text-950 row-span-1 flex items-center justify-center gap-2 border-t-2 px-4 py-3 text-xs font-extrabold uppercase tracking-[0.18em] transition-[filter] hover:brightness-105",
        className,
      )}
    >
      View coffee
      <span aria-hidden="true">→</span>
    </Link>
  );
}

export function CoffeeTastingNotes({
  notes,
  palette,
  className,
}: {
  notes: string[];
  palette: CoffeePalette;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        "flex flex-wrap content-start justify-center gap-1.5 self-center",
        className,
      )}
    >
      {notes.map((note) => (
        <span
          key={note}
          className={twMerge(
            "rounded-full px-3 py-0.5 text-xs font-medium",
            palette.chipBg,
            palette.chipText,
          )}
        >
          {note}
        </span>
      ))}
    </div>
  );
}

export function CoffeeTraceability({
  traceable,
  palette,
}: {
  traceable: string;
  palette: CoffeePalette;
}) {
  return (
    <p
      className={twMerge(
        "text-center font-serif text-xs font-bold italic tracking-wider",
        palette.textMuted,
      )}
    >
      Traceable to <b className="font-extrabold">{traceable}</b>
    </p>
  );
}

export function CoffeeCardFooterRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <footer
      className={twMerge("flex items-end justify-center gap-4", className)}
    >
      {children}
    </footer>
  );
}

export function CoffeeScoreDiamond({
  score,
  className,
}: {
  score?: number;
  className?: string;
}) {
  return (
    <span
      className={twMerge(
        "place-content-center-safe flex",
        score ?
          "size-[calc(var(--spacing)*8*sqrt(2))]"
        : "size-[calc(var(--spacing)*2*sqrt(2))]",
      )}
    >
      <span
        className={twMerge(
          "flex shrink-0 origin-center rotate-45 items-center justify-center rounded-[3px] opacity-100",
          score ? "size-8" : "size-2",
          className,
        )}
      >
        {score && (
          <span className="flex -rotate-45 flex-col items-center justify-center leading-none">
            <span className="text-[.625em] font-bold">{score}</span>
            <span className="text-[.375em] tracking-widest">pts</span>
          </span>
        )}
      </span>
    </span>
  );
}
