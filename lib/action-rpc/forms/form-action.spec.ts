import { type infer as Infer, z } from "zod";
import { initActionFactory } from "../actions";
import { formAction, type ValidationErrors } from "./form-action";
import {
  type Result_InferError,
  type Result_InferOK,
} from "@nataliebasille/typescript-utils/functional/result";
import { expectTypeOf } from "expect-type";

describe("form action", () => {
  describe("typings", () => {
    const schema = z.object({
      name: z.string(),
      address: z.object({
        street: z.string(),
        city: z.string(),
        zipCode: z.string(),
      }),
      email: z.string().email(),
      books: z.array(z.object({ title: z.string(), author: z.string() })),
    });

    it("should infer input in action", () => {
      initActionFactory().action(
        formAction(schema, (input) => {
          expectTypeOf(input).toEqualTypeOf<Infer<typeof schema>>;
          return Promise.resolve("");
        }),
      );
    });

    it("should infer context", () => {
      initActionFactory()
        .use(async function* (_, { next }) {
          return yield* next({
            one: "test",
            two: 2,
            three: true,
          });
        })
        .action(
          formAction(schema, (_, { context }) => {
            expectTypeOf(context).toEqualTypeOf<{
              one: string;
              two: number;
              three: boolean;
            }>();
            return Promise.resolve("done");
          }),
        );
    });

    it("should have inferred validation error in output", () => {
      const action = initActionFactory().action(
        formAction(schema, () => {
          return Promise.resolve("ok");
        }),
      );

      type Error = Result_InferError<Awaited<ReturnType<typeof action>>>;
      expectTypeOf<Error>().toEqualTypeOf<{
        code: "validation_error";
        data: ValidationErrors<Infer<typeof schema>>;
      }>();
    });

    it("should infer result in output", () => {
      const action = initActionFactory().action(
        formAction(schema, () => {
          return Promise.resolve("ok" as const);
        }),
      );

      type Ok = Result_InferOK<Awaited<ReturnType<typeof action>>>;
      expectTypeOf<Ok>().toEqualTypeOf<"ok">();
    });
  });
});
