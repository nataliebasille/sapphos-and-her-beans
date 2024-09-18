import { db, schema } from "@db";
import {
  type AnyNextResult,
  initActionFactory,
  runToCompletion,
} from "../lib/server/action-rpc";
import { getSession } from "@auth0/nextjs-auth0";

export const publicRpcClient = initActionFactory().use(async function* (
  _,
  { next },
) {
  const session = await getSession();
  return yield* next({ session });
});

export const protectedRpcClient = publicRpcClient.use(async function* (
  { context: { session } },
  { next, error },
) {
  if (!session) {
    return error("unauthorized");
  }

  return yield* next();
});

// .use(async function* (_, { next }) {
//   try {
//     return db.transaction(async function (tx) {
//       const result = await runToCompletion(next({ tx, schema }));

//       if (!result.ok) {
//         throw new RollbackTransactionError(result);
//       }

//       return result;
//     });
//   } catch (e: unknown) {
//     if (e instanceof RollbackTransactionError) {
//       return e.result;
//     }
//     throw e;
//   }
// });

class RollbackTransactionError extends Error {
  constructor(readonly result: AnyNextResult) {
    super();
  }
}
