"use client";

import { ok } from "@nataliebasille/typescript-utils/functional/result";
import {
  createContext,
  useActionState,
  useContext,
  useMemo,
  useRef,
} from "react";
import { useFormState } from "react-dom";
import {
  type AnyFormAction,
  type FormAction,
} from "~/server/server-form-actions/actions";
import { type Validation_GetSchema } from "~/server/server-form-actions.old/validation";

type FormProviderContextProps<
  TAction extends FormAction<unknown, unknown, unknown>,
> = {
  readonly result: TAction extends FormAction<infer TOk, any, any> ? TOk : null;
  readonly errors: TAction extends FormAction<any, infer TError, any>
    ? TError
    : null;
};

const FormProviderContext = createContext<
  FormProviderContextProps<AnyFormAction>
>({
  result: false,
  errors: {},
});

type FormProviderProps<TAction extends AnyFormAction> = {
  className?: string;
  action: TAction;
  initialState: Validation_GetSchema<TAction>;
  children?: React.ReactNode;
};

export const FormProvider = <TAction extends AnyFormAction>({
  className,
  action,
  initialState,
  children,
}: FormProviderProps<TAction>) => {
  const ref = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(
    async (previous: Awaited<ReturnType<TAction>>, data: FormData) => {
      const result = await action(previous, data);

      // will work for now, but we should invert this dependency
      if (result.type === "ok") {
        ref.current?.reset();
      }

      return result;
    },
    ok(initialState) as Awaited<ReturnType<TAction>>,
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
