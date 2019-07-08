import { Readable, Transform } from 'stream';
import { OrPromiseLike, isIterable, isPromise, isStream } from '../meta';
import { PureStream } from '../PureStream';

function buildStream<T>(method: (stream: PureStream<T, T>) => void) {
  const stream = new PureStream<T, T>();
  setImmediate(() => method(stream));
  return stream;
}

function fromPromise<T>(value: Promise<T>) {
  return buildStream<T>((stream) => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    value.then((result) => from(result).pipe(stream))
      .catch((err) => stream.destroy(err));
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

function fromStream<T>(value: Readable) {
  return PureStream.wrap<T>(value);
}

function fromAny<T>(value: T) {
  return buildStream<T>((stream) => stream.end(value));
}

export function from<T>(value: OrPromiseLike<Readable>): PureStream<T, T>
export function from<In, Out>(value: OrPromiseLike<Transform>): PureStream<In, Out>
export function from<T>(value: OrPromiseLike<Iterable<T>>): PureStream<T, T>
export function from<T>(value: OrPromiseLike<AsyncIterable<T>>): PureStream<T, T>
export function from<T>(value: OrPromiseLike<T>): PureStream<T, T>
export function from<T>(value: any) {
  if (isIterable(value)) return fromIterable<T>(value);
  else if (isPromise(value)) return fromPromise<T>(value);
  else if (isStream(value)) return fromStream<T>(value);

  return fromAny<T>(value);
}
