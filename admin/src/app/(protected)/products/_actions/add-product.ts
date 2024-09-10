"use server";

import { z } from "zod";
import { formAction } from "~/server/action-rpc/forms/form-action";
import { rpcClient } from "~/server/rpc-client";

const AddProductSchema = z.object({
  name: z.string().min(1),
  price: z.number().min(1),
  tastingNotes: z.string().min(1),
});

export const addProduct = rpcClient.action(
  formAction(AddProductSchema, async function () {
    return "ok";
  }),
);
