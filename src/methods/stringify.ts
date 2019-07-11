import { transform } from '..';
import { PureStreamOptions } from '../PureStream';
import { EOL } from 'os';

type JSONStringifyReplacer = null | ((key: string, value: any) => any);

/**
 * Transform a stream of objects into a stream of JSON stringified strings wrapped in an array
 */
export function stringify<T>(
  replacer?: JSONStringifyReplacer,
  space?: string | number,
  options: PureStreamOptions = {}
) {
  let writtenStart = false;
  let buffer: string | undefined;

  // Insert new lines if we are using spacing
  const newLine = space ? EOL : '';
  // Slice out new lines if we are using spacing
  const sliceCount = 1 + (space ? EOL.length : 0);

  const stream = transform(
    (value, push) => {
      const str = JSON.stringify([value], replacer || undefined, space).slice(
        sliceCount,
        -sliceCount
      );
      if (buffer) {
        push(buffer);
      }

      buffer = `${str},${newLine}`;

      if (!writtenStart) {
        buffer = `[${newLine}${buffer}`;
        writtenStart = true;
      }
    },
    (push) => {
      if (buffer) {
        push(`${buffer.slice(0, -sliceCount)}${newLine}]`);
      } else {
        push(']');
      }
    },
    options
  );
  return stream;
}
