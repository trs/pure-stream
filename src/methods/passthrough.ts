import { transform } from '..';
import { PureStream, PureStreamOptions } from '../PureStream';

export function passthrough<In>(
  options: PureStreamOptions<In, In> = {}
): PureStream<In, In> {
  return transform((chunk, push) => {
    push(chunk);
  }, options);
}
