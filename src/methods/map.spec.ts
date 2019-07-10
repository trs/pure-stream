import {from, map} from '..';

describe('map', () => {
  it('applies function over items', (done) => {
    const check = jest.fn();

    from([1, 2, 3])
      .pipe(map((val: number) => val * 2))
      .on('data', check)
      .on('error', done)
      .on('end', () => {
        expect(check.mock.calls.length).toEqual(3);
        expect(check.mock.calls[0][0]).toEqual(2);
        expect(check.mock.calls[1][0]).toEqual(4);
        expect(check.mock.calls[2][0]).toEqual(6);
        done();
      });
  });
});
