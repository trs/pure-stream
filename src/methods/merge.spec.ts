import { merge, from } from '..';

describe('merge', () => {
  it('merges multiple streams in order', (done) => {
    const check = jest.fn();
    merge(from([1, 2]), from([3, 4]))
      .each(check)
      .done((err) => {
        expect(err).toBe(undefined);
        expect(check.mock.calls[0][0]).toBe(1);
        expect(check.mock.calls[1][0]).toBe(3);
        expect(check.mock.calls[2][0]).toBe(2);
        expect(check.mock.calls[3][0]).toBe(4);
        done();
      });
  });

  it('merges pipe', (done) => {
    const check = jest.fn();
    from([1, 2])
      .pipe(merge(from([3, 4])))
      .each(check)
      .done((err) => {
        expect(err).toBe(undefined);
        expect(check.mock.calls[0][0]).toBe(1);
        expect(check.mock.calls[1][0]).toBe(3);
        expect(check.mock.calls[2][0]).toBe(2);
        expect(check.mock.calls[3][0]).toBe(4);
        done();
      });
  });

  it('maintains sequence', (done) => {
    const check = jest.fn();
    merge(from([1, 2, 3]), from([4, 5, 6]), from([7, 8, 9]), from([10, 11, 12]))
      .each(check)
      .done((err) => {
        expect(err).toBe(undefined);
        expect(check.mock.calls[0][0]).toBe(1);
        expect(check.mock.calls[1][0]).toBe(4);
        expect(check.mock.calls[2][0]).toBe(7);
        expect(check.mock.calls[3][0]).toBe(10);

        expect(check.mock.calls[4][0]).toBe(2);
        expect(check.mock.calls[5][0]).toBe(5);
        expect(check.mock.calls[6][0]).toBe(8);
        expect(check.mock.calls[7][0]).toBe(11);

        expect(check.mock.calls[8][0]).toBe(3);
        expect(check.mock.calls[9][0]).toBe(6);
        expect(check.mock.calls[10][0]).toBe(9);
        expect(check.mock.calls[11][0]).toBe(12);
        done();
      });
  });
});
