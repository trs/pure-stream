import { transform } from '..';
import { PureStream, PureStreamOptions } from '../PureStream';

/**
 * Create a simple passthrough stream
 */
export function passthrough<In>(
  options: PureStreamOptions = {}
): PureStream<In, In> {
  return transform((chunk, push) => {
    push(chunk);
  }, options);
}
