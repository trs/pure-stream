import { Transform } from 'stream';
import { OrPromiseLike } from '../meta';
import { TransformTyped, TransformTypedOptions } from "../types";

type Push<T> = (chunk: T, encoding?: string) => boolean;

export function transform<In, Out>(
  transform: (chunk: In, encoding: string, push: Push<Out>) => OrPromiseLike<void | undefined | Out>,
  flush: (push: Push<Out>) => OrPromiseLike<void>,
  options?: TransformTypedOptions<In, Out>
): TransformTyped<In, Out>
export function transform<In, Out>(
  transform: (chunk: In, encoding: string, push: Push<Out>) => OrPromiseLike<void | undefined | Out>,
  options?: TransformTypedOptions<In, Out>
): TransformTyped<In, Out>
export function transform<In, Out>(
  transform: (chunk: In, encoding: string, push: Push<Out>) => OrPromiseLike<void | undefined | Out>,
  flush?: ((push: Push<Out>) => OrPromiseLike<void> )| TransformTypedOptions<In, Out>,
  options?: TransformTypedOptions<In, Out>
): TransformTyped<In, Out> {
  if (!options && typeof flush !== 'function') {
    options = flush;
    flush = undefined;
  } else if (!options && !flush) {
    options = {};
  }

  return new Transform({
    objectMode: true,
    emitClose: true,
    autoDestroy: true,
    allowHalfOpen: false,
    ...options,
    async transform(chunk, encoding, callback) {
      try {
        const push = this.push.bind(this);
        const result = await transform(chunk, encoding, push);
        if (result !== undefined)
          this.push(result);
      } catch (err) {
        this.destroy(err);
      } finally {
        callback();
      }
    },
    async flush(callback) {
      try {
        if (typeof flush === 'function') {
          const push = this.push.bind(this);
          const result = await flush(push);
          if (result !== undefined)
            this.push(result);
        }
      } catch (err) {
        this.destroy(err);
      } finally {
        callback();
      }
    }
  });
}
