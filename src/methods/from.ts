import { PassThrough, Writable, Readable } from 'stream';
import { isIterable, isPromise, isStream } from '../meta';

export function from<T>(value: Iterable<T>): PassThrough
export function from<T>(value: AsyncIterable<T>): PassThrough
export function from<T>(value: T): PassThrough
export function from(value: Readable): PassThrough
export function from(value: Promise<any>): PassThrough
export function from(value: any) {
  if (isIterable(value)) return fromIterable(value);
  else if (isPromise(value)) return fromPromise(value);
  else if (isStream(value)) return fromStream(value);

  return fromAny(value);
}

function fromPromise(value: Promise<any>) {
  return buildStream((stream) => {
    value.then((result) => from(result).pipe(stream))
    .catch((err) => stream.emit('error', err));
  });
}

function fromIterable<T>(value: T[]) {
  return buildStream(async (stream) => {
    for await (let item of value) {
      stream.write(item);
    }
    stream.end();
  });
}

function fromStream(value: Readable) {
  return buildStream((stream) => {
    value.pipe(stream);
  });
}

function fromAny(value: any) {
  return buildStream((stream) => stream.end(value));
}

function buildStream(method: (stream: Writable) => void) {
  const stream = new PassThrough({
    objectMode: true
  });

  setImmediate(() => method(stream));

  return stream;
}
