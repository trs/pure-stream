import { PassThroughTyped, TransformTypedOptions } from '../types';
import { transform } from '..';

export function passthrough<In>(
  options: TransformTypedOptions<In, In> = {}
): PassThroughTyped<In> {
  return transform((chunk, encoding, push) => {
    push(chunk, encoding);
  }, options);
}
