import { from } from '..';
import { PassThrough } from 'stream';

describe('from', () => {
  it('string', (done) => {
    const check = jest.fn();

    from('hello')
      .each(check)
      .done((err) => {
        expect(err).toBe(undefined);
        expect(check.mock.calls.length).toEqual(5);
        expect(check.mock.calls[0][0]).toEqual('h');
        expect(check.mock.calls[1][0]).toEqual('e');
        expect(check.mock.calls[2][0]).toEqual('l');
        expect(check.mock.calls[3][0]).toEqual('l');
        expect(check.mock.calls[4][0]).toEqual('o');
        done();
      });
  });

  it('array', (done) => {
    const check = jest.fn();

    from([1, 2, 3])
      .each(check)
      .done((err) => {
        expect(err).toBe(undefined);
        expect(check.mock.calls.length).toEqual(3);
        expect(check.mock.calls[0][0]).toEqual(1);
        expect(check.mock.calls[1][0]).toEqual(2);
        expect(check.mock.calls[2][0]).toEqual(3);
        done();
      });
  });

  it('Map', (done) => {
    const check = jest.fn();

    from(new Map([['a', 1], ['b', 2]]))
      .each(check)
      .done((err) => {
        expect(err).toBe(undefined);
        expect(check.mock.calls.length).toEqual(2);
        expect(check.mock.calls[0][0]).toEqual(['a', 1]);
        expect(check.mock.calls[1][0]).toEqual(['b', 2]);
        done();
      });
  });

  it('Set', (done) => {
    const check = jest.fn();

    from(new Set([1, 2, 3]))
      .each(check)
      .done((err) => {
        expect(err).toBe(undefined);
        expect(check.mock.calls.length).toEqual(3);
        expect(check.mock.calls[0][0]).toEqual(1);
        expect(check.mock.calls[1][0]).toEqual(2);
        expect(check.mock.calls[2][0]).toEqual(3);
        done();
      });
  });

  it('Promise', (done) => {
    const check = jest.fn();

    from(Promise.resolve([1, 2, 3]))
      .each(check)
      .done((err) => {
        expect(err).toBe(undefined);
        expect(check.mock.calls.length).toEqual(3);
        expect(check.mock.calls[0][0]).toEqual(1);
        expect(check.mock.calls[1][0]).toEqual(2);
        expect(check.mock.calls[2][0]).toEqual(3);
        done();
      });
  });

  it('Promise Rejection', (done) => {
    const check = jest.fn();

    from(Promise.reject(new Error('test')))
      .each(check)
      .done((err) => {
        expect(err).toEqual(new Error('test'));
        expect(check.mock.calls.length).toEqual(0);
        done();
      });
  });

  it('Stream', (done) => {
    const check = jest.fn();
    const stream = new PassThrough({ objectMode: true });

    from<number>(stream)
      .each(check)
      .done((err) => {
        expect(err).toBe(undefined);
        expect(check.mock.calls.length).toEqual(3);
        expect(check.mock.calls[0][0]).toEqual(1);
        expect(check.mock.calls[1][0]).toEqual(2);
        expect(check.mock.calls[2][0]).toEqual(3);
        done();
      });

    stream.write(1);
    stream.write(2);
    stream.write(3);
    stream.end();
  });

  it('any', (done) => {
    const check = jest.fn();

    from(1)
      .each(check)
      .done((err) => {
        expect(err).toBe(undefined);
        expect(check.mock.calls.length).toEqual(1);
        expect(check.mock.calls[0][0]).toEqual(1);
        done();
      });
  });
});
