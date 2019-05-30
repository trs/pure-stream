import { passthrough } from './passthrough';

describe('passthrough', () => {
  it('creates a simple passthrough stream', (done) => {
    const check = jest.fn();

    const stream = passthrough<number>()
    .on('error', done)
    .on('error', done)
    .on('data', check)
    .on('end', () => {
      expect(check.mock.calls.length).toEqual(3);
      expect(check.mock.calls[0][0]).toEqual(1);
      expect(check.mock.calls[1][0]).toEqual(2);
      expect(check.mock.calls[2][0]).toEqual(3);
      done();
    });

    stream.push(1);
    stream.push(2);
    stream.end(3);
  });
});
