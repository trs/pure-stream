import { Transform, TransformOptions } from 'stream';
import { OrPromiseLike, ObjectStream } from '../meta';

export function filter<T>(method: (chunk: T, encoding?: string) => OrPromiseLike<boolean>, options: TransformOptions = {}): ObjectStream<T> {
  return new Transform({
    objectMode: true,
    ...options,
    async transform(chunk, encoding, callback) {
      try {
        const take = await method(chunk, encoding);
        callback(undefined, take ? chunk : undefined);
      } catch (err) {
        callback(err);
      }
    }
  });
}
