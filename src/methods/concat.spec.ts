import { concat, from } from '..';

describe('concat', () => {
  it('flushes left before continuing to right', (cb) => {
    const check = jest.fn();
    concat(from([1, 2, 3]), from([4, 5, 6]))
      .each(check)
      .done((err) => {
        expect(err).toBe(undefined);
        expect(check.mock.calls[0][0]).toBe(1);
        expect(check.mock.calls[1][0]).toBe(2);
        expect(check.mock.calls[2][0]).toBe(3);
        expect(check.mock.calls[3][0]).toBe(4);
        expect(check.mock.calls[4][0]).toBe(5);
        expect(check.mock.calls[5][0]).toBe(6);
        cb();
      });
  });
});
