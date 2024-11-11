import { CSSProperties } from "react";
import { twMerge } from "tailwind-merge";

export function LoadingIndicator({
  className,
  size,
  width,
}: {
  className?: string;
  size?: number;
  width?: number;
}) {
  return (
    <div
      className={twMerge("radial-progress progress-sm animate-spin", className)}
      style={
        {
          "--progress": "25%",
          ...(size ? { "--size": `${size}px` } : {}),
          ...(width ? { "--bar-width": `${width}px` } : {}),
        } as CSSProperties
      }
    />
  );
}
