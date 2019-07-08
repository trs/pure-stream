import { PureStream } from './PureStream';
import { PassThrough } from 'stream';

describe('PureStream', () => {
  describe('pipe', () => {
    it('pipes errors from source', (done) => {
      const source = new PureStream();
      const dest = new PureStream();

      source
        .pipe(dest)
        .done((err) => {
          expect(source.ended).toBe(true);
          expect(dest.ended).toBe(true);
          expect(err).toEqual(new Error('test'));
          done();
        });

      source.write(1);
      source.destroy(new Error('test'));
    });

    it('pipes errors from dest', (done) => {
      const source = new PureStream();
      const dest = new PureStream();

      source
        .pipe(dest)
        .done((err) => {
          expect(source.ended).toBe(false);
          expect(dest.ended).toBe(true);
          expect(err).toEqual(new Error('test'));
          done();
        });

      source.write(1);
      dest.destroy(new Error('test'));
    });
  });

  describe('wrap', () => {
    it('wraps native stream', (done) => {
      const source = new PassThrough({objectMode: true});
      const dest = new PureStream();

      PureStream.wrap(source).pipe(dest).done((err) => {
        expect(err).toEqual(new Error('test'));
        done();
      });

      source.write(1);
      source.destroy(new Error('test'));
    });
  })
});