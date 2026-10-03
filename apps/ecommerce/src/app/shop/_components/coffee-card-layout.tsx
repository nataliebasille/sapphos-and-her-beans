"use client";

import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { BrandingStylizedFont } from "~/app/fonts";
import { type CoffeePalette } from "./coffee-palette";

const CARD_ROWS = "auto-rows-[auto_auto_auto_auto_auto_auto_auto_auto]";

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
        "row-span-8 grid h-full grid-rows-subgrid gap-y-0 overflow-hidden rounded-2xl border-2",
        palette.surface,
        palette.borderStrong,
        className,
      )}
    >
      {children}
    </article>
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

const PROCESSING_TEXT_SIZES = [
  { maxLength: 16, className: "text-base tracking-[0.3em]" },
  { maxLength: 28, className: "text-sm tracking-[0.25em]" },
  { maxLength: 44, className: "text-xs tracking-[0.2em]" },
] as const;

const PROCESSING_TEXT_SIZE_FALLBACK = "text-[0.625rem] tracking-[0.15em]";

function getProcessingTextClasses(processing?: string) {
  const length = processing?.length ?? 0;
  return (
    PROCESSING_TEXT_SIZES.find(({ maxLength }) => length <= maxLength)
      ?.className ?? PROCESSING_TEXT_SIZE_FALLBACK
  );
}

export function CoffeeCardPassport({
  palette,
  processing,
  score,
  origin,
  label,
}: {
  palette: CoffeePalette;
  processing?: string;
  score?: number;
  origin: string;
  label: string;
}) {
  return (
    <div
      className={twMerge(
        "row-span-4 grid grid-rows-subgrid gap-y-3 bg-linear-to-b p-4 text-center",
        palette.panel,
        palette.gradientFrom,
        palette.gradientTo,
        palette.panelText,
      )}
    >
      <p
        className={twMerge(
          "m-0! self-center text-center font-semibold uppercase opacity-80",
          getProcessingTextClasses(processing),
        )}
      >
        {processing}
      </p>

      <CoffeeCardDivider className="my-3 opacity-80">
        {score ?
          <CoffeeScoreDiamond score={score} palette={palette} />
        : undefined}
      </CoffeeCardDivider>

      <h3
        className={twMerge(
          "m-0! text-xl! leading-none tracking-wide uppercase",
          BrandingStylizedFont.className,
        )}
      >
        {origin}
      </h3>
      <p className="m-0! self-center text-xs tracking-[0.2em] uppercase opacity-90">
        {label}
      </p>
    </div>
  );
}

export function CoffeeCardViewBar({
  href,
  ariaLabel,
  palette,
  className,
}: {
  href: string;
  ariaLabel: string;
  palette: CoffeePalette;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={twMerge(
        "row-span-1 flex items-center justify-center gap-2 border-t-2 px-4 py-3 text-xs font-extrabold tracking-[0.18em] uppercase transition-[filter] hover:brightness-105",
        palette.borderStrong,
        palette.accentBg,
        palette.accentText,
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
