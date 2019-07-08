import { transform } from '..';

export function flat<T>() {
  return transform<T[], T>(function (chunk, push) {
    for (const item of chunk) {
      push(item);
    }
  });
}
