import {
  createContext,
  memo,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react";
import {
  type StoreApi,
  useSelector as useSelectorGeneric,
} from "~/app/_stores/_creator/useSelector";

type CreateStoreOptions<T> = {
  onSet?: (value: T) => T;
};

type StoreProviderProps<T> = {
  initialValue?: T;
  children: React.ReactNode;
} & CreateStoreOptions<T>;

const IDENTITY = <T,>(x: T) => x;
export const createStore = <T,>(
  initialValue: T,
  opt?: CreateStoreOptions<T>,
) => {
  const StoreContext = createContext<StoreApi<T> | null>(null);
  const Provider = memo(
    ({
      children,
      initialValue: initialValueProp,
      ...additionalOptions
    }: StoreProviderProps<T>) => {
      const valueRef = useRef<T>(initialValueProp ?? initialValue);
      const subscriptionHandlers = useRef<Set<(value: T) => void>>(undefined);

      if (!subscriptionHandlers.current) {
        subscriptionHandlers.current = new Set();
      }

      const get = useCallback(() => {
        return valueRef.current;
      }, []);
      const set = useCallback(
        (changes: Partial<T>) => {
          valueRef.current = [additionalOptions?.onSet, opt?.onSet].reduce(
            (value, onSet) => (onSet ? onSet(value) : value),
            {
              ...valueRef.current,
              ...changes,
            },
          );
          subscriptionHandlers.current?.forEach((h) => h(valueRef.current));
        },
        [additionalOptions?.onSet],
      );
      const subscribe = useCallback((callback: (value: T) => void) => {
        subscriptionHandlers.current?.add(callback);
        return () => subscriptionHandlers.current?.delete(callback);
      }, []);

      return (
        <StoreContext.Provider
          value={useMemo(
            () => ({ get, set, subscribe }),
            [get, set, subscribe],
          )}
        >
          {children}
        </StoreContext.Provider>
      );
    },
  );

  Provider.displayName = "StoreProvider";

  const useStoreApi = () => {
    const store = useContext(StoreContext);

    if (!store) {
      throw new Error("useStoreContext must be used within a StoreProvider");
    }

    return store;
  };

  const useSelector = <U,>(selector: (state: T) => U) => {
    return useSelectorGeneric(
      useStoreApi(),
      selector ?? (IDENTITY as (state: T) => U),
    );
  };

  return { Provider, useStoreApi, useSelector };
};
