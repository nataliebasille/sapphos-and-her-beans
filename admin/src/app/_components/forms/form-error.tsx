"use client";

import { type ComponentType } from "react";
import { type NestedKeyOf } from "~/server/action-rpc/types";
import { useValidationError } from "./form-provider";

export type FormErrorProps<TIn> = {
  errorFor: NestedKeyOf<TIn, File>;
  ErrorComponent: ComponentType<{ error: string }>;
};

export function FormError<TIn>({
  errorFor,
  ErrorComponent,
}: FormErrorProps<TIn>) {
  const error = useValidationError(errorFor);
  return error ? <ErrorComponent error={error} /> : null;
}
