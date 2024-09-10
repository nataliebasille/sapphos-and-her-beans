"use client";

import { memo, type ComponentProps, type ComponentType } from "react";
import { twMerge } from "tailwind-merge";
import {
  type Eager,
  type EmptyObject,
  type GenericObject,
  type NestedKeyOf,
} from "~/server/action-rpc/types";
import { useValidationError } from "./form-provider";

type GetAttributes<T extends keyof JSX.IntrinsicElements> = Eager<
  Omit<JSX.IntrinsicElements[T], "name">
>;

type CommonFormControlProps<TIn, TControl> = {
  name: NestedKeyOf<TIn, File>;
  label?: React.ReactNode;
  className?: string;
  inputClassName?: string;
  control: TControl;
  controlPrefix?: React.ReactNode;
  controlSuffix?: React.ReactNode;
};

type IntrinsicElementFormControlProps<TControl> =
  TControl extends keyof JSX.IntrinsicElements
    ? GetAttributes<TControl & keyof JSX.IntrinsicElements>
    : EmptyObject;

type ComponentFormControlProps<TControl> =
  TControl extends ComponentType<unknown>
    ? ComponentProps<TControl>
    : EmptyObject;

export type FormControlProps<
  TIn,
  TControl extends keyof JSX.IntrinsicElements | ComponentType<GenericObject>,
> = CommonFormControlProps<TIn, TControl> & {
  inputProps?: TControl extends keyof JSX.IntrinsicElements
    ? IntrinsicElementFormControlProps<TControl>
    : ComponentFormControlProps<TControl>;
};

export const FormControl = memo(function FormControl<
  TIn,
  TControl extends keyof JSX.IntrinsicElements | ComponentType<any>,
>({
  label,
  className,
  inputClassName,
  name,
  control: Control,
  controlPrefix,
  controlSuffix,
  inputProps,
}: FormControlProps<TIn, TControl>) {
  const error = useValidationError(name);
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
        className={twMerge("form-control-input", inputClassName)}
      />
      {controlSuffix && (
        <span className="form-control-suffix">{controlSuffix}</span>
      )}
      {error && <span className="form-control-hint">{error}</span>}
    </div>
  );
});
