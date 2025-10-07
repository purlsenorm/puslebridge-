import { http, createConfig } from 'wagmi';
import { injected } from 'wagmi/connectors';
import type { Chain } from 'wagmi/chains';

// Define PulseChain chain configuration
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
} as const satisfies Chain;

export const config = createConfig({
  chains: [pulsechainConfig],
  connectors: [
    injected(),
    // Add WalletConnect if you have a project ID
    // walletConnect({ projectId: 'YOUR_PROJECT_ID' }),
  ],
  transports: {
    [pulsechainConfig.id]: http(),
  },
});
