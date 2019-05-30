import { PassThrough } from 'stream';
import { PassThroughTyped, TransformTypedOptions } from "../types";

export function passthrough<In>(
  options: TransformTypedOptions<In, In> = {}
): PassThroughTyped<In> {
  return new PassThrough({
    objectMode: true,
    ...options
  });
}
