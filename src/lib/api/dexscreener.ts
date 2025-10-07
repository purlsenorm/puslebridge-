import axios from 'axios';

const DEXSCREENER_API_BASE = 'https://api.dexscreener.com/latest/dex';

export interface DexPair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceNative: string;
  priceUsd: string;
  txns: {
    m5: { buys: number; sells: number };
    h1: { buys: number; sells: number };
    h6: { buys: number; sells: number };
    h24: { buys: number; sells: number };
  };
  volume: {
    h24: number;
    h6: number;
    h1: number;
    m5: number;
  };
  priceChange: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  liquidity: {
    usd: number;
    base: number;
    quote: number;
  };
  fdv: number;
  pairCreatedAt: number;
}

const dexScreenerClient = axios.create({
  baseURL: DEXSCREENER_API_BASE,
  headers: {
    'Accept': 'application/json',
  },
});

/**
 * Get pairs for a specific token address on PulseChain
 */
export async function getTokenPairs(tokenAddress: string): Promise<DexPair[]> {
  try {
    const response = await dexScreenerClient.get(`/tokens/${tokenAddress}`);

    if (response.data.pairs) {
      // Filter for PulseChain pairs only
      return response.data.pairs.filter(
        (pair: DexPair) => pair.chainId === 'pulsechain'
      );
    }
    return [];
  } catch (error) {
    console.error('Error fetching token pairs from DexScreener:', error);
    return [];
  }
}

/**
 * Get specific pair information
 */
export async function getPairInfo(pairAddress: string): Promise<DexPair | null> {
  try {
    const response = await dexScreenerClient.get(`/pairs/pulsechain/${pairAddress}`);

    if (response.data.pair) {
      return response.data.pair;
    }
    return null;
  } catch (error) {
    console.error('Error fetching pair info from DexScreener:', error);
    return null;
  }
}

/**
 * Search for tokens/pairs on PulseChain
 */
export async function searchPairs(query: string): Promise<DexPair[]> {
  try {
    const response = await dexScreenerClient.get(`/search?q=${encodeURIComponent(query)}`);

    if (response.data.pairs) {
      // Filter for PulseChain pairs only
      return response.data.pairs.filter(
        (pair: DexPair) => pair.chainId === 'pulsechain'
      );
    }
    return [];
  } catch (error) {
    console.error('Error searching pairs on DexScreener:', error);
    return [];
  }
}

/**
 * Get top PulseChain pairs by searching for popular tokens
 */
export async function getTopPulseChainPairs(limit = 50): Promise<DexPair[]> {
  try {
    // Search for popular PulseChain tokens
    const popularTokens = ['PLS', 'PLSX', 'HEX', 'INC', 'USDC'];
    const allPairs: DexPair[] = [];

    for (const token of popularTokens) {
      try {
        const response = await dexScreenerClient.get(`/search?q=${token}`);
        if (response.data.pairs) {
          const pulsechainPairs = response.data.pairs.filter(
            (pair: DexPair) => pair.chainId === 'pulsechain'
          );
          allPairs.push(...pulsechainPairs);
        }
      } catch (err) {
        console.error(`Error searching for ${token}:`, err);
      }
    }

    // Remove duplicates and sort by volume
    const uniquePairs = Array.from(
      new Map(allPairs.map(pair => [pair.pairAddress, pair])).values()
    );

    return uniquePairs
      .sort((a, b) => (b.volume?.h24 || 0) - (a.volume?.h24 || 0))
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching top PulseChain pairs:', error);
    return [];
  }
}

/**
 * Get top pairs by volume on PulseChain
 */
export async function getTopPairs(limit = 20): Promise<DexPair[]> {
  return getTopPulseChainPairs(limit);
}

/**
 * Get new pairs (recently created) on PulseChain
 */
export async function getNewPairs(hoursAgo = 24): Promise<DexPair[]> {
  try {
    // This would need to be implemented based on available DexScreener endpoints
    // Placeholder for now
    const cutoffTime = Date.now() - (hoursAgo * 60 * 60 * 1000);

    // In a real implementation, you'd query recent pairs
    // For now, returning empty array as placeholder
    return [];
  } catch (error) {
    console.error('Error fetching new pairs from DexScreener:', error);
    return [];
  }
}
