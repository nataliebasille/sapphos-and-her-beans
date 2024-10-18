export async function runToCompletion<T>(
  generator: AsyncGenerator<T>,
): Promise<T> {
  let result: IteratorResult<T>;
  do {
    result = await generator.next();
  } while (!result.done);

  return result.value as T;
}
