import { transform } from '..';
import { PureStream, PureStreamOptions } from '../PureStream';
import { OrPromiseLike } from '../meta';

/**
 * Apply the given `method` to each value in the stream.
 */
export function map<T, R>(
  method: (this: PureStream<T, R>, value: T, index: number) => OrPromiseLike<R>,
  options: PureStreamOptions = {}
): PureStream<T, R> {
  let index = 0;
  return transform(async function (chunk, push) {
    const result = await method.call(this, chunk, index++);
    push(result);
  }, options);
}
