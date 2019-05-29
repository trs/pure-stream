import { Transform } from 'stream';
import { OrPromiseLike } from '../meta';
import { TransformTyped, TransformTypedOptions } from "../types";

export function transform<In, Out>(
  method: (chunk: In, encoding: string, push: (chunk: Out, encoding?: string) => boolean) => OrPromiseLike<void | undefined | Out>,
  options: TransformTypedOptions<In, Out> = {}
): TransformTyped<In, Out> {
  return new Transform({
    objectMode: true,
    ...options,
    async transform(chunk, encoding, callback) {
      try {
        const push = this.push.bind(this);
        const result = await method(chunk, encoding, push);
        callback(undefined, result);
      } catch (err) {
        callback(err);
      }
    }
  });
}
