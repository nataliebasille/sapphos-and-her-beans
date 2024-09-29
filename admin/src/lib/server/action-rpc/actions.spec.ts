import {
  ok,
  type Result_Error,
  type Result_Ok,
} from "@nataliebasille/typescript-utils/functional/result";
import { expectTypeOf } from "expect-type";
import {
  initActionFactory,
  type ActionFactory_GetContext,
  type ActionFactory_GetOut,
  type Action_GetInput,
  type Action_GetOutput,
} from "./actions";
import { type EmptyObject } from "./types";

describe("actions", () => {
  describe("logic", () => {
    it("should run a action handler that returns value", async () => {
      const action = initActionFactory().action(async function () {
        return "ok";
      });

      const result = await action();
      expect(result).toEqual(ok("ok"));
    });

    it("should run multiple handlers", async () => {
      const fn = jest.fn();

      const action = initActionFactory()
        .use(async function* (_, { next }) {
          fn();
          return yield* next({
            one: 1,
            two: "two",
            three: true,
          });
        })
        .use(async function* (_, { next }) {
          fn();
          return yield* next({
            one: "one",
            two: 2,
            four: "this is four",
          });
        })
        .use(async function* (_, { next }) {
          fn();
          return yield* next({
            one: false,
            two: "two",
            five: "five",
          });
        })
        .action(async function () {
          return "hello";
        });

      await action();

      expect(fn).toHaveBeenCalledTimes(3);
    });

    it("should pass context into next handler", async () => {
      const action = initActionFactory()
        .use(async function* (_, { next }) {
          return yield* next({
            one: 1,
            two: "two",
            three: true,
          });
        })
        .use(async function* ({ context }, { next }) {
          expect(context).toEqual({
            one: 1,
            two: "two",
            three: true,
          });
          return yield* next({
            one: "one",
            two: 2,
            four: "this is four",
          });
        })
        .action(async function (_, { context }) {
          expect(context).toEqual({
            one: "one",
            two: 2,
            three: true,
            four: "this is four",
          });
          return { value: "hello" };
        });

      const result = await action();
      expect(result).toEqual(ok({ value: "hello" }));
    });

    it("should allow yielding to next handlers multiple times", async () => {
      const fn = jest.fn();
      const action = initActionFactory()
        .use(async function* (_, { next }) {
          yield* next({
            one: 1,
            two: "two",
            three: true,
          });

          return yield* next({
            one: "one",
            two: 2,
            four: "this is four",
          });
        })
        .action(async function (_, { context }) {
          fn();
          return context.four;
        });

      const result = await action();
      expect(fn).toHaveBeenCalledTimes(2);
      expect(result).toEqual(ok("this is four"));
    });
  });

  describe("typings", () => {
    it("middleware should have an empty context when first created", () => {
      initActionFactory().action(async function (_, { context }) {
        expectTypeOf(context).toEqualTypeOf<EmptyObject>();
        return Promise.resolve(ok({}));
      });
    });

    it("middleware should have additional context when next is called", () => {
      initActionFactory()
        .use(async function* (_, { next }) {
          return yield* next({
            one: 1,
            two: "two",
            three: true,
          });
        })
        .action(async function (_, { context }) {
          expectTypeOf(context).toEqualTypeOf<{
            one: number;
            two: string;
            three: boolean;
          }>();
          return Promise.resolve([]);
        });
    });

    it("middleware should have additional context when next or value is returned", () => {
      initActionFactory()
        .use(async function* (_, { next }) {
          const somebool = true;

          if (somebool) {
            return "ok" as const;
          }

          return yield* next({
            one: 1,
            two: "two",
            three: true,
          });
        })
        .use(async function* ({ context }) {
          expectTypeOf(context).toEqualTypeOf<{
            one: number;
            two: string;
            three: boolean;
          }>();
          return Promise.resolve("result");
        });
    });

    it("middleware should have combine contexts from all middleware before", () => {
      initActionFactory()
        .use(async function* (_, { next }) {
          return yield* next({
            one: 1,
            two: "two",
            three: true,
          });
        })
        .use(async function* (_, { next }) {
          return yield* next({
            one: "string",
            two: "another string",
            four: false,
          });
        })
        .use(async function* ({ context }) {
          expectTypeOf(context).toEqualTypeOf<{
            one: string;
            two: string;
            three: boolean;
            four: boolean;
          }>();
          return Promise.resolve("done");
        });
    });

    it("should union conditional return values from midleware", () => {
      const action = initActionFactory().use(async function* () {
        const somebool = true;

        if (somebool) {
          return "value for somebool" as const;
        }

        return "value for not somebool" as const;
      });

      type Returned = ActionFactory_GetOut<typeof action>;

      expectTypeOf<Returned>().toEqualTypeOf<
        "value for somebool" | "value for not somebool"
      >();
    });

    it("should combine contexts with returned value in same handler", () => {
      const action = initActionFactory().use(async function* (_, { next }) {
        const somebool = true;

        if (somebool) {
          return "value for somebool" as const;
        }

        return yield* next({
          one: 1,
          two: "two",
          three: true,
        });
      });

      expectTypeOf<ActionFactory_GetContext<typeof action>>().toEqualTypeOf<{
        one: number;
        two: string;
        three: boolean;
      }>();

      type Out = ActionFactory_GetOut<typeof action>;
      expectTypeOf<Out>().toEqualTypeOf<"value for somebool">();
    });

    it("can infer context when yield* next without returning that result", () => {
      initActionFactory()
        .use(async function* (_, { next }) {
          yield* next({
            one: 1,
            two: "two",
            three: true,
          });

          return "done";
        })
        .use(async function* ({ context }) {
          expectTypeOf(context).toEqualTypeOf<{
            one: number;
            two: string;
            three: boolean;
          }>();
          return Promise.resolve({});
        });
    });

    it("context is inferred in action handler", () => {
      initActionFactory()
        .use(async function* (_, { next }) {
          return yield* next({
            one: 1,
            two: "two",
            three: true,
          });
        })
        .action(async (_, { context }) => {
          expectTypeOf(context).toEqualTypeOf<{
            one: number;
            two: string;
            three: boolean;
          }>();
        });
    });

    it("'ok' output from middleware is represented in action output", () => {
      const action = initActionFactory()
        .use(async function* (_) {
          return "value" as const;
        })
        .action(async (_) => {
          throw new Error("should not be called");
        });

      type Out = Action_GetOutput<typeof action>;
      expectTypeOf<Out>().toEqualTypeOf<Result_Ok<"value">>();
    });

    it("'error' output from middleware is represented in action output", () => {
      const action = initActionFactory()
        .use(async function* (_, { error }) {
          return error("error code");
        })
        .action(async (_) => {
          throw new Error("should not be called");
        });

      type Out = Action_GetOutput<typeof action>;
      expectTypeOf<Out>().toEqualTypeOf<Result_Error<{ code: "error code" }>>();
    });

    it("'ok' output from action handler is represented in action output", () => {
      const action = initActionFactory().action(async (_) => {
        return "ok" as const;
      });

      type Out = Action_GetOutput<typeof action>;
      expectTypeOf<Out>().toEqualTypeOf<Result_Ok<"ok">>();
    });

    it("'error' output from action handler is represented in action output", () => {
      const action = initActionFactory().action(async (_, { error }) => {
        return error("error code");
      });

      type Out = Action_GetOutput<typeof action>;
      expectTypeOf<Out>().toEqualTypeOf<Result_Error<{ code: "error code" }>>();
    });

    it("output type for action has combined output type from middleware and action handler", () => {
      const action = initActionFactory()
        .use(async function* (_, { next }) {
          yield* next({
            one: 1,
            two: "two",
            three: false,
          });
          return "from middleware" as const;
        })
        .action(async (_) => {
          return "from action" as const;
        });

      type Out = Action_GetOutput<typeof action>;
      expectTypeOf<Out>().toEqualTypeOf<
        Result_Ok<"from action" | "from middleware">
      >();
    });

    it("input type for action is inferred from action handler", () => {
      const action = initActionFactory().action(
        async (input: { one: number; two: string; three: boolean }) => {
          return input;
        },
      );

      type In = Action_GetInput<typeof action>;
      expectTypeOf<In>().toEqualTypeOf<{
        one: number;
        two: string;
        three: boolean;
      }>();
    });
  });
});
