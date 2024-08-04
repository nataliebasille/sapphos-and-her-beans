import { type infer as Infer, type ZodTypeAny } from "zod";

import { hook } from "../../hook";
import { createFormParser, type ZodSchema } from "./form-data-parser";

export type TupleIndices<T extends readonly unknown[]> =
  Extract<keyof T, `${number}`> extends `${infer N extends number}` ? N : never;

export type IsTuple<T> = T extends [unknown, ...Array<unknown>] ? true : false;

export type NestedKeyOf<T> =
  IsTuple<T> extends true
    ? {
        [Key in TupleIndices<T extends readonly unknown[] ? T : never>]:
          | `${Key}`
          | `${Key}.${NestedKeyOf<
              T extends readonly (infer ElementType)[] ? ElementType : never
            >}`;
      }[TupleIndices<T extends readonly unknown[] ? T : never>]
    : T extends Array<infer ElementType>
      ? `${number}` | `${number}.${NestedKeyOf<ElementType>}`
      : T extends object
        ? {
            [Key in keyof T & (string | number)]: T[Key] extends object
              ? `${Key}` | `${Key}.${NestedKeyOf<T[Key]>}`
              : `${Key}`;
          }[keyof T & (string | number)]
        : never;

export type ParsedResult<TSchema extends ZodTypeAny> = {
  parsedResult: Infer<TSchema>;
};

export type ParsingErrors<TSchema> = Partial<
  Record<NestedKeyOf<TSchema>, string>
>;

export function validation<TSchema extends ZodSchema>(schema: TSchema) {
  const parser = createFormParser(schema);
  return hook<
    ParsedResult<TSchema>,
    never,
    ParsingErrors<Infer<TSchema>>,
    { schema: Infer<TSchema> }
  >(async ({ formData }, { next, error }) => {
    const result = await parser(formData);

    if (result.success) {
      return next({
        parsedResult: result.data as Infer<TSchema>,
      });
    }

    return error(
      result.error.errors.reduce(
        (acc, error) => {
          const { path, message } = error;
          const key: string = path.reduce((acc: string, key) => {
            if (typeof key === "string" && !acc) {
              return key;
            }

            return typeof key === "string" ? `${acc}.${key}` : `${acc}[${key}]`;
          }, "");

          acc[key as keyof typeof acc] = message;
          return acc;
        },
        {} as Record<NestedKeyOf<Infer<TSchema>>, string>,
      ),
    );
  });
}
