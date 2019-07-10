import { ReadableTyped, DuplexTyped, WritableTyped } from "../types";
import { passthrough } from "./passthrough";

type PipeableStreams =
  [WritableTyped<any>]
  | [DuplexTyped<any, any>]
  | DuplexTyped<any, any>[]
  | ([DuplexTyped<any, any>, WritableTyped<any>])
  | ([DuplexTyped<any, any>, DuplexTyped<any, any>, WritableTyped<any>])
  | ([DuplexTyped<any, any>, DuplexTyped<any, any>, DuplexTyped<any, any>, WritableTyped<any>])
  | ([DuplexTyped<any, any>, DuplexTyped<any, any>, DuplexTyped<any, any>, DuplexTyped<any, any>, WritableTyped<any>])
  | ([DuplexTyped<any, any>, DuplexTyped<any, any>, DuplexTyped<any, any>, DuplexTyped<any, any>, DuplexTyped<any, any>, WritableTyped<any>])

export function pipeline<S, D0, D1, D2, D3, D4>(
  source: ReadableTyped<S>,
  mid0: DuplexTyped<S, D0>,
  mid1: DuplexTyped<D0, D1>,
  mid2: DuplexTyped<D1, D2>,
  mid3: DuplexTyped<D2, D3>,
  destination: DuplexTyped<D3, D4>
): typeof destination
export function pipeline<S, D0, D1, D2, D3>(
  source: ReadableTyped<S>,
  mid0: DuplexTyped<S, D0>,
  mid1: DuplexTyped<D0, D1>,
  mid2: DuplexTyped<D1, D2>,
  mid3: DuplexTyped<D2, D3>,
  destination: WritableTyped<D3>
): typeof destination

export function pipeline<S, D0, D1, D2, D3>(
  source: ReadableTyped<S>,
  mid0: DuplexTyped<S, D0>,
  mid1: DuplexTyped<D0, D1>,
  mid2: DuplexTyped<D1, D2>,
  destination: DuplexTyped<D2, D3>
): typeof destination
export function pipeline<S, D0, D1, D2>(
  source: ReadableTyped<S>,
  mid0: DuplexTyped<S, D0>,
  mid1: DuplexTyped<D0, D1>,
  mid2: DuplexTyped<D1, D2>,
  destination: WritableTyped<D2>
): typeof destination

export function pipeline<S, D0, D1, D2>(
  source: ReadableTyped<S>,
  mid0: DuplexTyped<S, D0>,
  mid1: DuplexTyped<D0, D1>,
  destination: DuplexTyped<D1, D2>
): typeof destination
export function pipeline<S, D0, D1>(
  source: ReadableTyped<S>,
  mid0: DuplexTyped<S, D0>,
  mid1: DuplexTyped<D0, D1>,
  destination: WritableTyped<D1>
): typeof destination

export function pipeline<S, D0, D1>(
  source: ReadableTyped<S>,
  mid0: DuplexTyped<S, D0>,
  destination: DuplexTyped<D0, D1>
): typeof destination
export function pipeline<S, D0>(
  source: ReadableTyped<S>,
  mid0: DuplexTyped<S, D0>,
  destination: WritableTyped<D0>
): typeof destination

export function pipeline<S, D0>(
  source: ReadableTyped<S>,
  destination: DuplexTyped<S, D0>
): typeof destination
export function pipeline<S>(
  source: ReadableTyped<S>,
  destination: WritableTyped<S>
): typeof destination

export function pipeline(source: ReadableTyped<any>, ...streams: PipeableStreams): WritableTyped<any> | DuplexTyped<any, any> {
  if (!streams.length) throw new Error('Must pass in at least one destination stream');

  let result: WritableTyped<any> | DuplexTyped<any, any> = passthrough<any>();
  source.pipe(result);

  // Propagate errors to first stream
  source.on('error', (err) => streams[0].emit('error', err));

  for (let i = 0; i < streams.length; i++) {
    const stream = streams[i];
    result = result.pipe(stream);

    if (i > 0) {
      const previous = streams[i - 1];
      // Propagate errors to next stream
      previous.on('error', (err) => stream.emit('error', err));
    }
  }

  return result
    .once('error', () => result.destroy())
}
