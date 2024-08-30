import {
  error as errorResult,
  ok as okResult,
  type Result_InferError,
  type Result_InferOK,
  type Result_Ok,
} from "@nataliebasille/typescript-utils/functional/result";
import { expectTypeOf } from "expect-type";
import {
  type ActionFactory,
  createAction,
  FormAction,
  type FormAction_GetMetadata,
} from "./actions";
import { type EmptyObject, type GenericObject } from "./types";
import { ok } from "assert";

describe("actions", () => {
  describe("logic", () => {
    it("should run a single handler that returns ok", async () => {
      const action = createAction().use(async function* (_, { ok }) {
        return ok({
          value: "hello",
        });
      });

      const result = await action(
        okResult({ value: "" }),
        createMockFormData(),
      );
      expect(result).toEqual(okResult({ value: "hello" }));
    });

    it("should run a single handler that returns error", async () => {
      const action = createAction().use(async function* (_, { error }) {
        return error("error");
      });

      const result = await action(
        errorResult("this is an error"),
        createMockFormData(),
      );
      expect(result).toEqual(errorResult("error"));
    });

    it("should run multiple handlers", async () => {
      const fn = jest.fn();

      const action = createAction()
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
        .use(async function* (_, { ok }) {
          fn();
          return ok({
            value: "hello",
          });
        });

      await action(okResult({ value: "" }), createMockFormData());

      expect(fn).toHaveBeenCalledTimes(3);
    });

    it("should pass context into next handler", async () => {
      const action = createAction()
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
        .use(async function* ({ context }, { ok }) {
          expect(context).toEqual({
            one: "one",
            two: 2,
            three: true,
            four: "this is four",
          });
          return ok({
            value: "hello",
          });
        });

      const result = await action(
        okResult({ value: "" }),
        createMockFormData(),
      );
      expect(result).toEqual(okResult({ value: "hello" }));
    });

    it("should allow yielding to next handlers multiple times", async () => {
      const fn = jest.fn();
      const action = createAction()
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
        .use(async function* ({ context }, { ok }) {
          fn();
          return ok({
            value: context.four,
          });
        });

      const result = await action(
        okResult({ value: "" }),
        createMockFormData(),
      );
      expect(fn).toHaveBeenCalledTimes(2);
      expect(result).toEqual(okResult({ value: "this is four" }));
    });
  });

  describe("typings", () => {
    it("should have an empty context when first created", () => {
      createAction().use(async function* ({ context }, { ok }) {
        expectTypeOf(context).toEqualTypeOf<EmptyObject>();
        return Promise.resolve(ok({}));
      });
    });

    it("should have additional context when next is called", () => {
      createAction()
        .use(async function* (_, { next }) {
          return yield* next({
            one: 1,
            two: "two",
            three: true,
          });
        })
        .use(async function* ({ context }, { ok }) {
          expectTypeOf(context).toEqualTypeOf<{
            one: number;
            two: string;
            three: boolean;
          }>();
          return Promise.resolve(ok({}));
        });
    });

    it("should have additional context when next or ok is called", () => {
      createAction()
        .use(async function* (_, { next, ok }) {
          const somebool = true;

          if (somebool) {
            return ok("ok");
          }

          return yield* next({
            one: 1,
            two: "two",
            three: true,
          });
        })
        .use(async function* ({ context }, { error }) {
          expectTypeOf(context).toEqualTypeOf<{
            one: number;
            two: string;
            three: boolean;
          }>();
          return Promise.resolve(error("error"));
        });
    });

    it("should have additional context when next or error is called", () => {
      createAction()
        .use(async function* (_, { next, error }) {
          const somebool = true;

          if (somebool) {
            return error("error");
          }

          return yield* next({
            one: 1,
            two: "two",
            three: true,
          });
        })
        .use(async function* ({ context }, { error }) {
          expectTypeOf(context).toEqualTypeOf<{
            one: number;
            two: string;
            three: boolean;
          }>();
          return Promise.resolve(error("error"));
        });
    });

    it("should combine contexts from multiple handlers", () => {
      createAction()
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
        .use(async function* ({ context }, { ok }) {
          expectTypeOf(context).toEqualTypeOf<{
            one: string;
            two: string;
            three: boolean;
            four: boolean;
          }>();
          return Promise.resolve(ok({}));
        });
    });

    it("should union conditional errors", () => {
      const action = createAction().use(async function* (_, { error }) {
        const somebool = true;

        if (somebool) {
          return error("error for somebool" as const);
        }

        return error("error for not somebool" as const);
      });

      type Error = Result_InferError<Awaited<ReturnType<typeof action>>>;
      expectTypeOf<Error>().toEqualTypeOf<
        "error for somebool" | "error for not somebool"
      >();
    });

    it("should set result type", () => {
      const action = createAction().use(async function* (_, { ok }) {
        return ok({
          value: "hello",
        });
      });

      type Result = Awaited<ReturnType<typeof action>>;
      expectTypeOf<Result>().toEqualTypeOf<
        Result_Ok<{
          value: string;
        }>
      >();
    });

    it("should preserve error types when using middleware", () => {
      const action = createAction()
        .use(async function* (_, { next, error }) {
          const somebool = true;

          if (somebool) {
            return error("error" as const);
          }

          return yield* next();
        })
        .use(async function* (_, { ok }) {
          return ok({
            value: "hello",
          });
        });

      type Error = Result_InferError<Awaited<ReturnType<typeof action>>>;
      expectTypeOf<Error>().toEqualTypeOf<"error">();
    });

    it("should combine contexts with errors in same handler", () => {
      const action = createAction().use(async function* (_, { next, error }) {
        const somebool = true;

        if (somebool) {
          return error("error for somebool" as const);
        }

        return yield* next({
          one: 1,
          two: "two",
          three: true,
        });
      });

      type Error = Result_InferError<Awaited<ReturnType<typeof action>>>;
      expectTypeOf<Error>().toEqualTypeOf<"error for somebool">();

      type Context =
        typeof action extends ActionFactory<never, any, infer TContext>
          ? TContext
          : never;

      expectTypeOf<Context>().toEqualTypeOf<{
        one: number;
        two: string;
        three: boolean;
      }>();
    });

    it("should combine ok and error types", () => {
      const action = createAction().use(async function* (_, { ok, error }) {
        const somebool = true;

        if (somebool) {
          return error("error" as const);
        }

        return ok({
          value: "hello",
        });
      });

      type Error = Result_InferError<Awaited<ReturnType<typeof action>>>;
      expectTypeOf<Error>().toEqualTypeOf<"error">();

      type Ok = Result_InferOK<Awaited<ReturnType<typeof action>>>;
      expectTypeOf<Ok>().toEqualTypeOf<{
        value: string;
      }>();
    });

    it("can infer context when yield* next without returning that result", () => {
      createAction()
        .use(async function* (_, { next, ok }) {
          yield* next({
            one: 1,
            two: "two",
            three: true,
          });

          return ok("done");
        })
        .use(async function* ({ context }, { ok }) {
          expectTypeOf(context).toEqualTypeOf<{
            one: number;
            two: string;
            three: boolean;
          }>();
          return Promise.resolve(ok({}));
        });
    });

    it("infer context when yielding multiple times", async () => {
      createAction()
        .use(async function* (_, { next }) {
          yield* next({
            one: 1,
            two: "two",
            three: true,
          });

          yield* next({
            one: "one",
            two: 2,
            four: "this is four",
          });

          return yield* next({
            one: false,
            two: "two",
            four: 4,
          });
        })
        .use(async function* ({ context }, { ok }) {
          expectTypeOf(context).toEqualTypeOf<{
            one: number | string | boolean;
            two: number | string;
            three?: boolean;
            four?: string | number;
          }>();
          return Promise.resolve(ok({}));
        });
    });
  });

  describe("FormAction_GetMetadata", () => {
    it("final context on action is the same as next", () => {
      const action = createAction().use(async function* (_, { next, ok }) {
        return yield* next({
          one: 1,
          two: "two",
          three: true,
        });
      });

      type Context = FormAction_GetMetadata<typeof action>;
      expectTypeOf<Context>().toEqualTypeOf<{
        one: number;
        two: string;
        three: boolean;
      }>();
    });

    it("final context on action is the same as next when ok is returned", () => {
      const action = createAction().use(async function* (_, { next, ok }) {
        yield* next({
          one: 1,
          two: "two",
          three: true,
        });

        return ok({
          value: "hello",
        });
      });

      type Context = FormAction_GetMetadata<typeof action>;
      expectTypeOf<Context>().toEqualTypeOf<{
        one: number;
        two: string;
        three: boolean;
      }>();
    });

    it("final context on action is the same as next when error is returned", () => {
      const action = createAction().use(async function* (_, { next, error }) {
        yield* next({
          one: 1,
          two: "two",
          three: true,
        });

        return error("error");
      });

      type Context = FormAction_GetMetadata<typeof action>;
      expectTypeOf<Context>().toEqualTypeOf<{
        one: number;
        two: string;
        three: boolean;
      }>();
    });

    it("final context is combined from multiple handlers", () => {
      const action = createAction()
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
        });

      type Context = FormAction_GetMetadata<typeof action>;
      expectTypeOf<Context>().toEqualTypeOf<{
        one: string;
        two: string;
        three: boolean;
        four: boolean;
      }>();
    });

    it("final context can be inferred when second handler returns ok", () => {
      const action = createAction()
        .use(async function* (_, { next }) {
          return yield* next({
            one: 1,
            two: "two",
            three: true,
          });
        })
        .use(async function* (_, { ok }) {
          return ok({
            value: "hello",
          });
        });

      type Context = FormAction_GetMetadata<typeof action>;
      expectTypeOf<Context>().toEqualTypeOf<{
        one: number;
        two: string;
        three: boolean;
      }>();
    });
  });
});

class MockFormData {
  data: GenericObject = {};

  constructor() {
    this.data = {};
  }

  append(key: string | number, value: unknown) {
    this.data[key] = value;
  }

  get(key: string | number) {
    return this.data[key];
  }

  getAll() {
    return this.data;
  }

  delete(key: string | number) {
    delete this.data[key];
  }

  has(key: string) {
    return key in this.data;
  }
}

function createMockFormData() {
  return new MockFormData() as unknown as FormData;
}
