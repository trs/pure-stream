import { PureStream, passthrough } from '..';

/**
 * Concatenate streams of data together.
 * The left stream will emit until the end, then emit from right stream.
 */
export function concat<T>(streamLeft: PureStream<any, T>, streamRight: PureStream<any, T>) {
  const stream = passthrough<T>();

  streamLeft
    .each((value) => stream.write(value))
    .done((err) => {
      if (err) {
        stream.destroy(err);
        return;
      }
      streamRight.pipe(stream);
    });

  return stream;
}
