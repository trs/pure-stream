import { from, filter } from "..";

describe('filter', () => {
  it('removes items from the stream', (done) => {
    const check = jest.fn();

    from([1, 2, 3, 4])
      .pipe(filter((chunk) => chunk % 2 == 0))
      .each(check)
      .done((err) => {
        expect(err).toBe(undefined);
        expect(check.mock.calls.length).toEqual(2);
        expect(check.mock.calls[0][0]).toEqual(2);
        expect(check.mock.calls[1][0]).toEqual(4);
        done();
      });
  });
});
