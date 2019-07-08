import { chunkMap } from "./chunkMap";
import { PureStream, PureStreamOptions } from "../PureStream";

export function chunk<R>(
  size: number,
  options: PureStreamOptions<R, R[]> = {}
): PureStream<R, R[]> {
  return chunkMap(size, (chunk) => chunk, options);
}
