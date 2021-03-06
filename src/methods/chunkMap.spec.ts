import {chunkMap, from} from '..';

describe('chunkMap', () => {
  it('applies function of chunk of stream', (done) => {
    const check = jest.fn();
    from([1, 2, 3])
      .pipe(chunkMap<number, [number, number[]]>(2, (chunk) => [chunk.length, chunk]))
      .each(check)
      .done((err) => {
        expect(err).toBe(undefined);
        expect(check.mock.calls.length).toEqual(2);
        expect(check.mock.calls[0][0]).toEqual([2, [1, 2]]);
        expect(check.mock.calls[1][0]).toEqual([1, [3]]);
        done();
      });
  });
});
