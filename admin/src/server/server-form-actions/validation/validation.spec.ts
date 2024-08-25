import { z } from "zod";
import { createAction } from "../../action.generators";
import { validation } from "./validation";
import { expectTypeOf } from "expect-type";

describe("validation", () => {
  describe("typings", () => {
    it("should infer parsed result on context in next handler", () => {
      createAction()
        .use(validation(z.object({ one: z.string() })))
        .use(async function* ({ context }, { next }) {
          expectTypeOf(context).toEqualTypeOf<{
            data: { one: string };
          }>();

          return yield* next({
            one: "one",
          });
        });
    });

    it("should allow combining contexts from multiple handlers", () => {
      createAction()
        .use(async function* (_, { next }) {
          return yield* next({
            one: 1,
            two: "two",
          });
        })
        .use(validation(z.object({ prop: z.string() })))
        .use(async function* (_, { next }) {
          return yield* next({
            one: "one",
          });
        })
        .use(async function* ({ context }, { next }) {
          expectTypeOf(context).toEqualTypeOf<{
            one: string;
            two: string;
            data: { prop: string };
          }>();

          return yield* next({
            one: "one",
          });
        });
    });
  });
});
