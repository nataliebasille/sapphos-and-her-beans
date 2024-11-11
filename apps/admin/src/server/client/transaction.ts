import { db } from "@db";
import {
  type ActionError,
  type AnyNextResult,
  type NextResult,
  runToCompletion,
  type UseHandler,
  type UseHandlerContext,
} from "~/lib/server/action-rpc";
import {
  type MergeContexts,
  type GenericObject,
} from "~/lib/server/action-rpc/types";

type TransactionNext = {
  tx: Parameters<Parameters<(typeof db)["transaction"]>[0]>[0];
};

export function transaction<TContext extends GenericObject>() {
  const handler: UseHandler<
    NextResult<unknown, ActionError, MergeContexts<TContext, TransactionNext>>,
    unknown,
    TContext
  > = async function* (_: unknown, { next }: UseHandlerContext<TContext>) {
    try {
      return db.transaction(async function (tx) {
        const result = await runToCompletion(next({ tx }));

        if (!result.ok) {
          throw new RollbackTransactionError(result);
        }

        return result;
      });
    } catch (e: unknown) {
      if (e instanceof RollbackTransactionError) {
        return e.result;
      }
      throw e;
    }
  };

  return handler;
}

class RollbackTransactionError extends Error {
  constructor(readonly result: AnyNextResult) {
    super();
  }
}
