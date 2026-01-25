# Quick Fix for OpenZeppelin Import Errors

The OpenZeppelin contracts are not installing properly via PowerShell. Here's the fastest solution:

## Option 1: Use `forge install` (Recommended)

Open your **bash terminal** (where forge works) and run:

```bash
cd contracts
forge install OpenZeppelin/openzeppelin-contracts@v5.0.1 --no-commit
forge test
```

## Option 2: Manual Download (If forge install fails)

1. Download OpenZeppelin manually:
   - Go to: https://github.com/OpenZeppelin/openzeppelin-contracts/releases/tag/v5.0.1
   - Download `Source code (zip)`
   
2. Extract to `contracts/lib/openzeppelin-contracts`

3. Verify the structure:
   ```
   contracts/lib/openzeppelin-contracts/
   ├── contracts/
   │   ├── access/
   │   │   └── Ownable.sol
   │   └── security/
   │       └── ReentrancyGuard.sol
   ```

4. Run `forge test`

## Option 3: Use Hardhat Instead

If Foundry continues to have issues:

```bash
cd contracts
npm install @openzeppelin/contracts
# Update imports in PredictionMarket.sol to use node_modules path
npx hardhat compile
```

## Verification

After installation, verify with:
```bash
ls lib/openzeppelin-contracts/contracts/security/ReentrancyGuard.sol
```

Should show the file exists.
