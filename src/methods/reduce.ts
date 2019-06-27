import { OrPromiseLike } from '../meta';
import { TransformTyped, TransformTypedOptions } from '../types';
import { transform } from '..';

export function reduce<T, R>(
  method: (previousValue: R, nextValue: T, encoding: string, index: number) => OrPromiseLike<R>,
  initialValue: R,
  options: TransformTypedOptions<T, R> = {}
): TransformTyped<T, R> {
  let index = 0;
  return transform<T, R>(async (chunk, encoding) => {
    initialValue = await method(initialValue, chunk, encoding, index++);
  }, (push) => {
    push(initialValue);
  }, options);
}
