"use client";

import { type ComponentType } from "react";
import { useFormProvider } from "./form-provider";
import { type NestedKeyOf } from "~/server/server-form-actions/validation";

export type FormErrorProps<TIn> = {
  errorFor: NestedKeyOf<TIn>;
  ErrorComponent: ComponentType<{ error: string }>;
};

export function FormError<TIn>({
  errorFor,
  ErrorComponent,
}: FormErrorProps<TIn>) {
  const { errors } = useFormProvider();
  const error = (errors as Record<string, string>)[errorFor];
  return error ? <ErrorComponent error={error} /> : null;
}
