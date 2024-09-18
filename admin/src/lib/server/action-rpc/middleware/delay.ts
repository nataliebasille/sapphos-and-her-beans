import { type UseHandlerContext } from "../actions";
import { type GenericObject } from "../types";

export function delay<TContext extends GenericObject>(ms: number) {
  return async function* (_: unknown, { next }: UseHandlerContext<TContext>) {
    await new Promise((resolve) => setTimeout(resolve, ms));
    return yield* next();
  };
}
