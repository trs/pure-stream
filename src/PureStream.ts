import { PassThrough, Readable, Transform } from "stream";
import { OrPromiseLike } from "./meta";

export type PureStreamPush<T> = (value: T) => void;

export type PureStreamTransform<In, Out> = (this: PureStream<In, Out>, value: In, push: PureStreamPush<Out>) => OrPromiseLike<void | any>;
export type PureStreamFlush<In, Out> = (this: PureStream<In, Out>, push: PureStreamPush<Out>) => OrPromiseLike<void | any>;

export interface PureStreamOptions<In, Out> {
  /** Limit backpressure to this many objects */
  highWaterMark?: number;
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
 * Pipes `source` into `destination`, same as native stream pipe.
 * Propogates errors from `source` to `destination`
 * Destroys stream on error event
 */
function pipe<In, Out>(source: Readable, destination: PureStream<In, Out>) {
  const destinationStream: PassThrough = (destination as any).instance;

  source.pipe(destinationStream);

  source.once('error', (err) => {
    source.unpipe(destinationStream);
    source.destroy();
    destinationStream.destroy(err);
  });

  return destination;
}

function buildTransform<In, Out>(self: PureStream<In, Out>, method?: PureStreamTransform<In, Out>) {
  if (!method) return undefined;
  return async function transform(this: Transform, chunk: In, encoding: string, callback: () => void) {
    try {
      const push = this.push.bind(this);
      const result = await method.call(self, chunk, push);
      if (result !== undefined)
        push(result);
    } catch (err) {
      this.destroy(err);
    } finally {
      callback();
    }
  }
}

function buildFlush<In, Out>(self: PureStream<In, Out>, method?: PureStreamFlush<In, Out>) {
  if (!method) return undefined;
  return async function flush(this: Transform, callback: () => void) {
    try {
      const push = this.push.bind(this);
      const result = await method.call(self, push);
      if (result !== undefined)
        push(result);
    } catch (err) {
      this.destroy(err);
    } finally {
      callback();
    }
  }
}

/**
 * Simplified stream implementation. Acts as a native PassThrough stream.
 *
 */
export class PureStream<In, Out>{
  private instance: PassThrough;

  /** Indicates if the stream has ended */
  public ended = false;

  public constructor(options: PureStreamOptions<In, Out> = {}) {
    this.instance = new PassThrough({
      objectMode: true,
      allowHalfOpen: false,
      autoDestroy: true,
      emitClose: false,
      highWaterMark: options.highWaterMark,
      transform: buildTransform(this, options.transform),
      flush: buildFlush(this, options.flush)
    });
    this.instance.pause();

    // Setup simplified ending
    // On error, destroy and end stream
    this.instance.once('error', () => {
      this.instance.destroy();
      this.instance.end();
    });
    // On end, set ended true
    this.instance.once('end', () => this.ended = true);
  }

  /** Pipe output into another stream */
  public pipe<T>(destination: PureStream<Out, T>) {
    return pipe<Out, T>(this.instance, destination);
  }

  /** Write a value to the stream */
  public async write(value: In) {
    return await new Promise((resolve, reject) => {
      this.instance.write(value, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  /** End the stream with an error */
  public async destroy(error: Error) {
    return await new Promise((resolve) => {
      this.instance.once('end', () => resolve());
      this.instance.destroy(error);
      this.instance.end();
    });
  }

  /** End the stream */
  public async end(value?: In) {
    return await new Promise((resolve) => {
      this.instance.end(value, () => resolve());
    });
  }

  public each(handler: (value: Out) => OrPromiseLike<void>): PureStream<Out, Out> {
    return this.pipe(new PureStream({
      transform: ((value, push) => {
        handler(value);
        push(value);
      })
    }));
  }

  /** Call the handler once the steam has ended. Will have an error if one occured */
  public done(handler: (error?: Error) => OrPromiseLike<void>) {
    let error: Error | undefined;

    const storeError = (err: Error) => error = err;
    this.instance.once('error', storeError);
    this.instance.once('end', () => {
      this.instance.removeListener('error', storeError);
      handler(error);
    });
    this.instance.resume();
  }

  /** Wrap a native stream in a PureStream */
  public static wrap<T>(source: Readable): PureStream<T, T>;
  public static wrap<T>(source: PassThrough): PureStream<T, T>;
  public static wrap<In, Out>(source: Transform): PureStream<In, Out>;
  public static wrap<In, Out>(source: Readable) {
    const wrapped = new PureStream<In, Out>();
    const stream = pipe(source, wrapped);
    return stream;
  }
}
