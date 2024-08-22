/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  type Result_Error,
  type Result_Ok,
  ok as okResult,
  error as errorResult,
} from "@nataliebasille/typescript-utils/functional/result";
import { expectTypeOf } from "expect-type";
import {
  type ActionCreator_GetRequest,
  type ActionRequest,
  type ActionRequest_GetContext,
  type ActionRequest_GetError,
  type ActionRequest_GetOk,
  type ActionRequest_GetResult,
  type ActionResponder,
  createAction,
} from "./actions";
import { type GenericObject, type EmptyObject } from "./types";

describe("actions", () => {
  it("should run a single handler that returns ok", async () => {
    const action = createAction().use(async (_, { ok }) => {
      return ok({
        value: "hello",
      });
    });

    const result = await action(undefined, createMockFormData());
    expect(result).toEqual(okResult({ value: "hello" }));
  });

  it("should run a single handler that returns error", async () => {
    const action = createAction().use(async (_, { error }) => {
      return error("error");
    });

    const result = await action(undefined, createMockFormData());
    expect(result).toEqual(errorResult("error"));
  });

  it("should run multiple handlers", async () => {
    const fn = jest.fn();

    const action = createAction()
      .use(async (_, { next }) => {
        fn();
        return next({
          one: 1,
          two: "two",
          three: true,
        });
      })
      .use(async (_, { next }) => {
        fn();
        return next({
          one: "one",
          two: 2,
          four: "this is four",
        });
      })
      .use(async (_, { ok }) => {
        fn();
        return ok({
          value: "hello",
        });
      });

    await action(undefined, createMockFormData());

    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("should pass context into next handler", async () => {
    const action = createAction()
      .use(async (_, { next }) => {
        return next({
          one: 1,
          two: "two",
          three: true,
        });
      })
      .use(async ({ context }, { next }) => {
        expect(context).toEqual({
          one: 1,
          two: "two",
          three: true,
        });
        return next({
          one: "one",
          two: 2,
          four: "this is four",
        });
      })
      .use(async ({ context }, { ok }) => {
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

    const result = await action(undefined, createMockFormData());
    expect(result).toEqual(okResult({ value: "hello" }));
  });

  describe("typings", () => {
    it("should have an empty context when first created", () => {
      createAction().use(({ context }, { ok }) => {
        expectTypeOf(context).toEqualTypeOf<EmptyObject>();
        return Promise.resolve(ok({}));
      });
    });

    it("should have additional context when next is called", () => {
      createAction()
        .use((_, { next }) => {
          return Promise.resolve(
            next({
              one: 1,
              two: "two",
              three: true,
            }),
          );
        })
        .use(({ context }, { ok }) => {
          expectTypeOf(context).toEqualTypeOf<{
            one: number;
            two: string;
            three: boolean;
          }>();
          return Promise.resolve(ok({}));
        });
    });

    it("should combine contexts from multiple handlers", () => {
      createAction()
        .use((_, { next }) => {
          return Promise.resolve(
            next({
              one: 1,
              two: "two",
              three: true,
            }),
          );
        })
        .use((_, { next }) => {
          return Promise.resolve(
            next({
              one: "string",
              two: "another string",
              four: false,
            }),
          );
        })
        .use(({ context }, { ok }) => {
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
      const action = createAction().use(async (_, { error }) => {
        const somebool = true;

        if (somebool) {
          return error("error for somebool" as const);
        }

        return error("error for not somebool" as const);
      });

      expectTypeOf<
        ActionRequest_GetError<ActionCreator_GetRequest<typeof action>>
      >().toEqualTypeOf<"error for somebool" | "error for not somebool">();
    });

    it("should set result type", () => {
      const action = createAction().use(async (_, { ok }) => {
        return ok({
          value: "hello",
        });
      });

      expectTypeOf<
        ActionRequest_GetResult<ActionCreator_GetRequest<typeof action>>
      >().toEqualTypeOf<
        Result_Ok<{
          value: string;
        }>
      >();
    });

    it("should preserve error types when using middleware", () => {
      const action = createAction()
        .use(async (_, { next, error }) => {
          const somebool = true;

          if (somebool) {
            return error("error" as const);
          }

          return next();
        })
        .use(async (_, { ok }) => {
          return ok({
            value: "hello",
          });
        });

      type Error = ActionRequest_GetError<
        ActionCreator_GetRequest<typeof action>
      >;
      expectTypeOf<Error>().toEqualTypeOf<"error">();
    });

    it("should combine contexts with errors in same handler", () => {
      const x = async (_, { next, error }: ActionResponder<ActionRequest>) => {
        const somebool = true;

        if (somebool) {
          return error("error for somebool" as const);
        }

        return next({
          one: 1,
          two: "two",
          three: true,
        });
      };

      const action = createAction().use(async (_, { next, error }) => {
        const somebool = true;

        if (somebool) {
          return error("error for somebool" as const);
        }

        return next({
          one: 1,
          two: "two",
          three: true,
        });
      });

      expectTypeOf<
        ActionRequest_GetError<ActionCreator_GetRequest<typeof action>>
      >().toEqualTypeOf<"error for somebool">();

      type Context = ActionRequest_GetContext<
        ActionCreator_GetRequest<typeof action>
      >;

      expectTypeOf<Context>().toEqualTypeOf<{
        one: number;
        two: string;
        three: boolean;
      }>();
    });

    it("should combine ok and error types", () => {
      const action = createAction().use(async (_, { ok, error }) => {
        const somebool = true;

        if (somebool) {
          return error("error" as const);
        }

        return ok({
          value: "hello",
        });
      });

      type Error = ActionRequest_GetError<
        ActionCreator_GetRequest<typeof action>
      >;
      expectTypeOf<Error>().toEqualTypeOf<"error">();

      type Result = ActionRequest_GetOk<
        ActionCreator_GetRequest<typeof action>
      >;
      expectTypeOf<Result>().toEqualTypeOf<{
        value: string;
      }>();
    });

    describe("ActionRequest", () => {
      it("result should default to ok(undefined)", () => {
        expectTypeOf<ActionRequest_GetResult<ActionRequest>>().toEqualTypeOf<
          Result_Ok<undefined>
        >();
      });

      it("should be error(error) when ok is never an error is defined", () => {
        type T = ActionRequest<EmptyObject, never, string>;
        expectTypeOf<ActionRequest_GetResult<T>>().toEqualTypeOf<
          Result_Error<string>
        >();
      });
    });
  });
});

class MockFormData {
  data: GenericObject = {};

  constructor() {
    this.data = {};
  }

  append(key, value) {
    this.data[key] = value;
  }

  get(key) {
    return this.data[key];
  }

  getAll() {
    return this.data;
  }

  delete(key) {
    delete this.data[key];
  }

  has(key) {
    return key in this.data;
  }
}

function createMockFormData() {
  return new MockFormData() as unknown as FormData;
}
