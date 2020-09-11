import { PureStream, passthrough } from '..';

/**
 * Merge multiple streams into one, alternating data from each
 */
export function merge<T>(...streams: PureStream<any, T>[]) {
  const merged = passthrough<T>();
  for (const stream of streams) {
    stream.pipe(merged);
  }
  return merged;
}
