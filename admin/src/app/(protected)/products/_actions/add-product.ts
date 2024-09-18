"use server";

import { z } from "zod";
import { formAction } from "~/lib/server/action-rpc/forms";
import { delay } from "~/lib/server/action-rpc/middleware/delay";
import { protectedRpcClient } from "~/server/rpc-client";

const AddProductSchema = z.object({
  name: z.string().min(1),
  price: z.number().min(1),
  tastingNotes: z.string().min(1),
  story: z.string().min(1),
  image: z.string().url(),
});

export const addProduct = protectedRpcClient.use(delay(2500)).action(
  formAction(AddProductSchema, async function () {
    return "ok";
  }),
);
