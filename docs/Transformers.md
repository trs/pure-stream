# Transformers

Transformers manipulate data in a stream.

They are used as an argument to `pipe`.

### `transform`
> Perform a transformation on the given stream.  
> Call `push` to add to the stream

```js
import {from, transform} from 'pure-stream';

from([[1, 2], [3, 4]])
.pipe(transform((numbers, push) => {
  push(numbers[0]);
  push(numbers[1]);
}))
.each(console.log)
.done()

// Output:
// 1
// 2
// 3
// 4
```

> References:  
> [`from`]('./Creators.md#from)

### `map`
> Apply a function to each item in a stream

```js
import {from, map} from 'pure-stream';

from([1, 2, 3])
.pipe(map((value) => value * 2))
.each(console.log)
.done()

// Output:
// 2
// 4
// 6
```

> References:  
> [`from`]('./Creators.md#from)

### `reduce`
> Reduce the items in a stream using the given function

```js
import {from, reduce} from 'pure-stream';

from([1, 2, 3])
.pipe(reduce((prev, next) => prev + next, 0))
.each(console.log)
.done()

// Output:
// 6
```

> References:  
> [`from`]('./Creators.md#from)

### `filter`
> Filter out items in a stream using the given function

```js
import {from, reduce} from 'pure-stream';

from([1, 2, 3])
.pipe(filter((value) => value % 2 === 1))
.each(console.log)
.done()

// Output:
// 1
// 3
```

> References:  
> [`from`]('./Creators.md#from)

### `chunk`
> Combine the items in a stream into chunks of the given size

```js
import {from, chunk} from 'pure-stream';

from([1, 2, 3])
.pipe(chunk(2))
.each(console.log)
.done()

// Output:
// [1, 2]
// [3]
```

> References:  
> [`from`]('./Creators.md#from)

### `chunkMap`
> Combine the items in a stream into chunks of the given size and apply a function to each chunk

```js
import {from, chunkMap} from 'pure-stream';

from([1, 2, 3])
.pipe(chunkMap(2, (chunk) => chunk.length))
.each(console.log)
.done()

// Output:
// 2
// 1
```

> References:  
> [`from`]('./Creators.md#from)
