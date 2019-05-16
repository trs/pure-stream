import { Transform, TransformOptions } from 'stream';
import { OrPromiseLike, ObjectStream } from '../meta';

export function map<T, R>(
  method: (chunk: T, encoding?: string) => OrPromiseLike<R>,
  options: TransformOptions = {}
): ObjectStream<R> {
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
