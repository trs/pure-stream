import { OrPromiseLike } from '../meta';
import { transform } from '..';
import { PureStream, PureStreamOptions } from '../PureStream';

export function reduce<T, R>(
  method: (this: PureStream<T, R>, previousValue: R, nextValue: T, index: number) => OrPromiseLike<R>,
  initialValue: R,
  options: PureStreamOptions<T, R> = {}
): PureStream<T, R> {
  let index = 0;
  return transform<T, R>(async function (chunk) {
    initialValue = await method.call(this, initialValue, chunk, index++);
  }, (push) => {
    push(initialValue);
  }, options);
}
