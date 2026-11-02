"use client";

import { useLayoutEffect, useRef } from "react";

/**
 * Detail rows with dotted leaders. A wrapped, right-aligned value's box is as wide
 * as the space it could use, not its widest line, so after layout each value is
 * shrunk to its widest line. That way the dots stop where the value's leftmost
 * line begins.
 */
export function DetailRows({
  rows,
}: {
  rows: [label: string, value: string][];
}) {
  const ref = useRef<HTMLDListElement>(null);

  useLayoutEffect(() => {
    const dl = ref.current;
    if (!dl) return;

    const fit = () => {
      for (const dd of dl.querySelectorAll("dd")) {
        dd.style.width = "";
        const text = dd.firstElementChild;
        if (!text) continue;
        const widest = Math.max(
          ...[...text.getClientRects()].map((r) => r.width),
        );
        dd.style.width = `${Math.ceil(widest) + 1}px`;
      }
    };

    fit();
    // Widths change once the label font finishes loading.
    document.fonts.ready.then(fit);
  }, []);

  return (
    <dl ref={ref} className="flex flex-col gap-1 text-[10px] leading-tight">
      {rows.map(([label, value]) => (
        <div key={label} className="flex items-baseline gap-1">
          <dt className="shrink-0 uppercase">{label}</dt>
          <span className="min-w-3 flex-1 border-b border-dotted border-current" />
          <dd className="min-w-0 text-right font-bold">
            <span>{value}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
