import { transform, PureStreamOptions } from '..';

/**
 * Flatten a stream of array values
 */
export function flat<T>(options: PureStreamOptions = {}) {
  return transform<T[], T>(function (chunk, push) {
    for (const item of chunk) {
      push(item);
    }
  }, options);
}
