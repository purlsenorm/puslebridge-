export interface Token {
  id: string;
  address: string;
  symbol: string;
  name: string;
  decimals?: number;
  image?: string;
  currentPrice: number;
  priceChange24h: number;
  volume24h: number;
  marketCap: number;
  liquidity?: number;
  holders?: number;
  totalSupply?: string;
  circulatingSupply?: number;
  fdv?: number;
  ath?: number;
  atl?: number;
}

export interface PairData {
  pairAddress: string;
  baseToken: {
    address: string;
    symbol: string;
    name: string;
  };
  quoteToken: {
    address: string;
    symbol: string;
    name: string;
  };
  dexId: string;
  priceUsd: string;
  priceNative: string;
  volume24h: number;
  liquidity: number;
  priceChange24h: number;
  txns24h: {
    buys: number;
    sells: number;
  };
}

export interface ChartDataPoint {
  time: number;
  value: number;
  volume?: number;
}

export interface TokenMetrics {
  price: number;
  priceChange1h?: number;
  priceChange24h: number;
  priceChange7d?: number;
  volume24h: number;
  volumeChange24h?: number;
  marketCap: number;
  marketCapRank?: number;
  liquidity: number;
  fdv?: number;
  holders: number;
  txns24h: number;
}
