# Converters

Converters convert a stream into another type.

### `toPromise`

Convert a stream into a promise for an array of values.

```js
import {from, toPromise} from 'pure-stream';

const result = await toPromise(from([1, 2, 3]));
console.log(result);

// Output:
// [1, 2, 3]
```

> References:  
> [`from`]('./Creators.md#from)
