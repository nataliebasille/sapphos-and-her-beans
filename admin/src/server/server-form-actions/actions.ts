import {
  type Result,
  type Result_Error,
  type Result_InferError,
  type Result_InferOK,
  type Result_Ok,
  ok as okResult,
  error as errorResult,
} from "@nataliebasille/typescript-utils/functional/result";
import {
  type EmptyObject,
  type GenericObject,
  type MergeContexts,
} from "./types";

declare const metadata: unique symbol;

export type ServerAction<TRequest extends AnyActionRequest> = (
  previous: ActionRequest_GetResult<TRequest>,
  formData: FormData,
) => Promise<ActionRequest_GetResult<TRequest>>;

export type ServerAction_WithMetadata<
  TRequest extends AnyActionRequest,
  TMetadata,
> = ServerAction<TRequest> & {
  [metadata]?: TMetadata;
};

export type ActionRequest_Result<TOk, TError> = [TOk] extends [never]
  ? [TError] extends [never]
    ? Result_Ok<undefined>
    : Result_Error<TError>
  : Result<TOk, TError>;

export type ActionRequest<
  TContext extends GenericObject = EmptyObject,
  TOk = never,
  TError = never,
> = {
  readonly formData: FormData;
  readonly context: TContext;
  readonly previous: ActionRequest_Result<TOk, TError> | undefined;
  readonly result: ActionRequest_Result<TOk, TError>;
};

export type AnyActionRequest = ActionRequest<GenericObject, unknown, unknown>;

export type ActionRequest_GetContext<TRequest extends AnyActionRequest> =
  TRequest["context"];
export type ActionRequest_GetOk<TActionRequest extends AnyActionRequest> =
  Result_InferOK<ActionRequest_GetResult<TActionRequest>>;
export type ActionRequest_GetError<TActionRequest extends AnyActionRequest> =
  Result_InferError<ActionRequest_GetResult<TActionRequest>>;
export type ActionRequest_GetResult<TActionRequest extends AnyActionRequest> =
  TActionRequest["result"];

export type ActionResponder<TRequest extends AnyActionRequest> = {
  next(): ActionRequest<
    ActionRequest_GetContext<TRequest>,
    ActionRequest_GetOk<TRequest>,
    ActionRequest_GetError<TRequest>
  >;
  next<TAdditionalContext extends GenericObject>(
    context: TAdditionalContext,
  ): ActionRequest<
    MergeContexts<ActionRequest_GetContext<TRequest>, TAdditionalContext>,
    ActionRequest_GetOk<TRequest>,
    ActionRequest_GetError<TRequest>
  >;
  ok<TResult extends GenericObject>(
    result: TResult,
  ): ActionRequest<never, TResult, never>;
  error<TError>(error: TError): ActionRequest<never, never, TError>;
};

export type ActionHandler<
  TIn extends AnyActionRequest,
  TOut extends AnyActionRequest,
  TMetadata = never,
> = {
  (request: TIn, responder: ActionResponder<TIn>): Promise<TOut>;
  [metadata]?: TMetadata;
};

export type ActionCreator<
  TCurrent extends AnyActionRequest,
  TMetadata = never,
> = ServerAction_WithMetadata<TCurrent, TMetadata> & {
  use<TNext extends AnyActionRequest, THandlerMetadata = never>(
    handler: ActionHandler<TCurrent, TNext, THandlerMetadata>,
  ): ActionCreator<
    ActionRequest<
      MergeContexts<
        ActionRequest_GetContext<TCurrent>,
        ActionRequest_GetContext<TNext>
      >,
      ActionRequest_GetOk<TNext>,
      ActionRequest_GetError<TCurrent> | ActionRequest_GetError<TNext>
    >,
    TMetadata | THandlerMetadata
  >;
};

export type ActionCreator_GetRequest<
  TCreator extends ActionCreator<AnyActionRequest>,
> = TCreator extends ActionCreator<infer TRequest> ? TRequest : never;

export function createAction(): ActionCreator<ActionRequest>;
export function createAction<TContext extends GenericObject>(
  defaultContext: TContext,
): ActionCreator<ActionRequest<TContext>>;
export function createAction(defaultContext?: GenericObject): unknown {
  defaultContext = defaultContext ?? {};
  const handlers: Array<ActionHandler<AnyActionRequest, AnyActionRequest>> = [];
  const serverAction: ActionCreator<AnyActionRequest> = async (
    previous: AnyActionRequest["previous"],
    formData: FormData,
  ) => {
    const request: AnyActionRequest = {
      formData,
      context: defaultContext,
      previous,
      result: okResult(undefined),
    };

    const { result } = await runHandlers(handlers, request);

    return result;
  };

  serverAction.use = ((
    handler: ActionHandler<AnyActionRequest, AnyActionRequest>,
  ): ActionCreator<AnyActionRequest> => {
    handlers.push(handler);
    return serverAction;
  }) as ActionCreator<AnyActionRequest>["use"];

  return serverAction;
}

async function runHandlers(
  handlers: Array<ActionHandler<AnyActionRequest, AnyActionRequest>>,
  initialRequest: AnyActionRequest,
) {
  let currentPosition = 0;
  let request = initialRequest;
  const next = async (additionalContext: GenericObject) => {
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

    return await handlers[currentPosition++]!(request, {
      next,
      ok,
      error,
    } as unknown as ActionResponder<AnyActionRequest>);
  };

  const ok = (result: GenericObject) => {
    return {
      ...request,
      result: okResult(result),
    };
  };

  function error(e: unknown) {
    return {
      ...request,
      result: errorResult(e),
    };
  }

  return await next({});
}
