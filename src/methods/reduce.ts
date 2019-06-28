import { OrPromiseLike } from '../meta';
import { TransformTyped, TransformTypedOptions } from '../types';
import { transform } from '..';

export function reduce<T, R>(
  method: (this: TransformTyped<T, R>, previousValue: R, nextValue: T, encoding: string, index: number) => OrPromiseLike<R>,
  initialValue: R,
  options: TransformTypedOptions<T, R> = {}
): TransformTyped<T, R> {
  let index = 0;
  return transform<T, R>(async function (chunk, encoding) {
    initialValue = await method.call(this, initialValue, chunk, encoding, index++);
  }, (push) => {
    push(initialValue);
  }, options);
}
