import { from, passthrough } from '..';

describe('from', () => {
  it('string', (done) => {
    const check = jest.fn();

    from('hello')
      .on('data', check)
      .once('end', () => {
        expect(check.mock.calls.length).toEqual(5);
        expect(check.mock.calls[0][0]).toEqual('h');
        expect(check.mock.calls[1][0]).toEqual('e');
        expect(check.mock.calls[2][0]).toEqual('l');
        expect(check.mock.calls[3][0]).toEqual('l');
        expect(check.mock.calls[4][0]).toEqual('o');
        done();
      })
      .once('error', done);
  });

  it('array', (done) => {
    const check = jest.fn();

    from([1, 2, 3])
      .on('data', check)
      .once('end', () => {
        expect(check.mock.calls.length).toEqual(3);
        expect(check.mock.calls[0][0]).toEqual(1);
        expect(check.mock.calls[1][0]).toEqual(2);
        expect(check.mock.calls[2][0]).toEqual(3);
        done();
      })
      .once('error', done);
  });

  it('Map', (done) => {
    const check = jest.fn();

    from(new Map([
      ['a', 1],
      ['b', 2]
    ]))
      .on('data', check)
      .once('end', () => {
        expect(check.mock.calls.length).toEqual(2);
        expect(check.mock.calls[0][0]).toEqual(['a', 1]);
        expect(check.mock.calls[1][0]).toEqual(['b', 2]);
        done();
      })
      .once('error', done);
  });

  it('Set', (done) => {
    const check = jest.fn();

    from(new Set([1, 2, 3]))
      .on('data', check)
      .once('end', () => {
        expect(check.mock.calls.length).toEqual(3);
        expect(check.mock.calls[0][0]).toEqual(1);
        expect(check.mock.calls[1][0]).toEqual(2);
        expect(check.mock.calls[2][0]).toEqual(3);
        done();
      })
      .once('error', done);
  });

  it('Promise', (done) => {
    const check = jest.fn();

    from(Promise.resolve([1, 2, 3]))
      .on('data', check)
      .once('end', () => {
        expect(check.mock.calls.length).toEqual(3);
        expect(check.mock.calls[0][0]).toEqual(1);
        expect(check.mock.calls[1][0]).toEqual(2);
        expect(check.mock.calls[2][0]).toEqual(3);
        done();
      })
      .once('error', done);
  });

  it('Stream', (done) => {
    const check = jest.fn();
    const stream = passthrough<number>();

    from(stream)
      .on('data', check)
      .once('end', () => {
        expect(check.mock.calls.length).toEqual(3);
        expect(check.mock.calls[0][0]).toEqual(1);
        expect(check.mock.calls[1][0]).toEqual(2);
        expect(check.mock.calls[2][0]).toEqual(3);
        done();
      })
      .once('error', done);

    stream.write(1);
    stream.write(2);
    stream.write(3);
    stream.end();
  });

  it('any', (done) => {
    const check = jest.fn();

    from(1)
      .on('data', check)
      .once('end', () => {
        expect(check.mock.calls.length).toEqual(1);
        expect(check.mock.calls[0][0]).toEqual(1);
        done();
      })
      .once('error', done);
  })
});
