import { type ActionRequest, type ActionResponse } from "../actions";
import { type NestedKeyOf, type GenericObject } from "../types";
import { createFormParser, type ZodSchema } from "./form-data-parser";
import { type infer as Infer } from "zod";

export type ValidationErrors<TSchema extends ZodSchema> = Partial<
  Record<NestedKeyOf<TSchema, File>, string>
>;

export function validation<TSchema extends ZodSchema>(schema: TSchema) {
  const parser = createFormParser(schema);

  return async function* <TOk, TError, TContext extends GenericObject>(
    request: ActionRequest<TOk, TError, TContext>,
    { next, error }: ActionResponse<TOk, TError, TContext>,
  ) {
    const result = await parser(request.formData);

    if (result.success) {
      yield* next({
        data: result.data as Infer<TSchema>,
      });
    }

    return error(
      result.error?.errors.reduce<ValidationErrors<TSchema>>((acc, error) => {
        const { path, message } = error;
        const key: string = path.reduce((acc: string, key) => {
          if (typeof key === "string" && !acc) {
            return key;
          }

          return typeof key === "string" ? `${acc}.${key}` : `${acc}[${key}]`;
        }, "");

        acc[key as keyof typeof acc] = message;
        return acc;
      }, {} as ValidationErrors<TSchema>),
    );
  };
}
