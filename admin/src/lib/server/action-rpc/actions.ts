import {
  error,
  ok,
  type Result,
} from "@nataliebasille/typescript-utils/functional/result";
import {
  type EmptyObject,
  type GenericObject,
  type MergeContexts,
} from "./types";
import { runToCompletion } from "./utils";

const actionError: unique symbol = Symbol("actionError");
export type ActionError = {
  code: string;
  message?: string;
  data?: unknown;
};

export type Action<TIn, TOk, TError extends ActionError> = [TIn] extends [never]
  ? () => Promise<Result<TOk, TError>>
  : (input: TIn) => Promise<Result<TOk, TError>>;

export type Action_GetInput<T extends Action<any, any, ActionError>> =
  Parameters<T>[0];

export type Action_GetOutput<T extends Action<any, any, ActionError>> = Awaited<
  ReturnType<T>
>;

// export type StatefulAction<TIn, TOut> = (
//   previous: TOut,
//   current: TIn,
// ) => Promise<TOut>;

export interface NextResult<
  TOk,
  TError extends ActionError,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _TContext extends GenericObject,
> {
  ok: boolean;
  value: TOk | TError;
}

export type AnyNextResult = NextResult<unknown, ActionError, GenericObject>;

type NextGenerator<
  TOk,
  TError extends ActionError,
  TContext extends GenericObject,
> = AsyncGenerator<
  NextResult<TOk, TError, TContext>,
  NextResult<TOk, TError, TContext>,
  unknown
>;

type NextFunction<
  TOk,
  TError extends ActionError,
  TContext extends GenericObject,
> = {
  (): NextGenerator<TOk, TError, TContext>;
  <TAdditionalContext extends GenericObject>(
    context: TAdditionalContext,
  ): NextGenerator<TOk, TError, MergeContexts<TContext, TAdditionalContext>>;
};

type ErrorFunction = {
  <TCode extends string>(code: TCode): { code: TCode };
  <TCode extends string, TMessage extends string>(
    code: TCode,
    message: TMessage,
  ): {
    code: TCode;
    message: TMessage;
  };
  <TError extends Omit<ActionError, typeof actionError>>(error: TError): TError;
};

type UseHandlerArgs<TIn, TContext extends GenericObject> = {
  input: TIn;
  context: TContext;
};

export type UseHandlerContext<TContext extends GenericObject> = {
  next: NextFunction<unknown, ActionError, TContext>;
  error: ErrorFunction;
};

export type UseHandler<TContext extends GenericObject> = (
  args: UseHandlerArgs<unknown, TContext>,
  ctx: {
    next: NextFunction<unknown, ActionError, TContext>;
    error: ErrorFunction;
  },
) => AsyncGenerator<
  NextResult<unknown, ActionError, TContext>,
  unknown,
  unknown
>;

type UseHandler_GetNextContext<T extends UseHandler<any>> =
  ReturnType<T> extends AsyncGenerator<infer Yielded, infer Returned, any>
    ? Yielded extends NextResult<unknown, ActionError, infer TContext>
      ? TContext
      : never
    : never;

type UseHandler_GetOut<T extends UseHandler<any>> =
  ReturnType<T> extends AsyncGenerator<any, infer TReturned, any>
    ? TReturned extends NextResult<unknown, ActionError, GenericObject>
      ? never
      : TReturned
    : never;

export type ActionHandlerContext<TContext extends GenericObject> = {
  context: TContext;
  error: ErrorFunction;
};
export type ActionHandler<TIn, TOut, TContext extends GenericObject> = (
  input: TIn,
  ctx: ActionHandlerContext<TContext>,
) => Promise<TOut>;

export type ActionFactory<TContext extends GenericObject, TIntermediateOut> = {
  use<THandler extends UseHandler<TContext>>(
    handler: THandler,
  ): ActionFactory<
    UseHandler_GetNextContext<THandler>,
    UseHandler_GetOut<THandler>
  >;
  action<TIn = never, TOut = never>(
    handler: ActionHandler<TIn, TOut, TContext>,
  ): Action<
    TIn,
    Exclude<TIntermediateOut | TOut, ActionError>,
    Extract<TIntermediateOut | TOut, ActionError>
  >;
};

export type ActionFactory_GetContext<T extends ActionFactory<any, any>> =
  T extends ActionFactory<infer TContext, any> ? TContext : never;

export type ActionFactory_GetOut<T extends ActionFactory<any, any>> =
  T extends ActionFactory<any, infer TOut> ? TOut : never;

export const initActionFactory = (): ActionFactory<EmptyObject, never> => {
  const middleware: Array<UseHandler<GenericObject>> = [];
  const factory: ActionFactory<GenericObject, never> = {
    use(handler) {
      middleware.push(handler);
      return factory as ActionFactory<any, any>;
    },
    action(handler) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return (async (input: unknown) => {
        let context: GenericObject = {};
        let currentPosition = 0;
        const next = async function* (additionalContext?: GenericObject) {
          const previousContext = context;
          context = additionalContext
            ? Object.freeze({
                ...context,
                ...additionalContext,
              })
            : context;

          let result: NextResult<any, any, GenericObject>;
          if (currentPosition >= middleware.length) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            const handlerValue = await handler(input as any, {
              context,
              error: createError,
            });
            const isError =
              typeof handlerValue === "object" &&
              handlerValue &&
              actionError in handlerValue;
            result = { ok: !isError, value: handlerValue };
          } else {
            const previousPosition = currentPosition++;
            const middlewareHandler = middleware[previousPosition]!;

            result = (yield* middlewareHandler(
              { input, context },
              { next, error: createError },
            )) as NextResult<any, any, GenericObject>;
            currentPosition = previousPosition;
          }

          context = previousContext;
          return result;
        } as NextFunction<any, any, GenericObject>;

        const finalResult = await runToCompletion(next({}));

        return finalResult.ok
          ? ok(finalResult.value)
          : error(finalResult.value);
      }) as any;
    },
  };

  return factory as unknown as ActionFactory<EmptyObject, never>;
};

const createError = function (data, message) {
  return typeof data === "string"
    ? { [actionError]: true, code: data, message }
    : { [actionError]: true, ...(data as object) };
} as ErrorFunction;
