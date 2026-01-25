#!/bin/bash

# Monad Testnet Deployment Script
# This script will prompt you for your private key and deploy the contract

echo "==================================="
echo "PredictionMarket Deployment Script"
echo "==================================="
echo ""
echo "Please enter your MetaMask private key (starts with 0x):"
read -s PRIVATE_KEY
echo ""
echo "Deploying to Monad Testnet..."
echo ""

forge create src/PredictionMarket.sol:PredictionMarket \
  --rpc-url https://testnet-rpc.monad.xyz \
  --private-key "$PRIVATE_KEY" \
  --legacy

echo ""
echo "Deployment complete!"
echo "Save the contract address above for frontend integration."
