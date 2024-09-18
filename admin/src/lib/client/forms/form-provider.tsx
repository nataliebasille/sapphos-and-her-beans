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
import { type ActionError } from "~/lib/server/action-rpc";
import {
  type ValidationActionError,
  type AnyFormAction,
  type FormAction_GetInput,
} from "~/lib/server/action-rpc/forms/form-action";
import { type Eager } from "~/lib/server/action-rpc/types";

type FormProviderContextData<TAction extends AnyFormAction> = {
  data: Awaited<ReturnType<TAction>> | null;
  disabled: boolean;
};

type FormProviderContextProps<TAction extends AnyFormAction> = {
  get: () => FormProviderContextData<TAction>;
  set: (changes: Partial<FormProviderContextData<TAction>>) => void;
  subscribe: (
    callback: (state: FormProviderContextData<TAction>) => void,
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
    useRef<Set<(data: FormProviderContextData<TAction>) => void>>();

  if (!stateSubscriptions.current) {
    stateSubscriptions.current = new Set();
  }

  const formStateData = ok(initialState) as Awaited<ReturnType<TAction>>;
  const formStateRef = useRef<FormProviderContextData<TAction>>({
    data: formStateData,
    disabled: false,
  });

  const set = useCallback(
    (changes: Partial<FormProviderContextData<TAction>>) => {
      formStateRef.current = {
        ...formStateRef.current,
        ...changes,
      };
      stateSubscriptions.current?.forEach((callback) =>
        callback(formStateRef.current),
      );
    },
    [],
  );

  const [, formAction] = useFormState(
    async (_: Awaited<ReturnType<AnyFormAction>>, data: FormData) => {
      const result = await action(data);

      // will work for now, but we should invert this dependency
      if (result.type === "ok") {
        formRef.current?.reset();
      }

      set({ data: result as Awaited<ReturnType<TAction>> });

      return result;
    },
    formStateData,
  );

  const get = useCallback(() => formStateRef.current, []);
  const subscribe = useCallback(
    (callback: (state: FormProviderContextData<TAction>) => void) => {
      stateSubscriptions.current?.add(callback);
      return () => stateSubscriptions.current?.delete(callback);
    },
    [],
  );

  const contextValue = useMemo(() => {
    return {
      get,
      set,
      subscribe,
    };
  }, [get, set, subscribe]);

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

type FormProvider<TAction extends AnyFormAction> = {
  useSelector: <T>(selector: (state: Awaited<ReturnType<TAction>>) => T) => T;
};

export const useFormProvider = <
  TAction extends AnyFormAction = AnyFormAction,
>() => {
  const context = useContext(
    FormProviderContext,
  ) as FormProviderContextProps<TAction>;

  if (!context) {
    throw new Error("useFormProvider must be used within a FormProvider");
  }

  const { get, subscribe, set: dispatchChanges } = context;

  return {
    useSelector: <T,>(
      selector: (state: FormProviderContextData<TAction>) => T,
    ) => {
      const selectorRef = useRef(selector);
      const [value, setValue] = useState(() => selector(get()));
      useEffect(() => {
        const unsubscribe = subscribe((state) => {
          setValue(selectorRef.current(state));
        });

        return unsubscribe;
      }, []);

      useEffect(() => {
        selectorRef.current = selector;
      });

      return value;
    },
    dispatchChanges,
  };
};

export const useValidationError = (name: string) => {
  const { useSelector } = useFormProvider();
  return useSelector((state) => getError(name, state.data ?? null));
};

export const useSubmitToggle = () => {
  const { useSelector, dispatchChanges } = useFormProvider();
  const disabled = useSelector((state) => state.disabled);

  return {
    enableSubmit: useCallback(
      () => dispatchChanges({ disabled: false }),
      [dispatchChanges],
    ),
    disableSubmit: useCallback(
      () => dispatchChanges({ disabled: true }),
      [dispatchChanges],
    ),
    toggleSubmit: useCallback(
      () => dispatchChanges({ disabled: !disabled }),
      [disabled, dispatchChanges],
    ),
  };
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
