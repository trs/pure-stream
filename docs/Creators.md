# Creators

Creators create a new stream.

### `from`
> Create a stream from an iterable, async iterable, stream, any, or a promise for one of the previous.

```js
import {from} from 'pure-stream';

const getString = () => Promise.resolve('hello');

from(getString())
.each(console.log)
.done();

// Output:
// h
// e
// l
// l
// o
```

### `passthrough`
> Create a simple passthrough stream

```js
import {passthrough} from 'pure-stream';

from([1, 2, 3])
.pipe(passthrough())
.each(console.log)
.done()

// Output:
// 1
// 2
// 3
```
