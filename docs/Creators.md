# Creators

Creators create a new stream.

### `from`

Create a stream from an iterable, async iterable, stream, any, or a promise for one of the previous.

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

> References:  
> [`from`]('./Creators.md#from)

### `passthrough`

Create a simple passthrough stream.

```js
import {passthrough} from 'pure-stream';

const stream = passthrough()
.write(1)
.write(2)
.each(console.log)
.done();

// Output:
// 1
// 2
// 3
```
