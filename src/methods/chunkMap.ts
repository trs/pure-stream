import { Transform } from "stream";
import { TransformTyped, TransformTypedOptions } from "../types";
import { OrPromiseLike } from "../meta";

export function chunkMap<T, R>(
  size: number,
  method: (chunk: T[], index: number) => OrPromiseLike<R>,
  options: TransformTypedOptions<T, R> = {}
): TransformTyped<T, R> {
  let index = 0;
  let chunk: T[] = [];
  return new Transform({
    objectMode: true,
    ...options,
    async transform(item, _encoding, callback) {
      try {
        chunk.push(item);
        if (chunk.length >= size) {
          const result = await method(chunk, index++);
          this.push(result);
          chunk = [];
        }
        callback();
      } catch (err) {
        callback(err);
        this.destroy();
      }
    },
    async flush(callback) {
      try {
        if (chunk.length > 0) {
          const result = await method(chunk, index++);
          this.push(result);
          chunk = [];
        }
        callback();
      } catch (err) {
        callback(err);
        this.destroy();
      }
    }
  });
}
