# Prediction Market Smart Contract

Polymarket-style prediction market for YES/NO betting on Monad Testnet.

## Features

- ✅ Create prediction markets with YES/NO outcomes
- 💰 Bet with MON tokens
- 🏆 Winners share losers' stakes proportionally
- 📊 Real-time market odds
- 🔒 Secure with ReentrancyGuard
- 💸 2% platform fee

## Setup

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- Monad Testnet MON tokens

### Installation

```bash
cd contracts
forge install
```

### Configuration

1. Copy `.env.example` to `.env`
2. Add your private key and RPC URL

```bash
cp .env.example .env
```

## Testing

Run all tests:

```bash
forge test
```

Run with verbosity:

```bash
forge test -vvv
```

Run specific test:

```bash
forge test --match-test testPlaceBet
```

## Deployment

Deploy to Monad Testnet:

```bash
forge script script/Deploy.s.sol:DeployPredictionMarket --rpc-url monad_testnet --broadcast --verify
```

## Contract Functions

### User Functions

- `createMarket(question, duration)` - Create new market
- `placeBet(marketId, side)` - Bet on YES (true) or NO (false)
- `claimWinnings(betId)` - Claim winnings after resolution
- `getMarket(marketId)` - View market details
- `getUserBets(address)` - View user's bets
- `getMarketOdds(marketId)` - View current odds

### Admin Functions

- `resolveMarket(marketId, outcome)` - Resolve market (owner only)
- `withdrawFees()` - Withdraw platform fees (owner only)
- `setPlatformFee(percent)` - Update fee (owner only, max 10%)

## Profit Calculation

Winners receive proportional share of losing side's stakes:

```
Payout = (Your Bet / Total Winning Side) × Total Losing Side + Your Original Bet
```

Example:
- Alice bets 3 MON on YES
- Bob bets 1 MON on YES
- Charlie bets 4 MON on NO
- YES wins

Alice gets: 3 + (3/4 × 4) = 6 MON (minus 2% fee)
Bob gets: 1 + (1/4 × 4) = 2 MON (minus 2% fee)

## Security

- ReentrancyGuard prevents reentrancy attacks
- Ownable for access control
- No double claiming
- Safe math (Solidity 0.8+)

## License

MIT
