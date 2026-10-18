"use client";

/**
 * Temporary storefront notice while the roastery is closed for vacation.
 * Site-wide it's a minimizable sticky note; on the checkout page the note is
 * swapped for an inline banner next to the payment form. Both disappear on
 * their own once `RETURN_DATE` arrives (in the shopper's local time).
 */
import { usePathname } from "next/navigation";
import { useCallback, useState, useSyncExternalStore } from "react";
import { twMerge } from "tailwind-merge";

const RETURN_DATE = new Date(2026, 10, 6);
const RETURN_LABEL_SHORT = "Nov 6";
const RETURN_LABEL_LONG = "Friday, November 6";
const CHECKOUT_PATH = "/checkout/cart";
const COFFEE_DETAIL_PATH = /^\/shop\/[^/]+$/;
const NOTE_STATE_KEY = "sappho:vacation-note:2026-11-06";

// Storage can be unavailable (SSR, privacy modes); fall back to expanded on
// read and silently skip writes.
function readNoteMinimized() {
  try {
    return window.localStorage.getItem(NOTE_STATE_KEY) === "minimized";
  } catch {
    return false;
  }
}

function writeNoteMinimized(minimized: boolean) {
  try {
    window.localStorage.setItem(
      NOTE_STATE_KEY,
      minimized ? "minimized" : "expanded",
    );
  } catch {}
}

const noopSubscribe = () => () => {};

// Server snapshot is `false` so static HTML never bakes the notice in; the
// client decides after hydration based on the current date.
function useIsOnVacation() {
  return useSyncExternalStore(
    noopSubscribe,
    () => Date.now() < RETURN_DATE.getTime(),
    () => false,
  );
}

export function VacationStickyNote() {
  const pathname = usePathname();
  const isOnVacation = useIsOnVacation();
  // Starts expanded and only changes when the shopper toggles it; the choice
  // is remembered across navigations, reloads, and return visits.
  const [minimized, setMinimizedState] = useState(readNoteMinimized);
  const setMinimized = useCallback((value: boolean) => {
    setMinimizedState(value);
    writeNoteMinimized(value);
  }, []);

  if (!isOnVacation || pathname === CHECKOUT_PATH) return null;

  // Coffee detail pages pin a buy bar (up to ~134px tall) to the bottom of
  // the screen on mobile; keep the note above it so it never covers the CTA.
  const position = twMerge(
    "fixed bottom-6 left-4 z-[60] md:left-6",
    COFFEE_DETAIL_PATH.test(pathname) && "max-md:bottom-[152px]",
  );

  if (minimized) {
    return (
      <button
        type="button"
        onClick={() => setMinimized(false)}
        className={twMerge(
          position,
          "bg-surface-500 text-primary-800 -rotate-2 rounded-sm px-3 py-2 text-xs font-semibold tracking-[0.12em] uppercase shadow-[0_8px_24px_rgba(0,31,54,0.2)] transition-transform hover:rotate-0",
        )}
      >
        ☀ Away until {RETURN_LABEL_SHORT}
      </button>
    );
  }

  return (
    <aside
      aria-label="Vacation notice"
      className={twMerge(
        position,
        "bg-surface-500 text-primary-800 w-[260px] -rotate-2 rounded-sm px-5 pt-7 pb-5 shadow-[0_14px_40px_rgba(0,31,54,0.25)] md:w-[290px]",
      )}
    >
      <span
        aria-hidden
        className="bg-accent-500/60 absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rotate-3"
      />
      <button
        type="button"
        aria-label="Minimize vacation notice"
        onClick={() => setMinimized(true)}
        className="absolute right-3 top-2 text-lg leading-none opacity-50 hover:opacity-100"
      >
        –
      </button>
      <p className="font-tertiary text-lg leading-snug">Hi friend!</p>
      <p className="font-tertiary mt-2 text-[15px] leading-relaxed">
        We&apos;re off on vacation until <strong>{RETURN_LABEL_SHORT}</strong>.
        Orders are still welcome — we&apos;ll ship every one the moment
        we&apos;re home.
      </p>
      <p className="font-tertiary mt-3 text-right text-[15px]">
        — Sappho &amp; her beans ♡
      </p>
    </aside>
  );
}

export function CheckoutVacationNotice() {
  const isOnVacation = useIsOnVacation();

  if (!isOnVacation) return null;

  return (
    <div className="border-accent-500 bg-surface-500/50 text-primary-800 mx-auto mb-6 flex max-w-xl items-center gap-4 rounded-2xl border px-5 py-4 text-left">
      <span
        aria-hidden
        className="bg-primary-500 text-on-primary-500 flex size-12 shrink-0 flex-col items-center justify-center rounded-xl leading-none"
      >
        <span className="text-[0.55rem] font-semibold tracking-[0.15em] uppercase">
          Nov
        </span>
        <span className="font-primary text-xl font-bold">
          {RETURN_DATE.getDate()}
        </span>
      </span>
      <p className="text-sm leading-relaxed">
        <strong className="font-semibold">
          Heads up — we&apos;re on vacation.
        </strong>{" "}
        Orders placed now will be shipped starting{" "}
        {RETURN_LABEL_LONG}.
      </p>
    </div>
  );
}
