import axios from 'axios';

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

export interface TokenPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  atl: number;
  image: string;
}

export interface TokenMarketData {
  prices: [number, number][]; // [timestamp, price]
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

const coinGeckoClient = axios.create({
  baseURL: COINGECKO_API_BASE,
  headers: {
    'Accept': 'application/json',
    ...(process.env.NEXT_PUBLIC_COINGECKO_API_KEY && {
      'x-cg-pro-api-key': process.env.NEXT_PUBLIC_COINGECKO_API_KEY,
    }),
  },
});

/**
 * Get list of tokens on PulseChain
 */
export async function getPulseChainTokens(page = 1, perPage = 50): Promise<TokenPrice[]> {
  try {
    const response = await coinGeckoClient.get('/coins/markets', {
      params: {
        vs_currency: 'usd',
        category: 'pulsechain-ecosystem',
        order: 'market_cap_desc',
        per_page: perPage,
        page: page,
        sparkline: false,
        price_change_percentage: '24h',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching PulseChain tokens from CoinGecko:', error);
    return [];
  }
}

/**
 * Get token details by ID
 */
export async function getTokenDetails(tokenId: string) {
  try {
    const response = await coinGeckoClient.get(`/coins/${tokenId}`, {
      params: {
        localization: false,
        tickers: true,
        market_data: true,
        community_data: false,
        developer_data: false,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching token details for ${tokenId}:`, error);
    throw error;
  }
}

/**
 * Get token market chart data (price history)
 */
export async function getTokenMarketChart(
  tokenId: string,
  days: number = 7
): Promise<TokenMarketData | null> {
  try {
    const response = await coinGeckoClient.get(`/coins/${tokenId}/market_chart`, {
      params: {
        vs_currency: 'usd',
        days: days,
        interval: days === 1 ? 'hourly' : 'daily',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching market chart for ${tokenId}:`, error);
    return null;
  }
}

/**
 * Search tokens by query
 */
export async function searchTokens(query: string) {
  try {
    const response = await coinGeckoClient.get('/search', {
      params: { query },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching tokens:', error);
    return { coins: [], exchanges: [], categories: [] };
  }
}

/**
 * Get trending tokens
 */
export async function getTrendingTokens() {
  try {
    const response = await coinGeckoClient.get('/search/trending');
    return response.data.coins || [];
  } catch (error) {
    console.error('Error fetching trending tokens:', error);
    return [];
  }
}
