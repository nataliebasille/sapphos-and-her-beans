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

export function useSelector<T, U>(
  store: StoreApi<T>,
  selector: (state: T) => U,
): U {
  const selectorRef = useRef(selector);

  const [value, setValue] = useState(() => selectorRef.current(store.get()));

  useEffect(() => {
    selectorRef.current = selector;
  });

  useEffect(() => {
    return store.subscribe((state) => {
      setValue(selectorRef.current(state));
    });
  }, [store]);

  return value;
}
