import { PassThrough, Readable, Transform } from 'stream';
import { OrPromiseLike } from './meta';

export type PureStreamPush<T> = (value: T) => void;

export type PureStreamTransform<In, Out> = (
  this: PureStream<In, Out>,
  value: In,
  push: PureStreamPush<Out>
) => OrPromiseLike<void | any>;
export type PureStreamFlush<In, Out> = (
  this: PureStream<In, Out>,
  push: PureStreamPush<Out>
) => OrPromiseLike<void | any>;

export interface PureStreamOptions {
  /** Limit backpressure to this many objects */
  highWaterMark?: number;
}

export interface PureStreamInternal<In, Out> {
  /**
   * **INTERNAL**
   *
   * Used for creating methods.
   * You wouldn't normally need to use this.
   *
   * If you are looking to transform a stream, use:
   * ```ts
   * import { transform } from 'pure-stream';
   *
   * stream.pipe(transform((value, push) => { ... }));
   * ```
   */
  transform?: PureStreamTransform<In, Out>;
  /**
   * **INTERNAL**
   *
   * Used for creating helper methods.
   * You wouldn't normally need to use this.
   */
  flush?: PureStreamFlush<In, Out>;
}

/**
 * Pipes `source` into `destination`, same as a node stream pipe.
 * Propogates errors from `source` to `destination`
 * Destroys stream on error event
 */
function pipe<In, Out>(source: Readable, destination: PureStream<In, Out>) {
  const destinationStream: PassThrough = (destination as any).instance;

  source.pipe(destinationStream);

  source.on('error', (err) => {
    source.unpipe(destinationStream);
    source.destroy();
    destination.destroy(err);
  });

  return destination;
}

function buildTransform<In, Out>(self: PureStream<In, Out>, method?: PureStreamTransform<In, Out>) {
  if (!method) return undefined;
  return async function transform(
    this: Transform,
    chunk: In,
    encoding: string,
    callback: () => void
  ) {
    try {
      const push = this.push.bind(this);
      const result = await method.call(self, chunk, push);
      if (result !== undefined) push(result);
    } catch (err) {
      this.destroy(err);
    } finally {
      callback();
    }
  };
}

function buildFlush<In, Out>(self: PureStream<In, Out>, method?: PureStreamFlush<In, Out>) {
  if (!method) return undefined;
  return async function flush(this: Transform, callback: () => void) {
    try {
      const push = this.push.bind(this);
      const result = await method.call(self, push);
      if (result !== undefined) push(result);
    } catch (err) {
      this.destroy(err);
    } finally {
      callback();
    }
  };
}

/**
 * Simplified stream implementation.
 */
export class PureStream<In, Out = In> {
  private instance: PassThrough;

  /** Indicates if the stream has ended */
  public ended = false;

  public constructor();
  public constructor(options: PureStreamOptions);
  public constructor(options: PureStreamOptions, internal?: PureStreamInternal<In, Out>);
  public constructor(options: PureStreamOptions = {}, internal: PureStreamInternal<In, Out> = {}) {
    this.instance = new PassThrough({
      objectMode: true,
      allowHalfOpen: false,
      autoDestroy: true,
      emitClose: false,
      highWaterMark: options.highWaterMark,
      transform: buildTransform(this, internal.transform),
      flush: buildFlush(this, internal.flush)
    });
    this.instance.pause();

    // Setup simplified ending
    // On error, destroy and end stream
    this.instance.once('error', () => {
      this.instance.destroy();
      this.instance.end();
    });
    // On end, set ended true
    this.instance.once('end', () => (this.ended = true));
  }

  /** Pipe output into another stream */
  public pipe<T>(destination: PureStream<Out, T>) {
    return pipe<Out, T>(
      this.instance,
      destination
    );
  }

  /** Write a value to the stream */
  public write(value: In) {
    return this.instance.write(value, async (err) => {
      if (err) await this.destroy(err);
    });
  }

  /** End the stream with an error */
  public async destroy(error: Error) {
    return await new Promise((resolve) => {
      this.instance.once('end', () => resolve());
      this.instance.destroy(error);
    });
  }

  /** End the stream */
  public async end(value?: In) {
    return await new Promise((resolve) => {
      this.instance.end(value, () => resolve());
    });
  }

  public each(handler: (value: Out) => OrPromiseLike<void>): PureStream<In, Out>;
  public each(handler: (value: Out) => OrPromiseLike<any>): PureStream<In, Out>;
  /** Inspect each element of the stream */
  public each(handler: (value: Out) => OrPromiseLike<void | any>): PureStream<In, Out> {
    this.instance.on('data', (value) => handler(value));
    return this;
  }

  public done(handler?: (error?: Error) => OrPromiseLike<void>, consume?: boolean): void;
  public done(handler?: (error?: Error) => OrPromiseLike<any>, consume?: boolean): void;
  /**
   * Calls the handler once the stream ends, if provided.
   * Will begin consuming the stream, unless consume is false.
   * @param handler First argument is the error
   * @param consume Indicates if the stream should begin consuming
   */
  public done(handler?: (error?: Error) => OrPromiseLike<void | any>, consume = true): void {
    let error: Error | undefined;

    const storeError = (err: Error) => (error = err);
    this.instance.once('error', storeError);
    this.instance.once('end', () => {
      this.instance.removeListener('error', storeError);
      if (typeof handler === 'function') {
        handler(error);
      }
    });

    if (consume) this.instance.resume();
  }

  /** Convert this PureStream into a node PassThrough stream */
  public toNodeStream(): PassThrough {
    const stream = new PassThrough();

    this.each((value) => stream.write(value)).done((err) => {
      if (err) {
        stream.destroy(err);
      }
      stream.end();
    });

    return stream;
  }

  /** Convert this PureStream into a promise for an array of each value in the stream */
  public toPromise() {
    return new Promise<Out[]>((resolve, reject) => {
      const accumulated: Out[] = [];

      this.each((value) => accumulated.push(value)).done((err) => {
        if (err) reject(err);
        else resolve(accumulated);
      });
    });
  }

  public static wrap<T>(source: Readable): PureStream<T>;
  public static wrap<T>(source: PassThrough): PureStream<T>;
  public static wrap<In, Out>(source: Transform): PureStream<In, Out>;
  /** Wrap a node stream in a PureStream */
  public static wrap<In, Out>(source: Readable) {
    const wrapped = new PureStream<In, Out>();
    const stream = pipe(
      source,
      wrapped
    );
    return stream;
  }
}
