import {chunk, from} from '..';

describe('chunk', () => {
  it('combines results into arrays of given size', (done) => {
    const check = jest.fn();
    from([1, 2, 3])
      .pipe(chunk(2))
      .each(check)
      .done((err) => {
        expect(err).toBe(undefined);
        expect(check.mock.calls.length).toBe(2);
        expect(check.mock.calls[0][0]).toEqual([1, 2]);
        expect(check.mock.calls[1][0]).toEqual([3]);
        done();
      });
  });
});
