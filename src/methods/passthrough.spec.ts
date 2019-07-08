import { passthrough } from '..';

describe('passthrough', () => {
  it('creates a simple passthrough stream', (done) => {
    const check = jest.fn();

    const stream = passthrough<number>().each(check);

    stream.done((err) => {
      expect(err).toBe(undefined);
      expect(check.mock.calls.length).toEqual(3);
      expect(check.mock.calls[0][0]).toEqual(1);
      expect(check.mock.calls[1][0]).toEqual(2);
      expect(check.mock.calls[2][0]).toEqual(3);
      done();
    });

    stream.write(1);
    stream.write(2);
    stream.end(3);
  });
});
