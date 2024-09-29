import { publicRpcClient } from "~/server/client/rpc-client";
import {
  type UseHandlerArgs,
  type UseHandler,
  type UseHandlerContext,
} from "../actions";
import { type GenericObject } from "../types";

export function delay<TContext extends GenericObject>(ms: number) {
  return async function* (
    _: UseHandlerArgs<unknown, TContext>,
    { next }: UseHandlerContext<TContext>,
  ) {
    await new Promise((resolve) => setTimeout(resolve, ms));
    return yield* next();
  };
}

const x = publicRpcClient
  .use(async function* (_, { next }) {
    return yield* next({ one: 1 });
    // return yield* next({ one: 1 });
  })
  .use(delay(2500))
  .action(async function (_, { context }) {
    return context;
  });
