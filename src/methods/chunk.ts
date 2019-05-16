import { Transform, TransformOptions } from "stream";

export function chunk<R>(size: number, options: TransformOptions = {}) {
  let chunk: R[] = [];
  return new Transform({
    objectMode: true,
    ...options,
    transform(item, _encoding, callback) {
      chunk.push(item);
      if (chunk.length > size) {
        this.push(chunk);
        chunk = [];
      }
      callback();
    },
    flush(callback) {
      if (chunk.length > 0) {
        this.push(chunk);
        chunk = [];
      }
      callback();
    }
  })
}
