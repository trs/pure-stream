import { OrPromiseLike } from '../meta';
import { transform } from '..';
import { PureStream, PureStreamOptions } from '../PureStream';

export function filter<T>(
  method: (this: PureStream<T, T>, value: T, index: number) => OrPromiseLike<boolean>,
  options: PureStreamOptions<T, T> = {}
): PureStream<T, T> {
  let index = 0;
  return transform(async function (chunk, push) {
    const take = await method.call(this, chunk, index++);
    if (take) push(chunk);
  }, options);
}
