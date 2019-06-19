import {from} from './from';
import {transform} from './transform';

describe('transform', () => {
  it('applies a transformation over a stream', (done) => {
    const check = jest.fn();

    from([[1, 2], [3, 4], [5, 6]])
    .pipe(transform((chunk) => chunk[0] + chunk[1]))
    .on('error', done)
    .on('data', check)
    .on('end', () => {
      expect(check.mock.calls.length).toEqual(3);
      expect(check.mock.calls[0][0]).toEqual(3);
      expect(check.mock.calls[1][0]).toEqual(7);
      expect(check.mock.calls[2][0]).toEqual(11);
      done();
    });
  });

  it('applies a transformation by pushing to stream', (done) => {
    const check = jest.fn();

    from([[1, 2], [3, 4]])
    .pipe(transform<number[], number>((chunk, _encoding, push) => {
      push(chunk[0]);
      push(chunk[1]);
    }))
    .on('error', done)
    .on('data', check)
    .on('end', () => {
      expect(check.mock.calls.length).toEqual(4);
      expect(check.mock.calls[0][0]).toEqual(1);
      expect(check.mock.calls[1][0]).toEqual(2);
      expect(check.mock.calls[2][0]).toEqual(3);
      expect(check.mock.calls[3][0]).toEqual(4);
      done();
    });
  });

  it('allows passing a flush method', (done) => {
    const check = jest.fn();

    let chunk: number[] = [];
    from([1, 2, 3])
    .pipe(transform<number, number[]>(
      (item, _encoding, push) => {
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
    .on('error', done)
    .on('data', check)
    .on('end', () => {
      expect(check.mock.calls.length).toEqual(2);
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
    .on('error', check)
    .on('close', () => {
      expect(check.mock.calls.length).toEqual(1);
      done();
    });
  });

  it('handles errors by closing stream', (done) => {
    const check = jest.fn();

    from([1, 2, 3])
    .pipe(transform(async () => {
      throw new Error('test')
    }))
    .on('error', check)
    .on('close', () => {
      expect(check.mock.calls.length).toEqual(1);
      done();
    });
  });
});
