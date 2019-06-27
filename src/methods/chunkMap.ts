import { OrPromiseLike } from '../meta';
import { TransformTyped, TransformTypedOptions } from '../types';
import { transform } from '..';

export function chunkMap<T, R>(
  size: number,
  method: (chunk: T[], index: number) => OrPromiseLike<R>,
  options: TransformTypedOptions<T, R> = {}
): TransformTyped<T, R> {
  let index = 0;
  let chunk: T[] = [];

  return transform(
    async (item, encoding, push) => {
      chunk.push(item);
      if (chunk.length >= size) {
        const result = await method(chunk, index++);
        push(result);
        chunk = [];
      }
    },
    async (push) => {
      if (chunk.length > 0) {
        const result = await method(chunk, index++);
        push(result);
        chunk = [];
      }
    },
    options
  );
}
