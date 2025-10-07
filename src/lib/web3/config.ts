import { http, createConfig } from 'wagmi';
import { pulsechain } from 'wagmi/chains';
import { injected, walletConnect } from 'wagmi/connectors';

// Define PulseChain if not available in wagmi/chains
export const pulsechainConfig = {
  id: 369,
  name: 'PulseChain',
  nativeCurrency: {
    decimals: 18,
    name: 'Pulse',
    symbol: 'PLS',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.pulsechain.com'],
    },
    public: {
      http: ['https://rpc.pulsechain.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'PulseScan',
      url: 'https://scan.pulsechain.com',
    },
  },
} as const;

export const config = createConfig({
  chains: [pulsechainConfig as any],
  connectors: [
    injected(),
    // Add WalletConnect if you have a project ID
    // walletConnect({ projectId: 'YOUR_PROJECT_ID' }),
  ],
  transports: {
    [pulsechainConfig.id]: http(),
  },
});
