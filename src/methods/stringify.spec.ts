import { stringify } from '..';
import { from } from './from';

describe('stringify', () => {
  it('stringifies data', (done) => {
    const check = jest.fn();

    let stringified = '';
    const data = [{ a: 1 }, { b: 2 }, { c: 3 }];

    from(data)
      .pipe(stringify())
      .each(check)
      .each((str) => (stringified += str))
      .done((err) => {
        expect(err).toBe(undefined);
        expect(stringified).toEqual(JSON.stringify(data));
        done();
      });
  });

  it('stringifies data with spacing', (done) => {
    const check = jest.fn();

    let stringified = '';
    const data = [{ a: 1 }, { b: 2 }, { c: 3 }];

    from(data)
      .pipe(stringify(null, 2))
      .each(check)
      .each((str) => (stringified += str))
      .done((err) => {
        expect(err).toBe(undefined);
        expect(stringified).toEqual(JSON.stringify(data, null, 2));
        done();
      });
  });
});
