import { PureStream, PureStreamOptions } from '../PureStream';

/**
 * Create a simple passthrough stream
 */
export function passthrough<In>(options: PureStreamOptions = {}): PureStream<In> {
  return new PureStream<In>(options);
}
