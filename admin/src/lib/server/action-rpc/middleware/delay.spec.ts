import { expectTypeOf } from "expect-type";
import { initActionFactory } from "../actions";
import { delay } from "./delay";

describe("delay", () => {
  describe("typings", () => {
    it("should allow the context from previous handlers to be inferred in action", () => {
      initActionFactory()
        .use(async function* (_, { next }) {
          return yield* next({
            one: 1,
            two: "two",
            three: true,
          });
        })
        .use(delay(1))
        .action(async function (_, { context }) {
          expectTypeOf(context).toEqualTypeOf<{
            one: number;
            two: string;
            three: boolean;
          }>();
          return Promise.resolve("done");
        });
    });

    it("should allow the context from previous handlers to be inferred in middleware", () => {
      initActionFactory()
        .use(async function* (_, { next }) {
          return yield* next({
            one: 1,
            two: "two",
            three: true,
          });
        })
        .use(delay(1))
        .use(async function* ({ context }) {
          expectTypeOf(context).toEqualTypeOf<{
            one: number;
            two: string;
            three: boolean;
          }>();
          return Promise.resolve("done");
        });
    });
  });
});
