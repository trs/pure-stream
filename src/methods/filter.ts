import { OrPromiseLike } from '../meta';
import { TransformTyped, TransformTypedOptions } from '../types';
import { transform } from '..';

export function filter<T>(
  method: (chunk: T, encoding: string) => OrPromiseLike<boolean>,
  options: TransformTypedOptions<T, T> = {}
): TransformTyped<T, T> {
  return transform(async (chunk, encoding, push) => {
    const take = await method(chunk, encoding);
    if (take) push(chunk, encoding);
  }, options);
}
