import { TransformTyped, TransformTypedOptions } from "../types";
import { chunkMap } from "./chunkMap";

export function chunk<R>(
  size: number,
  options: TransformTypedOptions<R, R[]> = {}
): TransformTyped<R, R[]> {
  return chunkMap(size, (chunk) => chunk, options);
}
