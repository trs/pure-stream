import { OrPromiseLike } from '../meta';
import { transform } from '..';
import { PureStream, PureStreamOptions } from '../PureStream';

export function chunkMap<T, R>(
  size: number,
  method: (this: PureStream<T, R>, value: T[], index: number) => OrPromiseLike<R>,
  options: PureStreamOptions<T, R> = {}
): PureStream<T, R> {
  let index = 0;
  let chunk: T[] = [];

  return transform(
    async function (item, push) {
      chunk.push(item);
      if (chunk.length >= size) {
        const result = await method.call(this, chunk, index++);
        push(result);
        chunk = [];
      }
    },
    async function (push) {
      if (chunk.length > 0) {
        const result = await method.call(this, chunk, index++);
        push(result);
        chunk = [];
      }
    },
    options
  );
}
