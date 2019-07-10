import {pipeline, passthrough, transform} from '..';


describe('pipeline', () => {
  it('pipes data through each stream', (done) => {
    const check = jest.fn();
    const source = passthrough<number>();

    pipeline(
      source,
      transform<number, number>((chunk) => chunk * 2),
      transform<number, string>((chunk) => chunk.toString())
    )
      .on('data', check)
      .once('error', done)
      .once('close', () => {
        expect(check.mock.calls.length).toBe(3);
        expect(check.mock.calls[0][0]).toBe('2');
        expect(check.mock.calls[1][0]).toBe('4');
        expect(check.mock.calls[2][0]).toBe('6');
        done();
      });

    source.write(1);
    source.write(2);
    source.end(3);
  });

  it('propogates errors from source', (done) => {
    const check = jest.fn();
    const checkErr = jest.fn();
    const source = passthrough<number>();
    const mid0 = transform<number, number>((chunk) => chunk * 2);
    const mid1 = transform<number, string>((chunk) => chunk.toString());

    pipeline(
      source,
      mid0,
      mid1
    )
      .on('data', check)
      .on('error', checkErr)
      .on('close', () => {
        expect(check.mock.calls.length).toBe(1);
        expect(check.mock.calls[0][0]).toBe('2');

        expect(checkErr.mock.calls.length).toBe(1);
        done();
      });

    source.write(1);
    source.write(2);
    source.destroy(new Error('test'));
  });

  it('propogates errors from middle', (done) => {
    const check = jest.fn();
    const checkErr = jest.fn();
    const source = passthrough<number>();
    let mid0Count = 0;
    const mid0 = transform<number, number>((chunk) => {
      if (mid0Count >= 2) {
        throw new Error('test');
      }
      mid0Count++;
      return chunk * 2;
    });
    const mid1 = transform<number, string>((chunk) => chunk.toString());

    pipeline(
      source,
      mid0,
      mid1
    )
      .on('data', check)
      .on('error', checkErr)
      .on('close', () => {
        expect(check.mock.calls.length).toBe(2);
        expect(check.mock.calls[0][0]).toBe('2');
        expect(check.mock.calls[1][0]).toBe('4');

        expect(checkErr.mock.calls.length).toBe(1);
        done();
      });

    source.write(1);
    source.write(2);
    source.end(3);
  });
});
