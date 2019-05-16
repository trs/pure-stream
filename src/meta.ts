import { Transform } from 'stream';

export type OrPromiseLike<T> = T | PromiseLike<T>;

export interface ObjectStream<T> extends Transform {
  read(size?: number): any & T;
  on(event: string | symbol, listener: (...args: any[]) => any): this;
  on(event: 'data', listener: (data: T) => void): this;
}

export function isPromise(value: any) {
  return value != null && typeof value.then === 'function';
}

export function isIterable(value: any) {
  return value != null && typeof value[Symbol.iterator] === 'function';
}

export function isStream(value: any) {
  return value != null && typeof value.pipe === 'function';
}