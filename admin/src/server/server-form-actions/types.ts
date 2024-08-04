export type Eager<T> = T extends unknown ? { [K in keyof T]: T[K] } : T;
export type GenericObject = Record<string, unknown>;
export type EmptyObject = {};

export type MergeContexts<
  T extends GenericObject,
  U extends GenericObject,
> = Eager<
  {
    [K in Exclude<keyof T, keyof U> as T[K] extends never ? never : K]: T[K];
  } & {
    [K in keyof U as U[K] extends never ? never : K]: U[K];
  }
>;
