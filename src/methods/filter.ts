import { OrPromiseLike } from '../meta';
import { TransformTyped, TransformTypedOptions } from '../types';
import { transform } from '..';

export function filter<T>(
  method: (this: TransformTyped<T, T>, chunk: T, encoding: string, index: number) => OrPromiseLike<boolean>,
  options: TransformTypedOptions<T, T> = {}
): TransformTyped<T, T> {
  let index = 0;
  return transform(async function (chunk, encoding, push) {
    const take = await method.call(this, chunk, encoding, index++);
    if (take) push(chunk, encoding);
  }, options);
}
