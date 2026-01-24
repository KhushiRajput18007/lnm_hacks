# Attention Roulette - Quick Start Guide

## 🚀 Installation

This project now supports **both npm and pnpm**!

### Using npm (Recommended for this setup)
```bash
npm install --legacy-peer-deps
npm run dev
```

### Using pnpm
```bash
pnpm install
pnpm dev
```

## 🌐 Multi-Chain Support

The app now supports:
- **Monad Testnet** (Primary - Real transactions)
- **Ethereum Mainnet** (Mock transactions)
- **Solana** (Placeholder for future)

## 🔧 Environment Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. **Optional**: Add contract addresses for real transactions:
```env
NEXT_PUBLIC_MONAD_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_ETHEREUM_CONTRACT_ADDRESS=0x...
```

3. **Optional**: Enable AI features:
```env
NEXT_PUBLIC_ENABLE_AI=true
NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
```

> **Note**: The app will run perfectly fine without any environment variables! It will use mock data and transactions.

## 🦊 MetaMask Setup

1. Install [MetaMask](https://metamask.io/)
2. The app will automatically prompt you to add Monad Testnet
3. Get testnet MON tokens from the [Monad Faucet](https://faucet.monad.xyz)

## 📱 Usage

1. Open http://localhost:3000
2. Click "Connect Wallet"
3. Select MetaMask (or Farcaster if in Warpcast)
4. Browse prediction markets
5. Click YES or NO to place a bet
6. Confirm the transaction in MetaMask
7. Enjoy the confetti! 🎉

## 🔍 Features

- ✅ MetaMask multi-chain support
- ✅ Farcaster Mini App compatibility
- ✅ Real transactions on Monad Testnet
- ✅ Mock transactions on other chains
- ✅ AI-generated prediction questions (optional)
- ✅ Graceful fallback for missing APIs
- ✅ Zero runtime errors guarantee

## 🐛 Troubleshooting

### "Please install MetaMask"
- Install the MetaMask browser extension

### "Please switch to MON network"
- The app will auto-prompt to add Monad Testnet
- Click "Approve" in MetaMask

### npm install fails
- Use `npm install --legacy-peer-deps`
- Or use `pnpm install` instead

## 🎯 Hackathon MVP Notes

This is a **hackathon MVP** focused on:
- Stability over features
- Mock data over crashes
- Simple demo over production perfection

Contract addresses are optional - the app will mock transactions if not set!
