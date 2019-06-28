import {take, from} from '..';

describe('take', () => {
  it('only consumes the given number of items', (done) => {
    const check = jest.fn();

    from([1, 2, 3, 4, 5])
      .pipe(take(3))
      .on('data', check)
      .once('error', done)
      .once('close', () => {
        expect(check.mock.calls.length).toBe(3);
        expect(check.mock.calls[0][0]).toBe(1);
        expect(check.mock.calls[1][0]).toBe(2);
        expect(check.mock.calls[2][0]).toBe(3);
        done();
      });
  });

  it('starts at the given offset', (done) => {
    const check = jest.fn();

    from([1, 2, 3, 4, 5])
      .pipe(take(2, 2))
      .on('data', check)
      .once('error', done)
      .once('close', () => {
        expect(check.mock.calls.length).toBe(2);
        expect(check.mock.calls[0][0]).toBe(3);
        expect(check.mock.calls[1][0]).toBe(4);
        done();
      });
  });
});
