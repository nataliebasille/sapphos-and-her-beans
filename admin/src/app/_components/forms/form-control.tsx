"use client";

import { twMerge } from "tailwind-merge";
import { useFormProvider } from "./form-provider";
import { type NestedKeyOf } from "~/server/server-form-actions/validation";
import { type ComponentProps, type ComponentType } from "react";

export type FormControlProps<
  TIn,
  TControl extends keyof JSX.IntrinsicElements | ComponentType<unknown>,
> = {
  name: NestedKeyOf<TIn>;
  label?: React.ReactNode;
  className?: string;
  control: TControl;
  controlPrefix?: React.ReactNode;
  controlSuffix?: React.ReactNode;
} & (TControl extends keyof JSX.IntrinsicElements
  ? JSX.IntrinsicElements[TControl & keyof JSX.IntrinsicElements]
  : TControl extends ComponentType<unknown>
    ? ComponentProps<TControl>
    : Record<string, never>);

export function FormControl<
  TIn,
  TControl extends keyof JSX.IntrinsicElements | ComponentType<unknown>,
>({
  label,
  className,
  name,
  control: Control,
  controlPrefix,
  controlSuffix,
  ...inputProps
}: FormControlProps<TIn, TControl>) {
  const { errors } = useFormProvider();
  const error = (errors as Record<string, string>)[name];
  return (
    <div
      className={twMerge(
        "form-control",
        error && "form-control-error",
        className,
      )}
    >
      {label && <span className="form-control-label">{label}</span>}
      {controlPrefix && (
        <span className="form-control-prefix">{controlPrefix}</span>
      )}
      <Control
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...(inputProps as any)}
        name={name}
        className="form-control-input"
      />
      {controlSuffix && (
        <span className="form-control-suffix">{controlSuffix}</span>
      )}
      {error && <span className="form-control-hint">{error}</span>}
    </div>
  );
}
