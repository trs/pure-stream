import { OrPromiseLike } from '../meta';
import { TransformTyped, TransformTypedOptions } from '../types';
import { transform } from '..';

export function map<T, R>(
  method: (chunk: T, encoding: string, index: number) => OrPromiseLike<R>,
  options: TransformTypedOptions<T, R> = {}
): TransformTyped<T, R> {
  let index = 0;
  return transform(async (chunk, encoding, push) => {
    const result = await method(chunk, encoding, index++);
    push(result);
  }, options);
}
