"use client";

/**
 * PROTOTYPE-ONLY floating variant switcher.
 *
 * Renders a high-contrast pill at the bottom-centre of the screen that cycles
 * a `?variant=` search param. Shared by throwaway prototype routes. Never ships:
 * it self-hides in production builds.
 */
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";

type PrototypeSwitcherProps = {
  /** Ordered variant keys, e.g. ["A", "B", "C"]. */
  variants: string[];
  /** Currently active variant key. */
  current: string;
  /** Optional human labels keyed by variant, e.g. { A: "Editorial split" }. */
  labels?: Record<string, string>;
};

export function PrototypeSwitcher({
  variants,
  current,
  labels,
}: PrototypeSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const go = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("variant", key);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const step = useCallback(
    (delta: number) => {
      const i = variants.indexOf(current);
      const next = (i + delta + variants.length) % variants.length;
      go(variants[next]!);
    },
    [current, go, variants],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = document.activeElement;
      const typing =
        el instanceof HTMLElement &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          el.isContentEditable);
      if (typing) return;
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  if (process.env.NODE_ENV === "production") return null;

  const label = labels?.[current];

  return (
    <div className="fixed inset-x-0 bottom-5 z-[9999] flex justify-center px-4">
      <div className="flex items-center gap-1 rounded-full border border-white/10 bg-neutral-900/95 py-1.5 pr-1.5 pl-1 text-white shadow-2xl backdrop-blur">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous variant"
          className="grid size-8 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2.4}>
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="min-w-[9rem] px-2 text-center text-xs">
          <span className="font-mono font-semibold tracking-widest text-emerald-300">
            {current}
          </span>
          {label ? <span className="text-white/60"> — {label}</span> : null}
        </div>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next variant"
          className="grid size-8 place-items-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2.4}>
            <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
