import { expectTypeOf } from 'expect-type';
import { createAction } from './actions';
import { hook } from './hook';
import { type GenericObject } from './types';
import { ok as okResult } from '@nataliebasille/typescript-utils/functional/result';

describe('hook', () => {
  it('should call the next handler', async () => {
    const fn = jest.fn();
    const action = createAction()
      .use(
        hook<{ one: string; two: number }>(async (_, { next }) => {
          return await next({ one: 'one', two: 2 });
        }),
      )
      .use(async ({ context }, { ok }) => {
        fn();
        expect(context).toEqual({ one: 'one', two: 2 });

        return ok({ ok: true });
      });

    await action(undefined, createMockFormData());
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should call the next handler from middle of hook', async () => {
    const fn = jest.fn();
    const action = createAction()
      .use(
        hook<{ one: string; two: number }, { ok: true }>(
          async (_, { next }) => {
            await next({ one: 'one', two: 2 });
            expect(fn).toHaveBeenCalledTimes(1);
            return { ok: true };
          },
        ),
      )
      .use(async ({ context }, { ok }) => {
        fn();
        expect(context).toEqual({ one: 'one', two: 2 });

        return ok({ ok: true });
      });

    const result = await action(undefined, createMockFormData());
    expect(result).toEqual(okResult({ ok: true }));
    expect(fn).toHaveBeenCalledTimes(1);
  });

  describe('typings', () => {
    it('should infer the context for the next handler', () => {
      createAction()
        .use(
          hook<{ one: string; two: number }>(async (req, { next }) => {
            return await next({ one: 'one', two: 2 });
          }),
        )
        .use(async ({ context }, { ok }) => {
          expectTypeOf(context).toEqualTypeOf<{ one: string; two: number }>();
          return ok({ ok: true });
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
