import {
  type Result,
  type Result_InferOK,
  type Result_InferError,
  ok as okResult,
  error as errorResult,
} from "@nataliebasille/typescript-utils/functional/result";
import {
  type MergeContexts,
  type GenericObject,
  type EmptyObject,
  type MergeUnions,
} from "./types";

export type FormAction<TOk, TError> = (
  previous: Result<TOk, TError>,
  formData: FormData,
) => Promise<Result<TOk, TError>>;

export type ActionRequest<TOk, TError, TContext extends GenericObject> = {
  formData: FormData;
  context: TContext;
  previous: Result<TOk, TError>;
};

export type ActionResult<TOk, TError, TContext extends GenericObject> = Result<
  TOk,
  TError
> & {
  [metadata]?: TContext;
};

export type ActionResult_GetContext<
  TResult extends ActionResult<any, any, any>,
> = [TResult] extends [ActionResult<any, any, infer TContext>]
  ? MergeUnions<TContext>
  : never;

declare const metadata: unique symbol;

export type NextGenerator<
  TOk,
  TError,
  TContext extends GenericObject,
> = AsyncGenerator<
  ActionResult<TOk, TError, TContext>,
  ActionResult<TOk, TError, TContext>,
  undefined
>;

export type ActionResponse<TOk, TError, TContext extends GenericObject> = {
  next(): NextGenerator<TOk, TError, TContext>;
  next<TAdditionalContext extends GenericObject>(
    context: TAdditionalContext,
  ): NextGenerator<TOk, TError, MergeContexts<TContext, TAdditionalContext>>;
  ok<TOk>(result: TOk): ActionResult<TOk, TError, never>;
  error<TError>(error: TError): ActionResult<TOk, TError, never>;
};

export type ActionHandler_Return<
  TYieldContext extends ActionResult<any, any, any>,
  TReturnedContext extends ActionResult<any, any, any>,
> = AsyncGenerator<TYieldContext, TReturnedContext, undefined>;

export type ActionHandler_Return_GetOk<
  TReturn extends ActionHandler_Return<any, any>,
> =
  TReturn extends ActionHandler_Return<any, infer TResult>
    ? TResult extends ActionResult<any, any, any>
      ? Result_InferOK<TResult>
      : never
    : never;

export type ActionHandler_Return_GetError<
  TReturn extends ActionHandler_Return<any, any>,
> =
  TReturn extends ActionHandler_Return<any, infer TResult>
    ? TResult extends ActionResult<any, any, any>
      ? Result_InferError<TResult>
      : never
    : never;

export type ActionHandler_Return_GetContext<
  TReturn extends ActionHandler_Return<any, any>,
> =
  TReturn extends AsyncGenerator<infer TYieledResult, infer TReturnedResult>
    ? MergeUnions<
        | ([TYieledResult] extends [never]
            ? never
            : [TYieledResult] extends [ActionResult<any, any, any>]
              ? ActionResult_GetContext<TYieledResult>
              : never)
        | ([TReturnedResult] extends [never]
            ? never
            : [TReturnedResult] extends [ActionResult<any, any, any>]
              ? ActionResult_GetContext<TReturnedResult>
              : never)
      >
    : never;

export type ActionHandler<
  TOk,
  TError,
  TContext extends GenericObject,
  TReturn extends ActionHandler_Return<any, any>,
> = (
  request: ActionRequest<TOk, TError, TContext>,
  response: ActionResponse<TOk, TError, TContext>,
) => TReturn;

export type ActionFactory<
  TOk,
  TError,
  TContext extends GenericObject,
> = FormAction<TOk, TError> & {
  use: <TReturn extends ActionHandler_Return<any, any>>(
    handler: ActionHandler<TOk, TError, TContext, TReturn>,
  ) => ActionFactory<
    ActionHandler_Return_GetOk<TReturn>,
    ActionHandler_Return_GetError<TReturn>,
    ActionHandler_Return_GetContext<TReturn>
  >;
};

export const createAction = (): ActionFactory<never, never, EmptyObject> => {
  const handlers: Array<ActionHandler<any, any, any, any>> = [];
  const serverAction: ActionFactory<any, any, any> = async (
    previous: Result<any, any>,
    formData: FormData,
  ) => {
    const request: ActionRequest<any, any, any> = {
      formData,
      context: {},
      previous,
    };

    return await runHandlers(handlers, request);
  };

  serverAction.use = ((
    handler: ActionHandler<any, any, any, any>,
  ): ActionFactory<any, any, any> => {
    handlers.push(handler);
    return serverAction;
  }) as ActionFactory<any, any, any>["use"];

  return serverAction as unknown as ActionFactory<never, never, EmptyObject>;
};

async function runHandlers(
  handlers: Array<
    ActionHandler<any, any, GenericObject, ActionHandler_Return<any, any>>
  >,
  initialRequest: ActionRequest<any, any, GenericObject>,
) {
  let currentPosition = 0;
  let request = initialRequest;
  async function* next(additionalContext: GenericObject) {
    if (currentPosition >= handlers.length) {
      return request;
    }

    request = {
      ...request,
      context: {
        ...request.context,
        ...additionalContext,
      },
    };

    const position = currentPosition++;
    const result = (yield* handlers[position]!(request, {
      next,
      ok,
      error,
    } as ActionResponse<any, any, GenericObject>)) as ActionResult<
      any,
      any,
      GenericObject
    >;

    currentPosition = position;
    return result;
  }

  const ok = (result: GenericObject) => {
    return okResult(result);
  };

  function error(e: unknown) {
    return errorResult(e);
  }

  return (await runToCompletion(next({}))) as Result<any, any>;
}

async function runToCompletion<T>(generator: AsyncGenerator<T>): Promise<T> {
  let result: IteratorResult<T>;
  do {
    result = await generator.next();
  } while (!result.done);

  return result.value as T;
}
