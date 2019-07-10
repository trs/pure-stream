import { from, reduce } from "..";

describe('reduce', () => {
  it('reduces values based on method', (done) => {
    const check = jest.fn();

    const initialValue: {[key: string]: number} = {};
    from<[string, number]>([['a', 1], ['b', 2]])
      .pipe(reduce((prev, next) => {
        prev[next[0]] = next[1];
        return prev;
      }, initialValue))
      .on('error', done)
      .on('data', check)
      .on('end', () => {
        expect(check.mock.calls.length).toEqual(1);
        expect(check.mock.calls[0][0]).toEqual({a: 1, b: 2});
        done();
      });
  });
});
