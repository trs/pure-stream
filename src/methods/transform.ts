import { PureStream, PureStreamOptions, PureStreamTransform, PureStreamFlush } from '../PureStream';

export function transform<In, Out>(
  transform: PureStreamTransform<In, Out>,
  flush: PureStreamFlush<In, Out>,
  options?: PureStreamOptions<In, Out>
): PureStream<In, Out>

export function transform<In, Out>(
  transform: PureStreamTransform<In, Out>,
  options?: PureStreamOptions<In, Out>
): PureStream<In, Out>

export function transform<In, Out>(
  transform: PureStreamTransform<In, Out>,
  flush?: PureStreamFlush<In, Out> | PureStreamOptions<In, Out>,
  options?: PureStreamOptions<In, Out>
): PureStream<In, Out> {
  if (!options && typeof flush !== 'function') {
    options = flush;
    flush = undefined;
  } else if (!options && !flush) {
    options = {};
  }

  return new PureStream<In, Out>({
    ...options,
    async transform(this: PureStream<In, Out>, chunk, push) {
      await transform.call(this, chunk, push);
    },
    async flush(this: PureStream<In, Out>, push) {
      if (typeof flush === 'function') {
        await flush.call(this, push);
      }
    }
  });
}
