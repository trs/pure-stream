import { transform } from '..';
import { PureStream, PureStreamOptions } from '../PureStream';
import { OrPromiseLike } from '../meta';

export function map<T, R>(
  method: (this: PureStream<T, R>, value: T, index: number) => OrPromiseLike<R>,
  options: PureStreamOptions<T, R> = {}
): PureStream<T, R> {
  let index = 0;
  return transform(async function (chunk, push) {
    const result = await method.call(this, chunk, index++);
    push(result);
  }, options);
}
