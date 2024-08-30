import { db, schema } from "@db";
import { type ActionRequest, type ActionResponse } from "../actions";
import { type GenericObject } from "../types";

type TransactionNext = {
  tx: Parameters<Parameters<(typeof db)["transaction"]>[0]>[0];
  schema: typeof schema;
};

export function transaction() {
  return async function* <TOk, TError, TContext extends GenericObject>(
    _: ActionRequest<TOk, TError, TContext>,
    { next }: ActionResponse<TOk, TError, TContext>,
  ) {
    const x = await db.transaction(async function (tx) {
      const result = await runToCompletion(
        next<TransactionNext>({ tx, schema }),
      );

      if (result.type === "error") {
        tx.rollback();
      }

      return result;
    });

    return x;
  };
}

async function runToCompletion<T>(generator: AsyncGenerator<T>): Promise<T> {
  let result: IteratorResult<T>;
  do {
    result = await generator.next();
  } while (!result.done);

  return result.value as T;
}
