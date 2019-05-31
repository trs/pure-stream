import {Readable, Writable, Duplex, Transform, PassThrough, TransformOptions} from 'stream';

interface PipeOptions {
  end?: boolean;
}

type CallbackError = (error: Error | null) => void;
type CallbackErrorOptional = (error: Error | null | undefined) => void;
type TransformCallback<T> = (error: Error | null | undefined, data?: T) => void;

export interface ReadableTyped<Out> extends Readable {
  _read(size: number): void;

  _destroy(error: Error | null, callback: CallbackError): void;

  push(chunk: Out | null, encoding?: string): boolean;

  pipe(destination: PassThroughTyped<Out>, options?: PipeOptions): PassThroughTyped<Out>;
  pipe<T>(destination: TransformTyped<Out, T>, options?: PipeOptions): TransformTyped<Out, T>;
  pipe<T>(destination: DuplexTyped<Out, T>, options?: PipeOptions): DuplexTyped<Out, T>;
  pipe<T = Out>(destination: WritableTyped<T>, options?: PipeOptions): WritableTyped<T>;
  pipe<T extends Writable>(destination: T, options?: PipeOptions): T;

  addListener(event: "close", listener: () => void): this;
  addListener(event: "data", listener: (chunk: Out) => void): this;
  addListener(event: "end", listener: () => void): this;
  addListener(event: "readable", listener: () => void): this;
  addListener(event: "error", listener: (err: Error) => void): this;
  addListener(event: string | symbol, listener: (...args: any[]) => void): this;

  emit(event: "close"): boolean;
  emit(event: "data", chunk: Out): boolean;
  emit(event: "end"): boolean;
  emit(event: "readable"): boolean;
  emit(event: "error", err: Error): boolean;
  emit(event: string | symbol, ...args: any[]): boolean;

  on(event: "close", listener: () => void): this;
  on(event: "data", listener: (chunk: Out) => void): this;
  on(event: "end", listener: () => void): this;
  on(event: "readable", listener: () => void): this;
  on(event: "error", listener: (err: Error) => void): this;
  on(event: string | symbol, listener: (...args: any[]) => void): this;

  once(event: "close", listener: () => void): this;
  once(event: "data", listener: (chunk: Out) => void): this;
  once(event: "end", listener: () => void): this;
  once(event: "readable", listener: () => void): this;
  once(event: "error", listener: (err: Error) => void): this;
  once(event: string | symbol, listener: (...args: any[]) => void): this;

  prependListener(event: "close", listener: () => void): this;
  prependListener(event: "data", listener: (chunk: Out) => void): this;
  prependListener(event: "end", listener: () => void): this;
  prependListener(event: "readable", listener: () => void): this;
  prependListener(event: "error", listener: (err: Error) => void): this;
  prependListener(event: string | symbol, listener: (...args: any[]) => void): this;

  prependOnceListener(event: "close", listener: () => void): this;
  prependOnceListener(event: "data", listener: (chunk: Out) => void): this;
  prependOnceListener(event: "end", listener: () => void): this;
  prependOnceListener(event: "readable", listener: () => void): this;
  prependOnceListener(event: "error", listener: (err: Error) => void): this;
  prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this;

  removeListener(event: "close", listener: () => void): this;
  removeListener(event: "data", listener: (chunk: Out) => void): this;
  removeListener(event: "end", listener: () => void): this;
  removeListener(event: "readable", listener: () => void): this;
  removeListener(event: "error", listener: (err: Error) => void): this;
  removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
}

export interface WritableTyped<In> extends Writable {
  _write(chunk: In | null, encoding: string, callback: CallbackErrorOptional): void;

  _destroy(error: Error | null, callback: CallbackError): void;

  write(chunk: In | null, callback?: CallbackErrorOptional): boolean;
  write(chunk: In | null, encoding?: string, callback?: CallbackErrorOptional): boolean;

  end(callback?: () => void): void;
  end(chunk: In |  null, callback?: () => void): void;
  end(chunk: In |  null, encoding?: string, callback?: () => void): void;
}

export interface DuplexTyped<In, Out> extends Duplex, WritableTyped<In>, ReadableTyped<Out> {
  _write(chunk: In | null, encoding: string, callback: CallbackErrorOptional): void;

  _destroy(error: Error | null, callback: CallbackError): void;

  _read(size: number): void;

  write(chunk: In, callback?: CallbackErrorOptional): boolean;
  write(chunk: In, encoding?: string, callback?: CallbackErrorOptional): boolean;

  end(callback?: () => void): void;
  end(chunk: In | null, callback?: () => void): void;
  end(chunk: In | null, encoding?: string, callback?: () => void): void;

  push(chunk: Out | null, encoding?: string): boolean;

  pipe(destination: PassThroughTyped<Out>, options?: PipeOptions): PassThroughTyped<Out>;
  pipe<T>(destination: TransformTyped<Out, T>, options?: PipeOptions): TransformTyped<Out, T>;
  pipe<T>(destination: DuplexTyped<Out, T>, options?: PipeOptions): DuplexTyped<Out, T>;
  pipe<T = Out>(destination: WritableTyped<T>, options?: PipeOptions): WritableTyped<T>;
  pipe<T extends Writable>(destination: T, options?: PipeOptions): T;

  addListener(event: "close", listener: () => void): this;
  addListener(event: "data", listener: (chunk: Out) => void): this;
  addListener(event: "end", listener: () => void): this;
  addListener(event: "readable", listener: () => void): this;
  addListener(event: "error", listener: (err: Error) => void): this;
  addListener(event: string | symbol, listener: (...args: any[]) => void): this;

  emit(event: "close"): boolean;
  emit(event: "data", chunk: Out): boolean;
  emit(event: "end"): boolean;
  emit(event: "readable"): boolean;
  emit(event: "error", err: Error): boolean;
  emit(event: string | symbol, ...args: any[]): boolean;

  on(event: "close", listener: () => void): this;
  on(event: "data", listener: (chunk: Out) => void): this;
  on(event: "end", listener: () => void): this;
  on(event: "readable", listener: () => void): this;
  on(event: "error", listener: (err: Error) => void): this;
  on(event: string | symbol, listener: (...args: any[]) => void): this;

  once(event: "close", listener: () => void): this;
  once(event: "data", listener: (chunk: Out) => void): this;
  once(event: "end", listener: () => void): this;
  once(event: "readable", listener: () => void): this;
  once(event: "error", listener: (err: Error) => void): this;
  once(event: string | symbol, listener: (...args: any[]) => void): this;

  prependListener(event: "close", listener: () => void): this;
  prependListener(event: "data", listener: (chunk: Out) => void): this;
  prependListener(event: "end", listener: () => void): this;
  prependListener(event: "readable", listener: () => void): this;
  prependListener(event: "error", listener: (err: Error) => void): this;
  prependListener(event: string | symbol, listener: (...args: any[]) => void): this;

  prependOnceListener(event: "close", listener: () => void): this;
  prependOnceListener(event: "data", listener: (chunk: Out) => void): this;
  prependOnceListener(event: "end", listener: () => void): this;
  prependOnceListener(event: "readable", listener: () => void): this;
  prependOnceListener(event: "error", listener: (err: Error) => void): this;
  prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this;

  removeListener(event: "close", listener: () => void): this;
  removeListener(event: "data", listener: (chunk: Out) => void): this;
  removeListener(event: "end", listener: () => void): this;
  removeListener(event: "readable", listener: () => void): this;
  removeListener(event: "error", listener: (err: Error) => void): this;
  removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
}

export interface TransformTyped<In, Out> extends Transform, DuplexTyped<In, Out> {
  _flush(callback: TransformCallback<In>): void;

  _transform(chunk: In | null, encoding: string, callback: TransformCallback<In>): void;

  _write(chunk: In | null, encoding: string, callback: CallbackErrorOptional): void;

  _destroy(error: Error | null, callback: CallbackError): void;

  _read(size: number): void;

  write(chunk: In, callback?: CallbackErrorOptional): boolean;
  write(chunk: In, encoding?: string, callback?: CallbackErrorOptional): boolean;

  end(callback?: () => void): void;
  end(chunk: In | null, callback?: () => void): void;
  end(chunk: In | null, encoding?: string, callback?: () => void): void;

  push(chunk: Out | null): boolean;
  push(chunk: Out | null, encoding?: string): boolean;

  pipe(destination: PassThroughTyped<Out>, options?: PipeOptions): PassThroughTyped<Out>;
  pipe<T>(destination: TransformTyped<Out, T>, options?: PipeOptions): TransformTyped<Out, T>;
  pipe<T>(destination: DuplexTyped<Out, T>, options?: PipeOptions): DuplexTyped<Out, T>;
  pipe<T = Out>(destination: WritableTyped<T>, options?: PipeOptions): WritableTyped<T>;
  pipe<T extends Writable>(destination: T, options?: PipeOptions): T;

  addListener(event: "close", listener: () => void): this;
  addListener(event: "data", listener: (chunk: Out) => void): this;
  addListener(event: "end", listener: () => void): this;
  addListener(event: "readable", listener: () => void): this;
  addListener(event: "error", listener: (err: Error) => void): this;
  addListener(event: string | symbol, listener: (...args: any[]) => void): this;

  emit(event: "close"): boolean;
  emit(event: "data", chunk: Out): boolean;
  emit(event: "end"): boolean;
  emit(event: "readable"): boolean;
  emit(event: "error", err: Error): boolean;
  emit(event: string | symbol, ...args: any[]): boolean;

  on(event: "close", listener: () => void): this;
  on(event: "data", listener: (chunk: Out) => void): this;
  on(event: "end", listener: () => void): this;
  on(event: "readable", listener: () => void): this;
  on(event: "error", listener: (err: Error) => void): this;
  on(event: string | symbol, listener: (...args: any[]) => void): this;

  once(event: "close", listener: () => void): this;
  once(event: "data", listener: (chunk: Out) => void): this;
  once(event: "end", listener: () => void): this;
  once(event: "readable", listener: () => void): this;
  once(event: "error", listener: (err: Error) => void): this;
  once(event: string | symbol, listener: (...args: any[]) => void): this;

  prependListener(event: "close", listener: () => void): this;
  prependListener(event: "data", listener: (chunk: Out) => void): this;
  prependListener(event: "end", listener: () => void): this;
  prependListener(event: "readable", listener: () => void): this;
  prependListener(event: "error", listener: (err: Error) => void): this;
  prependListener(event: string | symbol, listener: (...args: any[]) => void): this;

  prependOnceListener(event: "close", listener: () => void): this;
  prependOnceListener(event: "data", listener: (chunk: Out) => void): this;
  prependOnceListener(event: "end", listener: () => void): this;
  prependOnceListener(event: "readable", listener: () => void): this;
  prependOnceListener(event: "error", listener: (err: Error) => void): this;
  prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this;

  removeListener(event: "close", listener: () => void): this;
  removeListener(event: "data", listener: (chunk: Out) => void): this;
  removeListener(event: "end", listener: () => void): this;
  removeListener(event: "readable", listener: () => void): this;
  removeListener(event: "error", listener: (err: Error) => void): this;
  removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
}

export interface TransformTypedOptions<In, Out> extends TransformOptions {
  read?(this: TransformTyped<In, Out>, size: number): void;
  write?(this: TransformTyped<In, Out>, chunk: In, encoding: string, callback: (error?: Error | null) => void): void;
  writev?(this: TransformTyped<In, Out>, chunks: Array<{ chunk: In, encoding: string }>, callback: (error?: Error | null) => void): void;
  final?(this: TransformTyped<In, Out>, callback: (error?: Error | null) => void): void;
  destroy?(this: TransformTyped<In, Out>, error: Error | null, callback: (error: Error | null) => void): void;
  transform?(this: TransformTyped<In, Out>, chunk: In, encoding: string, callback: TransformCallback<Out>): void;
  flush?(this: TransformTyped<In, Out>, callback: TransformCallback<Out>): void;
}

export interface PassThroughTypedOptions<In> extends TransformTypedOptions<In, In> {}

export interface PassThroughTyped<In> extends PassThrough, TransformTyped<In, In> {
  _flush(callback: TransformCallback<In>): void;

  _transform(chunk: In | null, encoding: string, callback: TransformCallback<In>): void;

  _write(chunk: In | null, encoding: string, callback: CallbackErrorOptional): void;

  _destroy(error: Error | null, callback: CallbackError): void;

  _read(size: number): void;

  write(chunk: In, callback?: CallbackErrorOptional): boolean;
  write(chunk: In, encoding?: string, callback?: CallbackErrorOptional): boolean;

  end(callback?: () => void): void;
  end(chunk: In | null, callback?: () => void): void;
  end(chunk: In | null, encoding?: string, callback?: () => void): void;

  push(chunk: In | null): boolean;
  push(chunk: In | null, encoding?: string): boolean;

  pipe(destination: PassThroughTyped<In>, options?: PipeOptions): PassThroughTyped<In>;
  pipe<T>(destination: TransformTyped<In, T>, options?: PipeOptions): TransformTyped<In, T>;
  pipe<T>(destination: DuplexTyped<In, T>, options?: PipeOptions): DuplexTyped<In, T>;
  pipe<T = In>(destination: WritableTyped<T>, options?: PipeOptions): WritableTyped<T>;
  pipe<T>(destination: T, options?: PipeOptions): T;


  addListener(event: "close", listener: () => void): this;
  addListener(event: "data", listener: (chunk: In) => void): this;
  addListener(event: "end", listener: () => void): this;
  addListener(event: "readable", listener: () => void): this;
  addListener(event: "error", listener: (err: Error) => void): this;
  addListener(event: string | symbol, listener: (...args: any[]) => void): this;

  emit(event: "close"): boolean;
  emit(event: "data", chunk: In): boolean;
  emit(event: "end"): boolean;
  emit(event: "readable"): boolean;
  emit(event: "error", err: Error): boolean;
  emit(event: string | symbol, ...args: any[]): boolean;

  on(event: "close", listener: () => void): this;
  on(event: "data", listener: (chunk: In) => void): this;
  on(event: "end", listener: () => void): this;
  on(event: "readable", listener: () => void): this;
  on(event: "error", listener: (err: Error) => void): this;
  on(event: string | symbol, listener: (...args: any[]) => void): this;

  once(event: "close", listener: () => void): this;
  once(event: "data", listener: (chunk: In) => void): this;
  once(event: "end", listener: () => void): this;
  once(event: "readable", listener: () => void): this;
  once(event: "error", listener: (err: Error) => void): this;
  once(event: string | symbol, listener: (...args: any[]) => void): this;

  prependListener(event: "close", listener: () => void): this;
  prependListener(event: "data", listener: (chunk: In) => void): this;
  prependListener(event: "end", listener: () => void): this;
  prependListener(event: "readable", listener: () => void): this;
  prependListener(event: "error", listener: (err: Error) => void): this;
  prependListener(event: string | symbol, listener: (...args: any[]) => void): this;

  prependOnceListener(event: "close", listener: () => void): this;
  prependOnceListener(event: "data", listener: (chunk: In) => void): this;
  prependOnceListener(event: "end", listener: () => void): this;
  prependOnceListener(event: "readable", listener: () => void): this;
  prependOnceListener(event: "error", listener: (err: Error) => void): this;
  prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this;

  removeListener(event: "close", listener: () => void): this;
  removeListener(event: "data", listener: (chunk: In) => void): this;
  removeListener(event: "end", listener: () => void): this;
  removeListener(event: "readable", listener: () => void): this;
  removeListener(event: "error", listener: (err: Error) => void): this;
  removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
}
