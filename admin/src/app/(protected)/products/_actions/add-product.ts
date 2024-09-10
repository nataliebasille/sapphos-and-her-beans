"use server";

import { z } from "zod";
import { formAction } from "~/lib/server/action-rpc/forms";
import { rpcClient } from "~/server/rpc-client";

const AddProductSchema = z.object({
  name: z.string().min(1),
  price: z.number().min(1),
  tastingNotes: z.string().min(1),
  story: z.string().min(1),
  image: z.instanceof(File).or(z.string().url()),
});

export const addProduct = rpcClient.action(
  formAction(AddProductSchema, async function () {
    return "ok";
  }),
);
