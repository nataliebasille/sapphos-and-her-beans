import {
  type EmptyObject,
  type GenericObject,
  type MergeContexts,
} from "./types";

export type Action<TIn, TOut> = [TIn] extends [never]
  ? () => Promise<TOut>
  : (input: TIn) => Promise<TOut>;
export type Action_GetInput<T extends Action<unknown, unknown>> =
  T extends Action<infer TIn, unknown> ? TIn : never;

export type Action_GetOutput<
  T extends Action<unknown, unknown> | Action<never, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
> = T extends Action<infer _, infer TOut> ? TOut : never;

export type StatefulAction<TIn, TOut> = (
  previous: TOut,
  current: TIn,
) => Promise<TOut>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface NextResult<TOut, _TContext extends GenericObject> {
  result: TOut;
}

type NextGenerator<TOut, TContext extends GenericObject> = AsyncGenerator<
  NextResult<TOut, TContext>,
  NextResult<TOut, TContext>,
  unknown
>;

type NextFunction<TOut, TContext extends GenericObject> = {
  (): NextGenerator<TOut, TContext>;
  <TAdditionalContext extends GenericObject>(
    context: TAdditionalContext,
  ): NextGenerator<TOut, MergeContexts<TContext, TAdditionalContext>>;
};

type UseHandlerArgs<TIn, TContext extends GenericObject> = {
  input: TIn;
  context: TContext;
};

type UseHandler<TContext extends GenericObject> = (
  args: UseHandlerArgs<unknown, TContext>,
  next: NextFunction<unknown, TContext>,
) => AsyncGenerator<NextResult<unknown, TContext>, unknown, unknown>;

type UseHandler_GetNextContext<T extends UseHandler<any>> =
  ReturnType<T> extends AsyncGenerator<infer Yielded, infer Returned, any>
    ?
        | (Yielded extends NextResult<any, infer TContext> ? TContext : never)
        | (Returned extends NextResult<any, infer TContext> ? TContext : never)
    : never;

type UseHandler_GetOut<T extends UseHandler<any>> =
  ReturnType<T> extends AsyncGenerator<any, infer TReturned, any>
    ? TReturned extends NextResult<any, any>
      ? never
      : TReturned
    : never;

type ActionHandler<TIn, TOut, TContext extends GenericObject> = (
  input: TIn,
  context: TContext,
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
  ): Action<TIn, TIntermediateOut | TOut>;
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

          let result: NextResult<any, GenericObject>;
          if (currentPosition >= middleware.length) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            result = { result: await handler(input as any, context) };
          } else {
            const previousPosition = currentPosition++;
            const middlewareHandler = middleware[previousPosition]!;

            result = (yield* middlewareHandler(
              { input, context },
              next,
            )) as NextResult<any, GenericObject>;
            currentPosition = previousPosition;
          }

          context = previousContext;
          return result;
        } as NextFunction<any, GenericObject>;

        const finalResult = (
          (await runToCompletion(next({}))) as NextResult<any, GenericObject>
        ).result as unknown;

        return finalResult;
      }) as any;
    },
  };

  return factory as unknown as ActionFactory<EmptyObject, never>;
};

async function runToCompletion<T>(generator: AsyncGenerator<T>): Promise<T> {
  let result: IteratorResult<T>;
  do {
    result = await generator.next();
  } while (!result.done);

  return result.value as T;
}
