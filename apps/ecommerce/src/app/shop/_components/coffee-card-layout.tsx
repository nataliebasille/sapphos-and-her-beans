"use client";

import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { BrandingStylizedFont } from "~/app/fonts";
import { type CoffeePalette } from "./coffee-palette";

const CARD_ROWS = "auto-rows-[auto_auto_auto_auto_auto_auto_auto]";

export function CoffeeCardGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={twMerge("grid gap-x-5 gap-y-8", CARD_ROWS, className)}>
      {children}
    </div>
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
    <article
      className={twMerge(
        "row-span-7 grid h-full grid-rows-subgrid gap-y-0 overflow-hidden rounded-2xl border-2",
        palette.surface,
        palette.borderStrong,
        className,
      )}
    >
      {children}
    </article>
  );
}

export function CoffeeCardPanel({
  href,
  ariaLabel,
  palette,
  children,
  className,
}: {
  href: string;
  ariaLabel: string;
  palette: CoffeePalette;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={twMerge(
        "row-span-4 grid grid-rows-subgrid gap-y-3 bg-linear-to-b p-4 text-center transition-opacity hover:opacity-95",
        palette.panel,
        palette.gradientFrom,
        palette.gradientTo,
        palette.panelText,
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function CoffeeCardBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        "row-span-3 grid grid-rows-subgrid gap-y-3 p-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CoffeeCardDivider({
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

export function CoffeeCardPassport({
  href,
  ariaLabel,
  palette,
  processing,
  score,
  origin,
  label,
}: {
  href: string;
  ariaLabel: string;
  palette: CoffeePalette;
  processing?: string;
  score?: number;
  origin: string;
  label: string;
}) {
  return (
    <CoffeeCardPanel href={href} ariaLabel={ariaLabel} palette={palette}>
      <p className="m-0! mt-3! text-center text-xs font-semibold tracking-[0.25em] uppercase opacity-80">
        {processing}
      </p>

      <CoffeeCardDivider className="my-3 opacity-80">
        {score ?
          <CoffeeScoreDiamond score={score} palette={palette} />
        : undefined}
      </CoffeeCardDivider>

      <h3
        className={twMerge(
          "m-0! text-4xl leading-none tracking-wide uppercase",
          BrandingStylizedFont.className,
        )}
      >
        {origin}
      </h3>
      <p className="m-0! text-xs tracking-[0.2em] uppercase opacity-90">
        {label}
      </p>
    </CoffeeCardPanel>
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
        "flex flex-wrap content-start justify-center gap-1.5",
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
        "text-center font-serif text-xs font-bold tracking-wider italic",
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
  palette,
}: {
  score: number;
  palette: CoffeePalette;
}) {
  return (
    <span
      className={twMerge(
        "flex size-11 shrink-0 rotate-45 items-center justify-center rounded-[3px] opacity-100",
        palette.accentBg,
        palette.accentText,
      )}
    >
      <span className="flex -rotate-45 flex-col items-center justify-center leading-none">
        <span className="text-sm font-bold">{score}</span>
        <span className="text-[8px] tracking-widest">pts</span>
      </span>
    </span>
  );
}
