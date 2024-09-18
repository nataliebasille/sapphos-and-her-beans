import { twMerge } from "tailwind-merge";

type ProgressBarProps = {
  className?: string;
  /**
   * The minimum value of the progress bar. Defaults to 0.
   */
  min?: number;
  /**
   * The maximum value of the progress bar. Defaults to 100.
   */
  max?: number;
  /**
   * The current value of the progress bar. Defaults to min if not provided.
   */
  value?: number;
  children?: React.ReactNode;
};

export function ProgressBar({
  min = 0,
  max = 100,
  value = min,
  className,
  children,
}: ProgressBarProps) {
  const progress = Math.round(
    Math.max(Math.min((value - min) / (max - min), 1), 0) * 100,
  );

  return (
    <div
      role="progressbar"
      className={twMerge(
        "relative h-6 w-full overflow-hidden rounded-md bg-surface-400",
        className,
      )}
    >
      {children}
      <div
        className="absolute bottom-0 left-0 top-0 h-full w-full rounded-md bg-primary-600 transition-transform duration-200"
        style={{ transform: `translateX(-${100 - progress}%)` }}
      />
    </div>
  );
}
