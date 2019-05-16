import { Transform, TransformOptions } from 'stream';
import { OrPromiseLike, ObjectStream } from '../meta';

export function transform<T, R>(
  method: (chunk: T, encoding: string, push: (chunk: T, encoding?: string) => boolean) => OrPromiseLike<void>,
  options: TransformOptions = {}
): ObjectStream<R> {
  return new Transform({
    objectMode: true,
    ...options,
    async transform(chunk, encoding, callback) {
      try {
        const push = this.push.bind(this);
        method(chunk, encoding, push);
      } catch (err) {
        callback(err);
      }
    }
  });
}
