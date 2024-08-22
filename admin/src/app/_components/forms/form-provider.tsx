"use client";

import { ok } from "@nataliebasille/typescript-utils/functional/result";
import { createContext, useContext, useMemo, useRef } from "react";
import { useFormState } from "react-dom";
import {
  type ActionRequest,
  type ActionRequest_Result,
  type ServerAction_WithMetadata,
} from "~/server/server-form-actions.old/actions";
import { type ParsingErrors } from "~/server/server-form-actions.old/hooks/validation";
import { type GenericObject } from "~/server/server-form-actions.old/types";

export type FormActionResult<TIn, TResult> = ActionRequest_Result<
  TResult,
  ParsingErrors<TIn>
>;

export type FormAction<TIn, TResult> = ServerAction_WithMetadata<
  ActionRequest<GenericObject, TResult, ParsingErrors<TIn>>,
  { schema: TIn }
>;

type FormProviderContextProps<TAction extends FormAction<unknown, unknown>> = {
  readonly result:
    | (TAction extends FormAction<unknown, infer TResult> ? TResult : never)
    | null;
  readonly errors: ParsingErrors<
    TAction extends FormAction<infer TIn, unknown> ? TIn : never
  >;
};

const FormProviderContext = createContext<
  FormProviderContextProps<FormAction<unknown, unknown>>
>({
  result: false,
  errors: {},
});

type FormProviderProps<TIn, TResult> = {
  className?: string;
  action: FormAction<TIn, TResult>;
  initialState: TResult;
  children?: React.ReactNode;
};

export const FormProvider = <TIn, TResult>({
  className,
  action,
  initialState,
  children,
}: FormProviderProps<TIn, TResult>) => {
  const ref = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(
    async (
      previous: Awaited<FormActionResult<TIn, TResult>>,
      data: FormData,
    ) => {
      const result = await action(previous, data);

      // will work for now, but we should invert this dependency
      if (result.type === "ok") {
        ref.current?.reset();
      }

      return result;
    },
    ok(initialState) as Awaited<FormActionResult<TIn, TResult>>,
  );

  const contextValue = useMemo(() => {
    const result = state.type === "ok" ? state.value : null;
    const errors = state.type === "error" ? state.value : {};

    return {
      result,
      errors,
    };
  }, [state]);

  return (
    <FormProviderContext.Provider value={contextValue}>
      <form ref={ref} action={formAction} className={className}>
        {children}
      </form>
    </FormProviderContext.Provider>
  );
};

export const useFormProvider = () => {
  return useContext(FormProviderContext);
};
