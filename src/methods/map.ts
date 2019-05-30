import { OrPromiseLike } from '../meta';
import { TransformTyped, TransformTypedOptions } from '../types';
import { Transform } from 'stream';

export function map<T, R>(
  method: (chunk: T, encoding: string, index: number) => OrPromiseLike<R>,
  options: TransformTypedOptions<T, R> = {}
): TransformTyped<T, R> {
  let index = 0;
  return new Transform({
    objectMode: true,
    ...options,
    async transform(chunk, encoding, callback) {
      try {
        const result = await method(chunk, encoding, index++);
        callback(undefined, result);
      } catch (err) {
        callback(err);
      }
    }
  });
}
