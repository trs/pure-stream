import { transform } from '..';

export function flat<T>() {
  return transform<T[], T>(function (chunk, encoding, push) {
    for (const item of chunk) {
      push(item);
    }
  });
}
