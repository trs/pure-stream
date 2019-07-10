import { filter } from '..';
import { PureStream } from '../PureStream';

/**
 * Only take a certain number of items from a stream
 */
export function take<T>(count: number): PureStream<T, T> {
  let ended = false;

  return filter<T>(function (chunk, index) {
    const canTake = index < count;

    if (!ended && !canTake) {
      ended = true;
      this.end();
    }

    return canTake;
  });
}
