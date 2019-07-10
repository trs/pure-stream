import {from, transform} from '..';

describe('transform', () => {
  it('applies a transformation by pushing to stream', (done) => {
    const check = jest.fn();

    from([[1, 2], [3, 4]])
      .pipe(transform<number[], number>((chunk, push) => {
        push(chunk[0]);
        push(chunk[1]);
      }))
      .each(check)
      .done((err) => {
        expect(err).toBe(undefined);
        expect(check.mock.calls.length).toBe(4);
        expect(check.mock.calls[0][0]).toBe(1);
        expect(check.mock.calls[1][0]).toBe(2);
        expect(check.mock.calls[2][0]).toBe(3);
        expect(check.mock.calls[3][0]).toBe(4);
        done();
      });
  });

  it('allows passing a flush method', (done) => {
    const check = jest.fn();

    let chunk: number[] = [];
    from([1, 2, 3])
      .pipe(transform<number, number[]>(
        (item, push) => {
          chunk.push(item);
          if (chunk.length === 2) {
            push(chunk);
            chunk = [];
          }
        },
        (push) => {
          if (chunk.length > 0) {
            push(chunk);
            chunk = [];
          }
        }
      ))
      .each(check)
      .done((err) => {
        expect(err).toBe(undefined);
        expect(check.mock.calls.length).toBe(2);
        expect(check.mock.calls[0][0]).toEqual([1, 2]);
        expect(check.mock.calls[1][0]).toEqual([3]);
        done();
      });
  });

  it('handles errors by closing stream', (done) => {
    const check = jest.fn();

    from([1, 2, 3])
      .pipe(transform(() => {
        throw new Error('test')
      }))
      .each(check)
      .done((err) => {
        expect(err).toEqual(new Error('test'));
        expect(check.mock.calls.length).toBe(0);
        done();
      });
  });
});
