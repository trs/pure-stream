import { Transform, TransformOptions } from 'stream';
import { OrPromiseLike, ObjectStream } from '../meta';

export function reduce<T, R>(
  method: (previousValue: R, nextValue: T, encoding?: string) => OrPromiseLike<R>,
  initialValue: R,
  options: TransformOptions = {}
): ObjectStream<R> {
  return new Transform({
    objectMode: true,
    ...options,
    async transform(chunk, encoding, callback) {
      try {
        initialValue = await method(initialValue, chunk, encoding);
        callback();
      } catch (err) {
        callback(err);
      }
    },
    flush(callback) {
      callback(null, initialValue);
    }
  })
}