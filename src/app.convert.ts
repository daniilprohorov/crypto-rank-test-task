import { PricesDict } from './app.types';
import { create, all } from 'mathjs';

export class ConvertError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConvertError';
  }
}

export function convert(
  from: string,
  to: string,
  amount: number,
  storage: PricesDict,
): number {
  if (amount < 0) {
    throw new ConvertError('Amount is less than 0');
  }
  if (!storage.has(from)) {
    throw new ConvertError(`Storage does not contain coin ${from}`);
  }
  if (!storage.has(to)) {
    throw new ConvertError(`Storage does not contain coin ${to}`);
  }
  const math = create(all);
  math.config({
    number: 'BigNumber',
  });
  const fromPrice = storage.get(from);
  const toPrice = storage.get(to);
  const res = math.evaluate(`${fromPrice} / ${toPrice} * ${amount}`);
  // console.log(res);
  return math.number(res);
}
