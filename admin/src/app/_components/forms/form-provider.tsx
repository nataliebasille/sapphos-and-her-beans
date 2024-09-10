"use client";

import {
  ok,
  type Result,
} from "@nataliebasille/typescript-utils/functional/result";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useFormState } from "react-dom";
import { type ActionError } from "~/server/action-rpc";
import {
  type ValidationActionError,
  type AnyFormAction,
  type FormAction_GetInput,
} from "~/server/action-rpc/forms/form-action";
import { type Eager } from "~/server/action-rpc/types";

type FormProviderContextProps<TAction extends AnyFormAction> = {
  get: () => Awaited<ReturnType<TAction>>;
  subscribe: (
    callback: (state: Awaited<ReturnType<TAction>>) => void,
  ) => () => void;
};

const FormProviderContext = createContext<
  FormProviderContextProps<AnyFormAction> | undefined
>(undefined);

type InitialState<TResult> = Eager<{
  [K in keyof TResult as TResult[K] extends File ? never : K]: TResult[K];
}>;

export type FormProps<TAction extends AnyFormAction> = {
  className?: string;
  action: TAction;
  initialState: InitialState<FormAction_GetInput<TAction>>;
} & Omit<JSX.IntrinsicElements["form"], "action" | "children">;

type FormProviderProps<TAction extends AnyFormAction> = FormProps<TAction> & {
  children?: React.ReactNode;
};

export const FormProvider = <TAction extends AnyFormAction>({
  className,
  action,
  initialState,
  children,
  ...formProps
}: FormProviderProps<TAction>) => {
  const formRef = useRef<HTMLFormElement>(null);
  const stateSubscriptions =
    useRef<Set<(state: Awaited<ReturnType<AnyFormAction>>) => void>>();

  if (!stateSubscriptions.current) {
    stateSubscriptions.current = new Set();
  }

  const [state, formAction] = useFormState(
    async (_: Awaited<ReturnType<AnyFormAction>>, data: FormData) => {
      const result = await action(data);

      // will work for now, but we should invert this dependency
      if (result.type === "ok") {
        formRef.current?.reset();
      }

      return result;
    },
    ok(initialState) as Awaited<ReturnType<AnyFormAction>>,
  );

  const get = useRef<() => Awaited<ReturnType<AnyFormAction>>>();

  if (!get.current) {
    get.current = () => state;
  }

  const subscribe = useCallback(
    (callback: (state: Awaited<ReturnType<AnyFormAction>>) => void) => {
      stateSubscriptions.current?.add(callback);
      return () => stateSubscriptions.current?.delete(callback);
    },
    [],
  );

  const contextValue = useMemo(() => {
    return {
      get: get.current!,
      subscribe,
    };
  }, [get, subscribe]);

  useEffect(() => {
    stateSubscriptions.current?.forEach((callback) => callback(state));
  }, [state]);

  return (
    <FormProviderContext.Provider value={contextValue}>
      <form
        ref={formRef}
        action={formAction}
        className={className}
        {...formProps}
      >
        {children}
      </form>
    </FormProviderContext.Provider>
  );
};

const useFormProvider = () => {
  const context = useContext(FormProviderContext);

  if (!context) {
    throw new Error("useFormProvider must be used within a FormProvider");
  }

  return context;
};

export const useValidationError = (name: string) => {
  const { get, subscribe } = useFormProvider();
  const [error, setError] = useState<string | null>(() =>
    getError(name, get()),
  );

  useEffect(() => {
    const unsubscribe = subscribe((state) => {
      const e = getError(name, state);
      setError(getError(name, state));
    });

    return unsubscribe;
  }, [name, subscribe]);

  return error;
};

function getError(
  name: string,
  state: null | Result<any, ActionError | ValidationActionError<any>>,
): string | null {
  return (
    (state?.type === "error" &&
      state.value.code ===
        ("validation_error" satisfies ValidationActionError<any>["code"]) &&
      typeof state.value.data === "object" &&
      state.value.data &&
      (state.value.data as Record<string, string>)[name]) ||
    null
  );
}
