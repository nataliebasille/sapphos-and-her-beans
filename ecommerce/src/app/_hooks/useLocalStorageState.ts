import { useCallback, useMemo, useSyncExternalStore } from "react";

export const useLocalStorageState = <T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void] => {
  const storageData = useSyncExternalStore(
    useCallback(
      (onChange) => {
        const onStorageChange = (event: StorageEvent) => {
          console.log(event);
          if (event.key === key) {
            onChange(); // Notify the component when data changes
          }
        };

        // Listen for storage changes (across tabs)
        window.addEventListener("storage", onStorageChange);

        // Return an unsubscribe function to clean up the listener
        return () => {
          window.removeEventListener("storage", onStorageChange);
        };
      },
      [key],
    ),
    () => {
      return localStorage.getItem(key);
    },
    () => {
      return undefined;
    },
  );

  const value = useMemo(() => {
    return storageData ? (JSON.parse(storageData) as T) : initialValue;
  }, [storageData, initialValue]);

  const setValue = useCallback(
    (newValue: T) => {
      localStorage.setItem(key, JSON.stringify(newValue));
    },
    [key],
  );

  return [value, setValue];
};
