"use client";

import { type ChangeEvent, useCallback } from "react";
import { twMerge } from "tailwind-merge";

type QuantitySelectorProps = {
  value: number;
  onChange: (value: number) => void;
  className?: string;
};

export const QuantitySelector = ({
  value,
  onChange,
  className,
}: QuantitySelectorProps) => {
  const handleIncrement = useCallback(
    () => onChange(value + 1),
    [onChange, value],
  );
  const handleDecrement = useCallback(
    () => onChange(value <= 0 ? 0 : value - 1),
    [onChange, value],
  );
  const handleSet = useCallback(
    (e: ChangeEvent<HTMLInputElement>) =>
      onChange(parseInt(e.target.value, 10)),
    [onChange],
  );

  return (
    <div className={twMerge("flex", className)}>
      <button
        className="btn btn-outline rounded-r-none border-r-0 !border-surface-800 px-3 py-2 md:p-3"
        disabled={value <= 1}
        onClick={handleDecrement}
      >
        -
      </button>
      <input
        className="w-10 rounded-none border-l-0 border-r-0 border-solid border-surface-800 p-1 text-center md:p-2"
        type="text"
        value={value}
        inputMode="numeric"
        min={1}
        onChange={handleSet}
      />
      <button
        className="btn btn-outline rounded-l-none border-l-0 !border-surface-800 px-3 py-2 md:p-3"
        onClick={handleIncrement}
      >
        +
      </button>
    </div>
  );
};
