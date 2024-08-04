import { expectTypeOf } from 'expect-type';
import { type EmptyObject, type MergeContexts } from './types';

describe('helpers', () => {
  describe('MergeContexts', () => {
    it('should merge two EmptyObjects as EmptyObject', () => {
      type T = MergeContexts<EmptyObject, EmptyObject>;
      expectTypeOf<T>().toEqualTypeOf<EmptyObject>();
    });

    it('should take the type of the second object when merging two objects with overlapping keys', () => {
      type T = MergeContexts<{ one: number }, { one: string }>;
      expectTypeOf<T>().toEqualTypeOf<{ one: string }>();
    });

    it('should create a new object with all the keys from both objects', () => {
      type T = MergeContexts<{ one: number }, { two: string }>;
      expectTypeOf<T>().toEqualTypeOf<{ one: number; two: string }>();
    });

    it('should merge an object with a EmptyObject', () => {
      type T = MergeContexts<EmptyObject, { one: number }>;
      expectTypeOf<T>().toEqualTypeOf<{ one: number }>();
    });

    it('should work with nested merges', () => {
      type T = MergeContexts<
        MergeContexts<{ one: number }, { two: { three: string } }>,
        { four: boolean }
      >;

      expectTypeOf<T>().toEqualTypeOf<{
        one: number;
        two: { three: string };
        four: boolean;
      }>();
    });
  });
});
