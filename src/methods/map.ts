import { OrPromiseLike } from '../meta';
import { TransformTyped, TransformTypedOptions } from '../types';
import { Transform } from 'stream';

export function map<T, R>(
  method: (chunk: T, encoding?: string) => OrPromiseLike<R>,
  options: TransformTypedOptions<T, R> = {}
): TransformTyped<T, R> {
  return new Transform({
    objectMode: true,
    ...options,
    async transform(chunk, encoding, callback) {
      try {
        const result = await method(chunk, encoding);
        callback(undefined, result);
      } catch (err) {
        callback(err);
      }
    }
  });
}
