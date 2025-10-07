import axios from 'axios';

const PULSECHAIN_RPC_URL = process.env.NEXT_PUBLIC_PULSECHAIN_RPC_URL || 'https://rpc.pulsechain.com';
const BLOCKSCOUT_API_BASE = 'https://api.scan.pulsechain.com/api';

export interface TokenInfo {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
  blockNumber: string;
  gasUsed: string;
  gasPrice: string;
}

const rpcClient = axios.create({
  baseURL: PULSECHAIN_RPC_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const blockscoutClient = axios.create({
  baseURL: BLOCKSCOUT_API_BASE,
});

/**
 * Make RPC call to PulseChain
 */
async function rpcCall(method: string, params: any[] = []) {
  const response = await rpcClient.post('', {
    jsonrpc: '2.0',
    id: 1,
    method,
    params,
  });
  return response.data.result;
}

/**
 * Get token balance for an address
 */
export async function getTokenBalance(tokenAddress: string, walletAddress: string): Promise<string> {
  try {
    // ERC20 balanceOf function signature
    const data = `0x70a08231000000000000000000000000${walletAddress.slice(2)}`;
    const balance = await rpcCall('eth_call', [
      {
        to: tokenAddress,
        data,
      },
      'latest',
    ]);
    return balance;
  } catch (error) {
    console.error('Error fetching token balance:', error);
    return '0';
  }
}

/**
 * Get token information from contract
 */
export async function getTokenInfo(tokenAddress: string): Promise<Partial<TokenInfo>> {
  try {
    const response = await blockscoutClient.get('', {
      params: {
        module: 'token',
        action: 'getToken',
        contractaddress: tokenAddress,
      },
    });

    if (response.data.status === '1' && response.data.result) {
      return {
        address: tokenAddress,
        name: response.data.result.name,
        symbol: response.data.result.symbol,
        decimals: parseInt(response.data.result.decimals),
        totalSupply: response.data.result.totalSupply,
      };
    }
    return {};
  } catch (error) {
    console.error('Error fetching token info:', error);
    return {};
  }
}

/**
 * Get token holders count
 */
export async function getTokenHolders(tokenAddress: string): Promise<number> {
  try {
    const response = await blockscoutClient.get('', {
      params: {
        module: 'token',
        action: 'getTokenHolders',
        contractaddress: tokenAddress,
      },
    });

    if (response.data.status === '1' && response.data.result) {
      return response.data.result.length;
    }
    return 0;
  } catch (error) {
    console.error('Error fetching token holders:', error);
    return 0;
  }
}

/**
 * Get transactions for a token
 */
export async function getTokenTransactions(
  tokenAddress: string,
  page = 1,
  offset = 10
): Promise<Transaction[]> {
  try {
    const response = await blockscoutClient.get('', {
      params: {
        module: 'account',
        action: 'tokentx',
        contractaddress: tokenAddress,
        page,
        offset,
        sort: 'desc',
      },
    });

    if (response.data.status === '1' && response.data.result) {
      return response.data.result;
    }
    return [];
  } catch (error) {
    console.error('Error fetching token transactions:', error);
    return [];
  }
}

/**
 * Get current gas price
 */
export async function getGasPrice(): Promise<string> {
  try {
    const gasPrice = await rpcCall('eth_gasPrice');
    return gasPrice;
  } catch (error) {
    console.error('Error fetching gas price:', error);
    return '0';
  }
}

/**
 * Get latest block number
 */
export async function getBlockNumber(): Promise<number> {
  try {
    const blockNumber = await rpcCall('eth_blockNumber');
    return parseInt(blockNumber, 16);
  } catch (error) {
    console.error('Error fetching block number:', error);
    return 0;
  }
}
