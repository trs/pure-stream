export type OrPromiseLike<T> = T | PromiseLike<T>;

export function isPromise(value: any) {
  return value != null && typeof value.then === 'function';
}

export function isIterable(value: any) {
  return value != null && typeof value[Symbol.iterator] === 'function';
}

export function isStream(value: any) {
  return value != null && typeof value.pipe === 'function';
}
