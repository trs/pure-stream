import { OrPromiseLike } from '../meta';
import { TransformTyped, TransformTypedOptions } from '../types';
import { Transform } from 'stream';

export function reduce<T, R>(
  method: (previousValue: R, nextValue: T, encoding: string, index: number) => OrPromiseLike<R>,
  initialValue: R,
  options: TransformTypedOptions<T, R> = {}
): TransformTyped<T, R> {
  let index = 0;
  return new Transform({
    objectMode: true,
    ...options,
    async transform(chunk, encoding, callback) {
      try {
        initialValue = await method(initialValue, chunk, encoding, index++);
        callback();
      } catch (err) {
        callback(err);
      }
    },
    flush(callback) {
      callback(null, initialValue);
    }
  });
}
