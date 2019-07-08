# Converters

Converters convert a stream into another type.

### `toPromise`
> Convert a stream into a promise

```js
import {from, toPromise} from 'pure-stream';

const result = await toPromise(from([1, 2, 3]));
console.log(result);

// Output:
// [1, 2, 3]
```
