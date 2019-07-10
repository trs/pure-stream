# `PureStream`

This is the object stream instance.

## `constructor`

Create a new instance of `PureStream`  
You wouldn't normally create a stream this way, instead you would use [transformers](Transformers.md).

```js
import {PureStream} from 'pure-stream';

const stream  = new PureStream({
  highWaterMark: 1
});
```

## `pipe`

Pipe from one stream to another.  
Errors are propagated from the source to the destination.

```js
import {PureStream} from 'pure-stream';

new PureStream().pipe(new PureStream());
```

## `write`

Write a value to the stream.  
Returns `false` if the stream wishes for the calling code to wait for the `'drain'` event to be emitted before continuing to write additional data; otherwise `true`.

```js
import {PureStream} from 'pure-stream';

const written = new PureStream().write(1);
```

## `destroy`

Destroy the stream and end with an error.

```js
import {PureStream} from 'pure-stream';

new PureStream().destroy(new Error('Bad));
```

## `end`

Ends a stream gracefully.  
Takes an optional value that is written to the stream before end.

```js
import {PureStream} from 'pure-stream';

new PureStream().end();
```

## `each`

Calls the given method when data is received.

```js
import {PureStream} from 'pure-stream';

new PureStream().each((value) => console.log(value));
```

## `done`

Calls the given method when the stream ends.  
The first argument will be an error if one occurred.

```js
import {PureStream} from 'pure-stream';

new PureStream().done((err) => console.log('Stream ended', err));
```
