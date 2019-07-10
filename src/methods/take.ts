import { filter } from '..';
import { TransformTyped } from '../types';

export function take<T>(skip: number, count: number): TransformTyped<T, T>
export function take<T>(count: number): TransformTyped<T, T>
export function take<T>(skip: number, count?: number): TransformTyped<T, T> {
  if (count === undefined) {
    count = skip;
    skip = 0;
  }
  const start = skip - 1;
  const end = count + skip;
  let ended = false;

  return filter<T>(function (chunk, encoding, index) {
    const canStart = index > start;
    const canTake = index < end;

    if (!ended && canStart && !canTake) {
      ended = true;
      this.end();
    }

    return canStart && canTake;
  });
}
