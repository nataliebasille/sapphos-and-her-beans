import resolveConfig from "tailwindcss/resolveConfig";
import { useLayoutEffect, useState } from "react";
import tailwindConfig from "~/../tailwind.config";

const fullConfig = resolveConfig(tailwindConfig);

export const useBreakpoint = (
  breakpoint: keyof (typeof fullConfig)["theme"]["screens"],
) => {
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

function getMediaQueryForBreakpoint(
  breakpoint: keyof (typeof fullConfig)["theme"]["screens"],
) {
  if (typeof window === "undefined") return undefined;

  const mediaQuery = window.matchMedia(
    `(min-width: ${fullConfig.theme.screens[breakpoint]})`,
  );

  return mediaQuery;
}
