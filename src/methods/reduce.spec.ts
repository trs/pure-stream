import { from } from "./from";
import { reduce } from "./reduce";

describe('reduce', () => {
  it('reduces values based on method', (done) => {
    const check = jest.fn();

    from<[string, number]>([['a', 1], ['b', 2]])
    .pipe(reduce((prev, next) => {
      prev[next[0]] = next[1];
      return prev;
    }, {} as {[key: string]: number}))
    .on('error', done)
    .on('data', check)
    .on('end', () => {
      expect(check.mock.calls.length).toEqual(1);
      expect(check.mock.calls[0][0]).toEqual({a: 1, b: 2});
      done();
    });
  });
});
