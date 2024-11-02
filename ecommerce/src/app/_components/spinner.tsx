import { type CSSProperties } from "react";
import { twMerge } from "tailwind-merge";

type SpinnerProps = {
  className?: string;
};

export const Spinner = ({ className }: SpinnerProps) => {
  return (
    <div
      className={twMerge("radial-progress animate-spin", className)}
      style={{ "--progress": "25%" } as CSSProperties}
    />
  );
};
