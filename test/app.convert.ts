import { convert, ConvertError } from '../src/app.convert';

test('convert 100 btc to eth', () => {
  const pricesDict = new Map([
    ['btc', 29874.344801255054],
    ['eth', 1915.841425979884],
  ]);
  const res = convert('btc', 'eth', 100, pricesDict);
  expect(res).toBe(
    1559.3328548042748814155993688772842084396683513079920052605186579,
  );
});

test('not equal', () => {
  const pricesDict = new Map([
    ['btc', 29874.344801255054],
    ['eth', 1915.841425979884],
  ]);
  const res = convert('btc', 'eth', 100, pricesDict);
  expect(res).not.toBe(1559);
});

test('100 btc to eth and back eth to btc have to be equal 100', () => {
  const pricesDict = new Map([
    ['btc', 29874.344801255054],
    ['eth', 1915.841425979884],
  ]);
  const eth = convert('btc', 'eth', 100, pricesDict);
  const btc = convert('eth', 'btc', eth, pricesDict);
  expect(btc).toBe(100);
});

test('convert 100 btc to eth', () => {
  const pricesDict = new Map([
    ['btc', 29874.344801255054],
    ['eth', 1915.841425979884],
  ]);
  const res = convert(
    'btc',
    'eth',
    0.00000000000000000000000000000000000000001,
    pricesDict,
  );
  expect(res).toBe(
    1.5593328548042748814155993688772842084396683513079920052605e-40,
  );
});

test('convert -100 btc to eth', () => {
  const pricesDict = new Map([
    ['btc', 29874.344801255054],
    ['eth', 1915.841425979884],
  ]);
  const fn = () => convert('btc', 'eth', -100, pricesDict);
  expect(fn).toThrow(ConvertError);
});

test('convert 100 lolcoins to eth', () => {
  const pricesDict = new Map([
    ['btc', 29874.344801255054],
    ['eth', 1915.841425979884],
  ]);
  const fn = () => convert('lolcoins', 'eth', 100, pricesDict);
  expect(fn).toThrow(ConvertError);
});

test('convert 100 eth to kekcoins', () => {
  const pricesDict = new Map([
    ['btc', 29874.344801255054],
    ['eth', 1915.841425979884],
  ]);
  const fn = () => convert('eth', 'kekoins', 100, pricesDict);
  expect(fn).toThrow(ConvertError);
});
