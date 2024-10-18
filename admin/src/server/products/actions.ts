"use server";

import { z } from "zod";
import { formAction } from "~/lib/server/action-rpc/forms";
import { delay } from "~/lib/server/action-rpc/middleware/delay";
import { protectedRpcClient } from "~/server/client/rpc-client";
import { transaction } from "../client/transaction";
import { schema } from "@db";

const AddProductSchema = z.object({
  name: z.string().min(1),
  price: z.number().min(1),
  sizeOunces: z.number().min(1),
  tastingNotes: z.string().min(1),
  image: z.string().url(),
  story: z.string().optional(),
});

export const addProduct = protectedRpcClient.use(transaction()).action(
  formAction(
    AddProductSchema,
    async function (newProduct, { context: { tx } }) {
      const productId = (
        await tx.insert(schema.products).values({}).returning()
      )[0]?.id;

      if (!productId) {
        throw new Error("Could not insert product");
      }

      await tx.insert(schema.productVersions).values({
        productId,
        name: newProduct.name,
        price: newProduct.price,
        sizeOunces: newProduct.sizeOunces,
        tastingNotes: newProduct.tastingNotes,
        story: newProduct.story,
        image: newProduct.image,
      });

      return { productId };
    },
  ),
);
