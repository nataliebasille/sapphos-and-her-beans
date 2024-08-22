import {
  type Result_Error,
  error as errorResult,
} from '@nataliebasille/typescript-utils/functional/result';
import {
  type ActionRequest,
  type ActionHandler,
  type AnyActionRequest,
} from './actions';
import { type GenericObject } from './types';

export type HookNextFunction<TNext extends GenericObject = never> = [
  TNext,
] extends [never]
  ? () => Promise<AnyActionRequest>
  : (result: TNext) => Promise<AnyActionRequest>;

export type HookResponder<
  TNext extends GenericObject = never,
  TError = never,
> = {
  next: HookNextFunction<TNext>;
  error(error: TError): Result_Error<TError>;
};

export type HookHandler<
  TNext extends GenericObject = never,
  TOk extends GenericObject = never,
  TError = never,
> = (
  request: AnyActionRequest,
  response: HookResponder<TNext, TError>,
) => Promise<TOk | Result_Error<TError> | AnyActionRequest>;

export function hook<
  TNext extends GenericObject = never,
  TOk extends GenericObject = never,
  TError = never,
  TMetadata = never,
>(handler: HookHandler<TNext, TOk, TError>) {
  const hookHandler = async (request, { next, ok, error }) => {
    const result = await handler(request, {
      next: next as unknown as HookNextFunction<TNext>,
      error: (error) => errorResult(error) as Result_Error<TError>,
    });

    if ('type' in result && result.type === 'error') {
      return error(result);
    }

    if ('context' in result) {
      return result as AnyActionRequest;
    }

    return ok(result);
  };

  return hookHandler as unknown as ActionHandler<
    AnyActionRequest,
    ActionRequest<TNext, TOk, TError>,
    TMetadata
  >;
}
