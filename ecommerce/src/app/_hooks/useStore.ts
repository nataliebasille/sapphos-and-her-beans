import {
  type SetStateAction,
  type Dispatch,
  useCallback,
  useEffect,
  useState,
} from "react";

export type StoreApi<T> = {
  get: () => T;
  set: (value: T) => void;
  subscribe: (callback: (value: T) => void) => () => void;
};

const IDENTITY = <T>(x: T) => x;

export function useStore<T>(
  store: StoreApi<T>,
): [T, Dispatch<SetStateAction<T>>];
export function useStore<T, U>(
  store: StoreApi<T>,
  selector: (state: T) => U,
): [U, Dispatch<SetStateAction<T>>];

export function useStore(
  store: StoreApi<unknown>,
  selector?: (state: unknown) => unknown,
) {
  selector = selector ?? IDENTITY;

  const [value, setValue] = useState(() => selector(store.get()));

  useEffect(() => {
    return store.subscribe((state) => {
      setValue(selector(state));
    });
  }, [selector, store]);

  const setState: Dispatch<SetStateAction<unknown>> = useCallback(
    (newValueOrAction) => {
      const newValue: unknown =
        typeof newValueOrAction === "function" ?
          newValueOrAction(value)
        : newValueOrAction;
      store.set(newValue);
    },
    [value, store],
  );

  return [value, setState];
}
