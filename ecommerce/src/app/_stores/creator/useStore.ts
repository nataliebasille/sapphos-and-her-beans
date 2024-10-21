import {
  type SetStateAction,
  type Dispatch,
  useCallback,
  useEffect,
  useState,
  useRef,
} from "react";

export type StoreApi<T> = {
  get: () => T;
  set: (value: Partial<T>) => void;
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
  const selectorRef = useRef(selector ?? IDENTITY);

  const [value, setValue] = useState(() => selectorRef.current(store.get()));

  useEffect(() => {
    selectorRef.current = selector ?? IDENTITY;
  });

  useEffect(() => {
    return store.subscribe((state) => {
      setValue(selectorRef.current(state));
    });
  }, [store]);

  const setState: Dispatch<SetStateAction<unknown>> = useCallback(
    (newValueOrAction) => {
      const newValue: unknown =
        typeof newValueOrAction === "function" ?
          newValueOrAction(value)
        : newValueOrAction;
      store.set(newValue as Partial<unknown>);
    },
    [value, store],
  );

  return [value, setState];
}
