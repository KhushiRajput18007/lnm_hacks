import { defineChain } from 'viem';
import { mainnet } from 'viem/chains';

/**
 * Monad Testnet Chain Configuration
 */
export const monadTestnet = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet.monad.xyz'],
    },
    public: {
      http: ['https://testnet.monad.xyz'],
    },
  },
  blockExplorers: {
    default: { name: 'Monad Explorer', url: 'https://explorer.testnet.monad.xyz' },
  },
  testnet: true,
});

/**
 * Ethereum Mainnet (re-exported for consistency)
 */
export const ethereum = mainnet;

/**
 * Solana Placeholder (for future integration)
 * Note: Solana uses a different architecture, this is a placeholder
 */
export const solanaPlaceholder = {
  id: 900, // Placeholder ID
  name: 'Solana',
  nativeCurrency: {
    decimals: 9,
    name: 'Solana',
    symbol: 'SOL',
  },
  rpcUrls: {
    default: {
      http: ['https://api.mainnet-beta.solana.com'],
    },
  },
  testnet: false,
  // Note: This is not a real EVM chain, just a placeholder for UI
};

/**
 * Supported chains for the application
 */
export const SUPPORTED_CHAINS = [monadTestnet, ethereum] as const;

/**
 * Default chain (Monad Testnet)
 */
export const DEFAULT_CHAIN = monadTestnet;

/**
 * Chain-specific contract addresses
 */
export const CONTRACT_ADDRESSES: Record<number, string> = {
  [monadTestnet.id]: process.env.NEXT_PUBLIC_MONAD_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
  [ethereum.id]: process.env.NEXT_PUBLIC_ETHEREUM_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000',
};

/**
 * Get contract address for a specific chain
 */
export function getContractAddress(chainId: number): string {
  return CONTRACT_ADDRESSES[chainId] || CONTRACT_ADDRESSES[monadTestnet.id];
}

/**
 * Check if a chain is supported
 */
export function isSupportedChain(chainId: number): boolean {
  return SUPPORTED_CHAINS.some(chain => chain.id === chainId);
}

/**
 * Get chain configuration by ID
 */
export function getChainById(chainId: number) {
  return SUPPORTED_CHAINS.find(chain => chain.id === chainId);
}

/**
 * Get chain name by ID
 */
export function getChainName(chainId: number): string {
  const chain = getChainById(chainId);
  return chain?.name || 'Unknown Chain';
}

/**
 * Get native currency symbol by chain ID
 */
export function getNativeCurrencySymbol(chainId: number): string {
  const chain = getChainById(chainId);
  return chain?.nativeCurrency.symbol || 'ETH';
}
