import { ReadableTyped } from "../types";
import { reduce } from "./reduce";

export function toPromise<T>(stream: ReadableTyped<T>) {
  return new Promise<T[]>((resolve, reject) => {
    stream.pipe(reduce<T, T[]>(async (prev, next) => {
      prev.push(next);
      return prev;
    }, []))
    .once('error', reject)
    .once('data', resolve);
  });
}
