import {from} from './from';
import {toPromise} from './to';

describe('toPromise', () => {
  it('resolves stream to promise for an array', async () => {
    const stream = from([1, 2, 3]);
    const result = await toPromise(stream);
    expect(result).toEqual([1, 2, 3]);
  });
});
