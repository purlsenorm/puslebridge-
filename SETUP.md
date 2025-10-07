# PulseBridge Setup Guide

## ✅ Completed Setup

Your PulseBridge application is now configured with the following APIs:

### API Keys Configured

1. **Moralis API** ✅
   - Used for: Token metadata, prices, wallet balances, on-chain data
   - Configured in: `.env.local`
   - Chain: PulseChain (0x171)

2. **Alchemy API** ✅
   - Used for: Enhanced RPC access (fallback)
   - Configured in: `.env.local`

3. **DexScreener API** ✅
   - Used for: Token discovery, pair data, liquidity, trading volume
   - No API key required (free tier)

4. **PulseChain RPC** ✅
   - Used for: Direct blockchain queries
   - Public endpoint: `https://rpc.pulsechain.com`

### Data Sources Strategy

Since we're not using CoinGecko (paid), here's how data is aggregated:

#### Token Discovery & Listing
- **Primary**: DexScreener API
  - Searches for active trading pairs
  - Provides real-time DEX data
  - Free and no rate limits

#### Token Prices
- **Primary**: Moralis API
  - Real-time token prices
  - 24h price changes
  - DEX routing information

- **Fallback**: DexScreener
  - When Moralis doesn't have price data
  - Uses latest pair price from DEX

#### Token Metadata
- **Primary**: Moralis API
  - Token name, symbol, decimals
  - Contract verification status
  - Total supply

- **Secondary**: PulseChain BlockScout
  - On-chain contract data
  - Transaction history
  - Holder information

#### Historical Charts
- **Current**: Simulated from 24h data
  - Generates realistic price movements
  - Based on current price and 24h change

- **Recommended Upgrade**:
  - Implement custom price indexer
  - Use paid historical data service
  - Or integrate with The Graph protocol

#### Wallet Balances
- **Primary**: Moralis API
  - All ERC20 tokens in wallet
  - Real-time balances
  - Token metadata included

## How Data Flows

### Home Page (Token List)
```
DexScreener → Get top trading pairs on PulseChain
    ↓
Transform to token format with:
- Price from pair data
- 24h volume
- Liquidity
- Price change %
```

### Token Detail Page
```
Moralis API (parallel requests):
├── Token Price (with 24h change)
├── Token Metadata (name, symbol, decimals)
└── Token Stats (holders, transfers)

DexScreener:
└── Trading Pairs (liquidity, volume, DEX info)

Result: Combined comprehensive token view
```

### Portfolio Page
```
Connected Wallet Address
    ↓
Moralis API
    ↓
All ERC20 tokens + balances
    ↓
Enrich with prices from Moralis/DexScreener
```

## API Rate Limits

### Moralis (Free Tier)
- **Requests**: Check your plan
- **Chains**: Multiple chains supported
- **Features**: Token prices, metadata, balances, transfers

### DexScreener
- **Requests**: No strict limits (be reasonable)
- **Best Practice**: Cache responses for 30-60 seconds
- **Data Freshness**: Real-time updates

### PulseChain RPC (Public)
- **Requests**: Community endpoint (be respectful)
- **Alternative**: Set up your own node
- **Alchemy**: Configured as fallback

## Testing Your Setup

1. **Start the dev server**:
   ```bash
   npm run dev
   ```

2. **Visit**: http://localhost:3000

3. **Check browser console** for API responses

4. **Expected behavior**:
   - Token list loads from DexScreener
   - Prices update every 30 seconds
   - Click token to view details
   - Charts show simulated historical data

## Troubleshooting

### No tokens loading
- Check browser console for errors
- Verify DexScreener API is accessible
- Check network tab for failed requests

### Moralis errors
- Verify API key in `.env.local`
- Check Moralis dashboard for usage limits
- Ensure PulseChain is supported in your plan

### Missing prices
- Moralis might not have all token prices
- Falls back to DexScreener pair prices
- Some low-volume tokens may not have data

## Upgrading Data Sources

### For Production, Consider:

1. **Historical Price Data**
   - Paid CoinGecko API
   - Custom price indexer
   - The Graph subgraphs

2. **Enhanced Analytics**
   - Dune Analytics
   - Custom database with indexed events
   - Real-time WebSocket feeds

3. **Better Performance**
   - Redis caching layer
   - PostgreSQL for aggregated data
   - CDN for static assets

## Current Limitations

1. **Historical Charts**: Simulated data (not real historical prices)
2. **Token Discovery**: Limited to actively traded pairs
3. **Market Stats**: Aggregated from available sources, not comprehensive

## Next Steps

1. ✅ Test token listing page
2. ✅ Test token detail pages
3. ✅ Test wallet connection
4. 📝 Add portfolio tracking
5. 📝 Implement price alerts
6. 📝 Add advanced filtering
7. 📝 Improve chart data with real historical prices

## Support

- **Moralis Docs**: https://docs.moralis.io
- **DexScreener API**: https://docs.dexscreener.com
- **PulseChain**: https://pulsechain.com
- **Next.js**: https://nextjs.org/docs
