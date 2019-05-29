# pure-stream

> Collection of utilities for working with native streams

[![npm](https://img.shields.io/npm/v/pure-stream.svg)](https://www.npmjs.com/package/pure-stream)

## Install

```sh
$ npm install pure-stream
# or
$ yarn add pure-stream
```

## Usage

These methods can be combined and piped to manipulate data streams.

`pure-stream` utilizes typed interfaces that extend the native promises. This enables streams to be typed while developed, but retain all the native functionality and API.

## API

### `from`
> Create a stream from an iterable, async iterable, stream, any, or a promise for one of the previous.

```js
import {from} from 'pure-stream';

const getString = () => Promise.resolve('hello');

from(getString())
.on('data', console.log);

// Output:
// h
// e
// l
// l
// o
```

### `to`
> Convert a stream into a promise

```js
import {from, to} from 'pure-stream';

const result = await to(from([1, 2, 3]));
console.log(result);

// Output:
// [1, 2, 3]
```

### `map`
> Apply a function to each item in a stream

```js
import {from, map} from 'pure-stream';

from([1, 2, 3])
.pipe(map((value) => value * 2))
.on('data', console.log);

// Output:
// 2
// 4
// 6

```

### `reduce`
> Reduce the items in a stream using the given function

```js
import {from, reduce} from 'pure-stream';

from([1, 2, 3])
.pipe(reduce((prev, next) => prev + next, 0))
.on('data', console.log);

// Output:
// 6
```

### 'filter`
> Filter out items in a stream using the given function

```js
import {from, reduce} from 'pure-stream';

from([1, 2, 3])
.pipe(filter((value) => value % 2 === 1))
.on('data', console.log);

// Output:
// 1
// 3
```

### `chunk`
> Combine the items in a stream into chunks of the given size

```js
import {from, chunk} from 'pure-stream';

from([1, 2, 3])
.pipe(chunk(2))
.on('data', console.log);

// Output:
// [1, 2]
// [3]
```

### `transform`
> Perform a transformation on the given stream.  
> Can return a transformed result or call `push` to add to the stream

```js
import {from, transform} from 'pure-stream';

from([[1, 2], [3, 4]])
.pipe(transform((numbers, encoding, push) => {
  push(numbers[0]);
  push(numbers[1]);
}))
.on('data', console.log);

// Output:
// 1
// 2
// 3
// 4
```
