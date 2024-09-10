import { type infer as Infer, type SafeParseError } from "zod";
import {
  type ActionError,
  type Action,
  type ActionHandlerContext,
} from "../actions";
import { type GenericObject, type NestedKeyOf } from "../types";
import { createFormParser, type ZodSchema } from "./form-data-parser";

// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-unused-vars
export interface ActionFormData<_TIn> extends FormData {}

export type FormAction<TIn, TOk, TError extends ActionError> = Action<
  ActionFormData<TIn>,
  TOk,
  TError | ValidationActionError<TIn>
>;

export type AnyFormAction = FormAction<any, any, any>;

export type FormAction_GetInput<T extends FormAction<any, any, any>> =
  T extends FormAction<infer TIn, any, any> ? TIn : never;

export type ValidationActionError<TIn> = {
  code: "validation_error";
  data: ValidationErrors<TIn>;
};

export type ValidationErrors<TIn> = Partial<
  Record<NestedKeyOf<TIn, File>, string>
>;

type FormActionHandler<
  TSchema extends ZodSchema,
  TOut,
  TContext extends GenericObject,
> = (
  data: Infer<TSchema>,
  ctx: ActionHandlerContext<TContext>,
) => Promise<TOut>;

export function formAction<
  TSchema extends ZodSchema,
  TOut,
  TContext extends GenericObject,
>(schema: TSchema, handler: FormActionHandler<TSchema, TOut, TContext>) {
  const formParser = createFormParser(schema);

  return async function (
    data: ActionFormData<Infer<TSchema>>,
    ctx: ActionHandlerContext<TContext>,
  ) {
    const { error } = ctx;
    const result = await formParser(data);

    if (!result.success) {
      return error(createError<TSchema>(result));
    }

    return handler(result.data, ctx);
  };
}

function createError<TSchema extends ZodSchema>(result: SafeParseError<any>) {
  return {
    code: "validation_error" as const,
    data: result.error?.errors.reduce<ValidationErrors<Infer<TSchema>>>(
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
      {} as ValidationErrors<Infer<TSchema>>,
    ),
  };
}
