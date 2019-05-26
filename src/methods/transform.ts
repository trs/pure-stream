import { Transform } from 'stream';
import { OrPromiseLike } from '../meta';
import { TransformTyped, TransformTypedOptions } from "../types";

export function transform<In, Out>(
  method: (chunk: In, encoding: string, push: (chunk: In, encoding?: string) => boolean) => OrPromiseLike<void>,
  options: TransformTypedOptions<In, Out> = {}
): TransformTyped<In, Out> {
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
