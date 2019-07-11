# pure-stream

> Collection of utilities for working with object streams

[![npm](https://img.shields.io/npm/v/pure-stream.svg)](https://www.npmjs.com/package/pure-stream)

## About

This library uses a new class `PureStream` to implement object streams in an easy and logical way.

- PureStreams are `ended` when an error occurs
- `pipe`-ing propagates errors from source to destination(s)
- No events. Data is collected with `each` and ended with `done`

PureStreams are lazy, they won't begin reading data until `.done` is called.

## Install

```sh
$ npm install pure-stream
# or
$ yarn add pure-stream
```

## Quick-Start

```js
import {from, map} from 'pure-stream';

from([1, 2, 3])
.pipe(map((value) => value * 2))
.each((value) => {
  console.log(value);
  // Output:
  // 2
  // 4
  // 6
})
.done((err) => {
  if (err) console.log('Error:', err);
  else console.log('Success');
});
```

## Usage

- [PureStream](./docs/PureStream.md)
- [Creators](./docs/Creators.md)
- [Transformers](./docs/Transformers.md)
