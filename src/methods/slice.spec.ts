import { from, slice } from "..";

describe('slice', () => {
  it('starts at the given offset', (done) => {
    const check = jest.fn();

    from([1, 2, 3, 4, 5, 6])
      .pipe(slice(2))
      .each(check)
      .done((err) => {
        expect(err).toBe(undefined);
        expect(check.mock.calls.length).toBe(4);
        expect(check.mock.calls[0][0]).toBe(3);
        expect(check.mock.calls[1][0]).toBe(4);
        expect(check.mock.calls[2][0]).toBe(5);
        expect(check.mock.calls[3][0]).toBe(6);
        done();
      });
  });

  it('stops and the given end', (done) => {
    const check = jest.fn();

    from([1, 2, 3, 4, 5, 6])
      .pipe(slice(2, 4))
      .each(check)
      .done((err) => {
        expect(err).toBe(undefined);
        expect(check.mock.calls.length).toBe(2);
        expect(check.mock.calls[0][0]).toBe(3);
        expect(check.mock.calls[1][0]).toBe(4);
        done();
      });
  });
})
