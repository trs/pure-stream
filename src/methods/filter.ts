import { OrPromiseLike } from '../meta';
import { Transform } from 'stream';
import { TransformTyped, TransformTypedOptions } from '../types';

export function filter<T>(
  method: (chunk: T, encoding: string) => OrPromiseLike<boolean>,
  options: TransformTypedOptions<T, T> = {}
): TransformTyped<T, T> {
  return new Transform({
    objectMode: true,
    ...options,
    async transform(chunk, encoding, callback) {
      try {
        const take = await method(chunk, encoding);
        callback(undefined, take ? chunk : undefined);
      } catch (err) {
        callback(err);
        this.destroy();
      }
    }
  });
}
