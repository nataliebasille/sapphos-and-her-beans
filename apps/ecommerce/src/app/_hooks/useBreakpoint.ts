import { useLayoutEffect, useState } from "react";

/**
 * Tailwind v4 default breakpoints. Tailwind v4 is CSS-first (no JS config to
 * resolve), so the screen sizes are kept here for the media-query hook.
 */
const BREAKPOINTS = {
  sm: "40rem",
  md: "48rem",
  lg: "64rem",
  xl: "80rem",
  "2xl": "96rem",
} as const;

type Breakpoint = keyof typeof BREAKPOINTS;

export const useBreakpoint = (breakpoint: Breakpoint) => {
  const [isInBreakpoint, setIsInBreakpoint] = useState(
    getMediaQueryForBreakpoint(breakpoint)?.matches ?? false,
  );

  useLayoutEffect(() => {
    const mediaQuery = getMediaQueryForBreakpoint(breakpoint);

    const listener = (event: MediaQueryListEvent) => {
      setIsInBreakpoint(event.matches);
    };

    if (mediaQuery) {
      setIsInBreakpoint(mediaQuery.matches);

      mediaQuery.addEventListener("change", listener);
    }

    return () => {
      mediaQuery?.removeEventListener("change", listener);
    };
  }, [breakpoint]);

  return isInBreakpoint;
};

function getMediaQueryForBreakpoint(breakpoint: Breakpoint) {
  if (typeof window === "undefined") return undefined;

  const mediaQuery = window.matchMedia(
    `(min-width: ${BREAKPOINTS[breakpoint]})`,
  );

  return mediaQuery;
}
