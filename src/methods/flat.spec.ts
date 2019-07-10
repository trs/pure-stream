import { flat, from } from '..';

describe('flat', () => {
  it('flattens stream of arrays', (done) => {
    const check = jest.fn();

    from([[1, 2], [3, 4]])
      .pipe(flat())
      .on('data', check)
      .once('error', done)
      .once('close', () => {
        expect(check.mock.calls.length).toBe(4);
        expect(check.mock.calls[0][0]).toBe(1);
        expect(check.mock.calls[1][0]).toBe(2);
        expect(check.mock.calls[2][0]).toBe(3);
        expect(check.mock.calls[3][0]).toBe(4);

        done();
      });
  });
});
