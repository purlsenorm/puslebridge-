import axios from 'axios';

const MORALIS_API_BASE = 'https://deep-index.moralis.io/api/v2.2';
const MORALIS_API_KEY = process.env.NEXT_PUBLIC_MORALIS_API_KEY;

export interface MoralisToken {
  token_address: string;
  name: string;
  symbol: string;
  logo: string | null;
  thumbnail: string | null;
  decimals: number;
  balance: string;
  possible_spam: boolean;
  verified_collection: boolean;
  total_supply: string;
  total_supply_formatted: string;
  percentage_relative_to_total_supply: number;
}

export interface MoralisTokenPrice {
  tokenAddress: string;
  usdPrice: number;
  usdPriceFormatted: string;
  '24hrPercentChange': string;
  exchangeAddress: string;
  exchangeName: string;
}

export interface MoralisTokenMetadata {
  address: string;
  name: string;
  symbol: string;
  decimals: string;
  logo: string | null;
  logo_hash: string | null;
  thumbnail: string | null;
  total_supply: string;
  block_number: string;
  validated: number;
  created_at: string;
}

const moralisClient = axios.create({
  baseURL: MORALIS_API_BASE,
  headers: {
    'Accept': 'application/json',
    'X-API-Key': MORALIS_API_KEY || '',
  },
});

// PulseChain chain ID
const PULSECHAIN_CHAIN_ID = '0x171'; // 369 in hex

/**
 * Get token price from Moralis
 */
export async function getTokenPrice(tokenAddress: string): Promise<MoralisTokenPrice | null> {
  try {
    const response = await moralisClient.get(`/erc20/${tokenAddress}/price`, {
      params: {
        chain: PULSECHAIN_CHAIN_ID,
        include: 'percent_change',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching token price for ${tokenAddress}:`, error);
    return null;
  }
}

/**
 * Get token metadata
 */
export async function getTokenMetadata(tokenAddresses: string[]): Promise<MoralisTokenMetadata[]> {
  try {
    const response = await moralisClient.get('/erc20/metadata', {
      params: {
        chain: PULSECHAIN_CHAIN_ID,
        addresses: tokenAddresses.join(','),
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    return [];
  }
}

/**
 * Get wallet token balances
 */
export async function getWalletTokens(walletAddress: string): Promise<MoralisToken[]> {
  try {
    const response = await moralisClient.get(`/${walletAddress}/erc20`, {
      params: {
        chain: PULSECHAIN_CHAIN_ID,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching wallet tokens for ${walletAddress}:`, error);
    return [];
  }
}

/**
 * Get token transfers for an address
 */
export async function getTokenTransfers(tokenAddress: string, limit = 10) {
  try {
    const response = await moralisClient.get(`/erc20/${tokenAddress}/transfers`, {
      params: {
        chain: PULSECHAIN_CHAIN_ID,
        limit,
      },
    });
    return response.data.result || [];
  } catch (error) {
    console.error(`Error fetching token transfers for ${tokenAddress}:`, error);
    return [];
  }
}

/**
 * Get token stats (holders, transfers count, etc.)
 */
export async function getTokenStats(tokenAddress: string) {
  try {
    const response = await moralisClient.get(`/erc20/${tokenAddress}/stats`, {
      params: {
        chain: PULSECHAIN_CHAIN_ID,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching token stats for ${tokenAddress}:`, error);
    return null;
  }
}

/**
 * Get top ERC20 tokens by market cap on PulseChain
 */
export async function getTopTokens(limit = 50) {
  try {
    // Moralis doesn't have a direct "top tokens" endpoint
    // We'll need to use DexScreener or another source for this
    // For now, return empty array and rely on DexScreener
    console.warn('Moralis does not provide top tokens endpoint. Use DexScreener instead.');
    return [];
  } catch (error) {
    console.error('Error fetching top tokens:', error);
    return [];
  }
}

/**
 * Get multiple token prices in batch
 */
export async function getBatchTokenPrices(tokenAddresses: string[]): Promise<Record<string, MoralisTokenPrice>> {
  try {
    const prices: Record<string, MoralisTokenPrice> = {};

    // Moralis doesn't have batch price endpoint, so we'll fetch individually
    // In production, you might want to implement caching or rate limiting
    const pricePromises = tokenAddresses.map(async (address) => {
      const price = await getTokenPrice(address);
      if (price) {
        prices[address.toLowerCase()] = price;
      }
    });

    await Promise.all(pricePromises);
    return prices;
  } catch (error) {
    console.error('Error fetching batch token prices:', error);
    return {};
  }
}

/**
 * Search tokens by name or symbol
 */
export async function searchTokens(query: string) {
  try {
    // Moralis doesn't have a search endpoint
    // We'll need to implement this using other methods or DexScreener
    console.warn('Moralis does not provide search endpoint. Use DexScreener instead.');
    return [];
  } catch (error) {
    console.error('Error searching tokens:', error);
    return [];
  }
}
