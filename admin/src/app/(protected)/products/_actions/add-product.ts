"use server";

import { z } from "zod";
import { createAction } from "~/server/server-form-actions/actions";
import { validation } from "~/server/server-form-actions/hooks/validation";

export const addProduct = createAction()
  .use(
    validation(
      z.object({
        name: z.string().min(1),
        price: z.number().min(1),
        tastingNotes: z.string().min(1),
      }),
    ),
  )
  .use(async ({ context: { parsedResult } }, { ok }) => {
    console.log(parsedResult);
    return ok(parsedResult);
  });
