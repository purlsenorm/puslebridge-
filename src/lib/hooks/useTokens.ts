import { useQuery } from '@tanstack/react-query';
import { getTokenPrice, getTokenMetadata, getTokenStats, getWalletTokens } from '@/lib/api/moralis';
import { getTokenPairs, searchPairs } from '@/lib/api/dexscreener';
import { getTokenInfo } from '@/lib/api/pulsechain';

/**
 * Hook to fetch all PulseChain tokens from DexScreener
 * Since we don't have CoinGecko, we'll use DexScreener for token discovery
 */
export function useTokens(page = 1, perPage = 50) {
  return useQuery({
    queryKey: ['tokens', 'pulsechain', page, perPage],
    queryFn: async () => {
      // Import getTopPulseChainPairs
      const { getTopPulseChainPairs } = await import('@/lib/api/dexscreener');

      // Get top trading pairs on PulseChain
      const pairs = await getTopPulseChainPairs(100); // Get more to support pagination

      if (!pairs || pairs.length === 0) {
        return [];
      }

      // Paginate and transform DexScreener data to our token format
      const start = (page - 1) * perPage;
      const end = start + perPage;

      return pairs.slice(start, end).map((pair) => ({
        id: pair.baseToken.address,
        address: pair.baseToken.address,
        symbol: pair.baseToken.symbol,
        name: pair.baseToken.name,
        image: undefined,
        current_price: parseFloat(pair.priceUsd || '0'),
        price_change_percentage_24h: pair.priceChange?.h24 || 0,
        total_volume: pair.volume?.h24 || 0,
        market_cap: pair.fdv || 0,
        market_cap_rank: undefined,
        liquidity: pair.liquidity?.usd || 0,
      }));
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook to fetch specific token details using multiple sources
 */
export function useTokenDetails(tokenAddress: string) {
  return useQuery({
    queryKey: ['token', tokenAddress],
    queryFn: async () => {
      // Fetch data from multiple sources
      const [price, metadata, stats, pairs] = await Promise.all([
        getTokenPrice(tokenAddress),
        getTokenMetadata([tokenAddress]),
        getTokenStats(tokenAddress),
        getTokenPairs(tokenAddress),
      ]);

      const tokenMetadata = metadata[0];
      const mainPair = pairs[0];

      return {
        address: tokenAddress,
        name: tokenMetadata?.name || mainPair?.baseToken.name || 'Unknown',
        symbol: tokenMetadata?.symbol || mainPair?.baseToken.symbol || '???',
        decimals: parseInt(tokenMetadata?.decimals || '18'),
        logo: tokenMetadata?.logo,
        price: price?.usdPrice || parseFloat(mainPair?.priceUsd || '0'),
        priceChange24h: parseFloat(price?.['24hrPercentChange'] || mainPair?.priceChange.h24.toString() || '0'),
        volume24h: mainPair?.volume.h24 || 0,
        liquidity: mainPair?.liquidity.usd || 0,
        fdv: mainPair?.fdv,
        pairs: pairs,
        stats: stats,
      };
    },
    enabled: !!tokenAddress,
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook to fetch token market chart data
 * Note: Since we don't have historical price data from free APIs,
 * this will return limited data from DexScreener
 */
export function useTokenChart(tokenAddress: string, days = 7) {
  return useQuery({
    queryKey: ['token-chart', tokenAddress, days],
    queryFn: async () => {
      // DexScreener provides limited historical data
      // For a full chart, you'd need a paid service or custom indexer
      const pairs = await getTokenPairs(tokenAddress);

      if (!pairs || pairs.length === 0) {
        return { prices: [], market_caps: [], total_volumes: [] };
      }

      // Generate mock historical data based on current price and 24h change
      const currentPrice = parseFloat(pairs[0].priceUsd);
      const change24h = pairs[0].priceChange.h24;

      // Simple mock data - in production, use a proper historical API
      const now = Date.now();
      const prices: [number, number][] = [];

      for (let i = days * 24; i >= 0; i--) {
        const timestamp = now - (i * 60 * 60 * 1000);
        const variance = (Math.random() - 0.5) * (Math.abs(change24h) / 10);
        const price = currentPrice * (1 - (change24h / 100) * (i / 24) + variance);
        prices.push([timestamp, price]);
      }

      return {
        prices,
        market_caps: [],
        total_volumes: [],
      };
    },
    enabled: !!tokenAddress,
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook to fetch token pairs from DexScreener
 */
export function useTokenPairs(tokenAddress: string) {
  return useQuery({
    queryKey: ['token-pairs', tokenAddress],
    queryFn: () => getTokenPairs(tokenAddress),
    enabled: !!tokenAddress,
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook to fetch wallet token balances using Moralis
 */
export function useWalletTokens(walletAddress: string | undefined) {
  return useQuery({
    queryKey: ['wallet-tokens', walletAddress],
    queryFn: () => getWalletTokens(walletAddress!),
    enabled: !!walletAddress,
    staleTime: 30 * 1000, // 30 seconds
  });
}
