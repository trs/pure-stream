import { PassThrough } from 'stream';
import { isIterable, isPromise, isStream } from '../meta';
import { PassThroughTyped, ReadableTyped } from '../types';

export function from<T>(value: Iterable<T>): PassThroughTyped<T>
export function from<T>(value: AsyncIterable<T>): PassThroughTyped<T>
export function from<T>(value: T): PassThroughTyped<T>
export function from<T>(value: ReadableTyped<T>): PassThroughTyped<T>
export function from<T>(value: Promise<T>): PassThroughTyped<T>
export function from<T>(value: any) {
  if (isIterable(value)) return fromIterable<T>(value);
  else if (isPromise(value)) return fromPromise<T>(value);
  else if (isStream(value)) return fromStream<T>(value);

  return fromAny<T>(value);
}

function fromPromise<T>(value: Promise<T>) {
  return buildStream<T>((stream) => {
    value.then((result) => from(result).pipe(stream))
    .catch((err) => stream.emit('error', err));
  });
}

function fromIterable<T>(value: T[]) {
  return buildStream<T>(async (stream) => {
    for await (let item of value) {
      stream.write(item);
    }
    stream.end();
  });
}

function fromStream<T>(value: ReadableTyped<T>) {
  return buildStream<T>((stream) => {
    value.pipe(stream);
  });
}

function fromAny<T>(value: T) {
  return buildStream<T>((stream) => stream.end(value));
}

function buildStream<T>(method: (stream: PassThroughTyped<T>) => void) {
  const stream: PassThroughTyped<T> = new PassThrough({
    objectMode: true
  });

  setImmediate(() => method(stream));

  return stream;
}
