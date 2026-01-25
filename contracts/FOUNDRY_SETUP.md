# Foundry Dependencies Installation Guide

## Issue
Foundry's `forge` command is not available in your current terminal session.

## Solution Options

### Option 1: Restart Terminal (Recommended)
After installing Foundry, you need to restart your terminal or add Foundry to PATH:

```powershell
# Close and reopen your terminal
# OR add to PATH manually:
$env:PATH += ";$HOME\.foundry\bin"
```

### Option 2: Manual Dependency Installation

Since `forge install` isn't working, you can manually clone the dependencies:

```bash
cd contracts
mkdir -p lib

# Clone OpenZeppelin
git clone https://github.com/OpenZeppelin/openzeppelin-contracts.git lib/openzeppelin-contracts

# Clone forge-std
git clone https://github.com/foundry-rs/forge-std.git lib/forge-std
```

### Option 3: Use Existing Setup

The project already has a `contracts` folder with the smart contract. You can:

1. **Skip testing for now** and proceed with deployment using Hardhat instead
2. **Use Remix IDE** to test and deploy the contract
3. **Wait for Foundry PATH** to be configured properly

## Quick Deploy with Remix

1. Go to https://remix.ethereum.org
2. Create new file: `PredictionMarket.sol`
3. Copy contract from `contracts/src/PredictionMarket.sol`
4. Install OpenZeppelin plugin in Remix
5. Compile and deploy to Monad Testnet

## Hardhat Alternative

The project already has Hardhat configured. You can use it instead:

```bash
cd contracts
npm install --save-dev @openzeppelin/contracts
npx hardhat compile
npx hardhat test
```

## Next Steps

Choose one of the options above based on your preference. The smart contract is ready to deploy!
