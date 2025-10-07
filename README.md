# PulseBridge - PulseChain Token Monitor

A modern, real-time monitoring and analytics platform for all tokens trading on PulseChain, featuring advanced charting powered by TradingView.

## Features

- 🔍 **Token Explorer**: Browse and search all tokens on PulseChain
- 📊 **Advanced Charts**: TradingView-powered charting with technical indicators
- 💰 **Real-time Prices**: Live token prices and 24h changes from multiple sources
- 🔗 **DEX Analytics**: Track liquidity pools and trading volumes across DEXs
- 💼 **Portfolio Tracking**: Connect wallet to track your holdings
- 🌓 **Dark/Light Mode**: Beautiful minimalist UI with theme support
- ⚡ **Real-time Updates**: Automatic data refresh every 30 seconds

## Tech Stack

- **Frontend**: Next.js 14+ with App Router, TypeScript
- **UI**: shadcn/ui components, Tailwind CSS
- **Charting**: TradingView Advanced Charts
- **State**: Zustand for global state, TanStack Query for data fetching
- **Web3**: Wagmi v2 for wallet connections
- **APIs**:
  - CoinGecko (token prices and market data)
  - BlockScout (on-chain data)
  - DexScreener (DEX analytics)
  - PulseChain RPC (direct blockchain queries)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pulsebridge
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your API keys:
- `NEXT_PUBLIC_COINGECKO_API_KEY` (optional, for higher rate limits)
- `NEXT_PUBLIC_MORALIS_API_KEY` (optional, for additional data sources)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                      # Next.js app router pages
│   ├── page.tsx             # Home page (token list)
│   └── token/[id]/          # Token detail pages
├── components/
│   ├── chart/               # Chart components
│   ├── layout/              # Header, Footer
│   ├── tokens/              # Token-related components
│   ├── ui/                  # shadcn/ui components
│   └── web3/                # Web3 wallet components
├── lib/
│   ├── api/                 # API integrations
│   │   ├── coingecko.ts    # CoinGecko API
│   │   ├── dexscreener.ts  # DexScreener API
│   │   └── pulsechain.ts   # PulseChain RPC/BlockScout
│   ├── hooks/               # Custom React hooks
│   ├── providers/           # React context providers
│   ├── store/               # Zustand stores
│   ├── types/               # TypeScript types
│   ├── utils/               # Utility functions
│   └── web3/                # Web3 configuration
```

## API Integration

### CoinGecko
Provides token prices, market cap, volume, and historical data. Free tier includes:
- 50 calls/minute without API key
- Higher limits with API key

### DexScreener
Real-time DEX trading data including:
- Token pairs
- Liquidity information
- Trading volume
- Price changes

### PulseChain BlockScout
On-chain data including:
- Token information
- Transaction history
- Holder counts
- Contract details

## TradingView Integration

To enable the full TradingView Advanced Charts:

1. Download the TradingView Charting Library from [TradingView](https://www.tradingview.com/charting-library/)
2. Place the library files in `public/charting_library/`
3. Implement a custom datafeed in `src/lib/tradingview/datafeed.ts`
4. Update the `TradingViewChart` component to initialize the widget

See the TradingView documentation for detailed integration steps.

## Web3 Wallet Support

Connect your wallet to:
- Track your token portfolio
- View your holdings in real-time
- Monitor portfolio performance

Supported wallets:
- MetaMask
- WalletConnect (with configuration)
- Any injected Web3 wallet

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Build the production bundle:
```bash
npm run build
npm start
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_COINGECKO_API_KEY` | CoinGecko API key for higher rate limits | No |
| `NEXT_PUBLIC_MORALIS_API_KEY` | Moralis API key for additional data | No |
| `NEXT_PUBLIC_PULSECHAIN_RPC_URL` | PulseChain RPC endpoint | Yes |
| `NEXT_PUBLIC_APP_NAME` | Application name | No |
| `NEXT_PUBLIC_APP_URL` | Application URL | No |
| `REDIS_URL` | Redis connection string for caching | No |

## Performance Optimization

- Data is cached for 30 seconds to reduce API calls
- Images are optimized with Next.js Image component
- Components use React.memo where appropriate
- Lazy loading for heavy components

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Acknowledgments

- [PulseChain](https://pulsechain.com) for the blockchain
- [shadcn/ui](https://ui.shadcn.com) for the beautiful components
- [TradingView](https://www.tradingview.com) for charting capabilities
- [CoinGecko](https://www.coingecko.com) for market data
- [DexScreener](https://dexscreener.com) for DEX analytics
