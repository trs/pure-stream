import { Readable } from "stream";
import { reduce } from "./reduce";

export function toPromise<T>(stream: Readable) {
  return new Promise((resolve, reject) => {
    stream.pipe(reduce<T, T[]>(async (prev, next) => {
      prev.push(next);
      return prev;
    }, []))
    .once('error', reject)
    .once('data', resolve);
  });
}
