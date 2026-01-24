import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, createConfig, custom, fallback, http } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { injected, metaMask, safe } from 'wagmi/connectors'
import { monadTestnet } from '@/lib/web3/chains'

// Multi-chain support: Monad Testnet (primary) + Ethereum
const chains = [monadTestnet, mainnet] as const;

// Robust connector setup with MetaMask priority
const connectors = typeof window !== 'undefined' ? [
  metaMask(), // MetaMask first for multi-chain support
  injected(), // Generic injected provider
  miniAppConnector(), // Farcaster Mini App support
  safe(), // Safe wallet support
] : [];

// Use wallet provider (window.ethereum) instead of direct HTTP to avoid CORS
const getTransport = () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    // Use injected provider (MetaMask) as primary transport
    return custom(window.ethereum);
  }
  // Fallback to http only if no wallet is available (won't be used in practice)
  return http();
};

export const config = createConfig({
  chains,
  transports: {
    [monadTestnet.id]: getTransport(),
    [mainnet.id]: getTransport(),
  },
  connectors,
  ssr: true,
})

const queryClient = new QueryClient()

export function WalletProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
