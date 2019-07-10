import { chunkMap } from "./chunkMap";
import { PureStream, PureStreamOptions } from "../PureStream";

/**
 * Create chunks of `size` from streamed data
 */
export function chunk<R>(
  size: number,
  options: PureStreamOptions = {}
): PureStream<R, R[]> {
  return chunkMap(size, (chunk) => chunk, options);
}
