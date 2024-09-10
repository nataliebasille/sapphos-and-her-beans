import { db, schema } from "@db";
import {
  type AnyNextResult,
  initActionFactory,
  runToCompletion,
} from "./action-rpc";

export const rpcClient = initActionFactory().use(async function* (_, { next }) {
  try {
    return db.transaction(async function (tx) {
      const result = await runToCompletion(next({ tx, schema }));

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
});

class RollbackTransactionError extends Error {
  constructor(readonly result: AnyNextResult) {
    super();
  }
}
