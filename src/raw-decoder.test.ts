import { RawDecoder } from './raw-decoder';

describe('RawDecoder', () => {
  it.each([
    ['', ''],
    [undefined, undefined],
  ])('valueOf() is %p', (input, result) => {
    // @ts-ignore
    const decoder = new RawDecoder(input);
    expect(decoder.valueOf()).toEqual(result);
  });

  it.each([
    [{ id: '' }, ''],
    [{} as { id: string }, undefined],
  ])('valueOf() is %p', (input, result) => {
    // @ts-ignore
    const decoder = new RawDecoder(input);
    expect(decoder.getProperty('id').valueOf()).toEqual(result);
  });

  it.each([
    [undefined, ''],
    [null, ''],
    [[], ''],
    [{}, ''],
    ['abc', 'abc'],
    [123, '123'],
  ])('asString(%p) is %p', (input, result) => {
    // @ts-ignore
    const decoder = new RawDecoder(input);
    expect(decoder.asString()).toEqual(result);
  });

  it.each([
    [undefined, 0],
    [null, 0],
    ['1', 1],
    [NaN, 0],
    [123, 123],
  ])('asNumber(%p) is %p', (input, result) => {
    // @ts-ignore
    const decoder = new RawDecoder(input);
    expect(decoder.asNumber()).toEqual(result);
  });

  it.each([
    [undefined, false],
    [null, false],
    [0, false],
    [1, true],
    ['', false],
    [NaN, false],
    ['true', true],
    ['false', true],
  ])('asBoolean(%p,%p) is %p', (input, result) => {
    // @ts-ignore
    const decoder = new RawDecoder(input);
    expect(decoder.asBoolean()).toEqual(result);
  });

  it.each([
    [{}, (r: RawDecoder<{}>) => r, []],
    [null, (r: RawDecoder<{}>) => r, []],
    [undefined, (r: RawDecoder<{}>) => r, []],
    [[1], (r: RawDecoder<number>) => r.asNumber(), [1]],
    [['1'], (r: RawDecoder<number>) => r.asString(), ['1']],
    [[{ a: 'a' }], (r: RawDecoder<{ a: 'a' }>) => r.getProperty('a').asString(), ['a']],
  ])('asArray(%p, %s) is %p', (input, iteratte, result) => {
    // @ts-ignore
    const decoder = new RawDecoder(input);
    // @ts-ignore
    expect(decoder.asArray(iteratte)).toEqual(result);
  });

  it.each([
    ['{}', {}],
    ['', undefined],
    [null, undefined],
    [undefined, undefined],
  ])('asJSON(%p) is %p', (input, result) => {
    // @ts-ignore
    const decoder = new RawDecoder(input);
    expect(decoder.asJSON()).toEqual(result);
  });

  it.each([
    [{}, undefined, {}],
    [null, {}, {}],
    [undefined, {}, {}],
    [{ a: 'a' }, undefined, { a: 'a' }],
    [[{ a: 'a' }], undefined, {}],
    [NaN, { a: 'a' }, { a: 'a' }],
  ])('asObject(%p) is %p', (input, defaultValue, result) => {
    // @ts-ignore
    const decoder = new RawDecoder(input);
    expect(decoder.asObject(defaultValue)).toEqual(result);
  })
});
