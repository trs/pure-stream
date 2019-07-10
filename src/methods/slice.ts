import { filter } from '..';
import { PureStream } from '../PureStream';

/**
 * Ignore values before `skip`, take until end of stream or `count`
 */
export function slice<T>(begin: number): PureStream<T, T>
export function slice<T>(begin: number, end: number): PureStream<T, T>
export function slice<T>(begin: number, end?: number): PureStream<T, T> {
  let ended = false;

  return filter<T>(function (chunk, index) {
    const canStart = index >= begin;
    const canTake = end !== undefined ? index < end : true;

    if (!ended && canStart && !canTake) {
      ended = true;
      this.end();
    }

    return canStart && canTake;
  });
}
