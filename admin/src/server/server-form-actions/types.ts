export type Eager<T> = T extends unknown ? { [K in keyof T]: T[K] } : never;
export type GenericObject = Record<string, unknown>;
export type EmptyObject = {};

export type MergeContexts<T extends GenericObject, U extends GenericObject> = [
  T,
] extends [never]
  ? U
  : [U] extends [never]
    ? T
    : Eager<
        {
          [K in Exclude<keyof T, keyof U> as T[K] extends never
            ? never
            : K]: T[K];
        } & {
          [K in keyof U as U[K] extends never ? never : K]: U[K];
        }
      >;

type CommonKeys<T extends GenericObject> = keyof T;
type AllKeys<T> = T extends any ? keyof T : never;
type Subtract<A, C> = A extends C ? never : A;
type NonCommonKeys<T extends GenericObject> = Subtract<
  AllKeys<T>,
  CommonKeys<T>
>;

type PickType<T, K extends AllKeys<T>> = T extends { [k in K]?: any }
  ? T[K]
  : undefined;
type PickTypeOf<T, K extends string | number | symbol> =
  K extends AllKeys<T> ? PickType<T, K> : never;

export type MergeUnions<
  T extends GenericObject,
  Common extends keyof T = CommonKeys<T>,
  NonCommon extends string | number | symbol = NonCommonKeys<T>,
> = [T] extends [never]
  ? never
  : Eager<
      {
        [K in Common]: PickTypeOf<T, K>;
      } & {
        [K in NonCommon]?: PickTypeOf<T, K>;
      }
    >;

type X = MergeUnions<{
  one: 1;
  two: "two";
  three: true;
}>;

export type TupleIndices<T extends readonly unknown[]> =
  Extract<keyof T, `${number}`> extends `${infer N extends number}` ? N : never;

export type IsTuple<T> = T extends [unknown, ...Array<unknown>] ? true : false;

export type NestedKeyOf<T, Exclude = never> = T extends Exclude
  ? never
  : IsTuple<T> extends true
    ? {
        [Key in TupleIndices<T extends readonly unknown[] ? T : never>]:
          | `${Key}`
          | `${Key}.${NestedKeyOf<
              T extends readonly (infer ElementType)[] ? ElementType : never,
              Exclude
            >}`;
      }[TupleIndices<T extends readonly unknown[] ? T : never>]
    : T extends Array<infer ElementType>
      ? `${number}` | `${number}.${NestedKeyOf<ElementType, Exclude>}`
      : T extends object
        ? {
            [Key in keyof T & (string | number)]: T[Key] extends object
              ? `${Key}` | `${Key}.${NestedKeyOf<T[Key], Exclude>}`
              : `${Key}`;
          }[keyof T & (string | number)]
        : never;
