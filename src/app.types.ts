export interface CoinInfo {
  key: string;
  price: number;
  volume: number;
}
export interface Prices {
  data: Array<CoinInfo>;
}

export type PricesDict = Map<string, number>;
