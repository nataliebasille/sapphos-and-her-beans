import { db, schema } from "@db";
import {
  type AnyNextResult,
  initActionFactory,
  runToCompletion,
} from "../../lib/server/action-rpc";
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
