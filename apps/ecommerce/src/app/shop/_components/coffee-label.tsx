"use client";

/**
 * Shared shell bits for the shop catalog page.
 */

import { Eyebrow } from "~/app/(home)/_components/sections";

export { Eyebrow };

/**
 * Winter Frost page canvas. The shop routes are wrapped by the legacy pink
 * `PageContainer`; this cancels its generous top padding and reserves only
 * the fixed header height so the catalog begins close to the nav.
 */
export function FrostCanvas({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface-50 -mt-[calc(76px+1.5rem)] min-h-dvh pt-[76px]">
      {children}
    </div>
  );
}
